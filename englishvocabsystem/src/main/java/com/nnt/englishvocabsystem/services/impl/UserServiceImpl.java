package com.nnt.englishvocabsystem.services.impl;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.exceptions.DuplicateFieldException;
import com.nnt.englishvocabsystem.repositories.UserRepository;

import com.nnt.englishvocabsystem.services.UserService;
import com.nnt.englishvocabsystem.utils.RequestParamUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;


@Service
@Transactional
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private Cloudinary cloudinary;

    public User getUserByUsername(String username) {
        return this.userRepo.findByUsername(username);
    }

    @Override
    public User addUser(Map<String, String> params, MultipartFile avatar) {
        String username = params.get("username");
        String email = params.get("email");

        // Optional: check trước để báo nhanh
        if (userRepo.existsByUsername(username)) {
            throw new DuplicateFieldException("username", "Username đã tồn tại.");
        }
        if (userRepo.existsByEmail(email)) {
            throw new DuplicateFieldException("email", "Email đã được sử dụng.");
        }

        User u = new User();
        u.setFirstName(params.get("firstName"));
        u.setLastName(params.get("lastName"));
        u.setEmail(email);
        u.setPhone(params.get("phone"));
        u.setUsername(username);
        u.setPassword(this.passwordEncoder.encode(params.get("password")));
        u.setUserRole("ROLE_USER");
        u.setUserType("FREE");
        Instant now = Instant.now();
        u.setCreatedAt(now);
        u.setUpdatedAt(now);
        u.setLastLoginAt(null);

        if (avatar != null && !avatar.isEmpty()) {
            try {
                Map<?, ?> res = cloudinary.uploader()
                        .upload(avatar.getBytes(), ObjectUtils.asMap("resource_type", "auto"));
                u.setAvatar(res.get("secure_url").toString());
            } catch (IOException ex) {
                throw new RuntimeException("Upload avatar failed", ex);
            }
        }

        try {
            return this.userRepo.save(u);
        } catch (org.springframework.dao.DataIntegrityViolationException ex) {
            // Kiểm tra thông báo lỗi SQL để xác định trùng username/email
            if (ex.getRootCause() != null && ex.getRootCause().getMessage().contains("user.username")) {
                throw new DuplicateFieldException("username", "Username đã tồn tại, vui lòng chọn username khác.");
            }
            if (ex.getRootCause() != null && ex.getRootCause().getMessage().contains("user.email")) {
                throw new DuplicateFieldException("email", "Email đã được sử dụng.");
            }
            throw ex; // nếu là lỗi khác thì vẫn ném tiếp
        }
    }


    public boolean authenticate(String username, String password) {
        User u = this.userRepo.findByUsername(username);
        if (u != null && this.passwordEncoder.matches(password, u.getPassword())) {
            // Cập nhật lastLoginAt
            u.setLastLoginAt(Instant.now());
            this.userRepo.save(u);  // Lưu vào DB
            return true;
        }
        return false;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = this.getUserByUsername(username);
        if (u == null) {
            throw new UsernameNotFoundException("Invalid username!");
        }

        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority(u.getUserRole()));

        return new org.springframework.security.core.userdetails.User(
                u.getUsername(), u.getPassword(), authorities);
    }

    @Override
    public Page<User> getAllUsers(Map<String, String> params) {
        int page = RequestParamUtils.parseIntSafe(params.get("page"), 0);
        int size = RequestParamUtils.parseIntSafe(params.get("size"), 10);
        String sortBy = params.getOrDefault("sortBy", "id");
        String direction = params.getOrDefault("direction", "asc");

        Sort sort = Sort.by(
                direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC,
                sortBy
        );
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<User> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Search theo username
            String keyword = params.get("keyword");
            if (RequestParamUtils.hasText(keyword)) {
                String kwLower = "%" + keyword.toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("username").as(String.class)), kwLower));
            }

            // Filter theo user_type
            String userType = params.get("userType");
            if (RequestParamUtils.hasText(userType)) {
                predicates.add(
                        cb.equal(cb.lower(root.get("userType").as(String.class)), userType.toLowerCase())
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return userRepo.findAll(spec, pageable);
    }

    @Override
    public void addOrUpdateUser(User user) {
        try {
            User existing = null;
            if (user.getId() != null) {
                existing = userRepo.findById(user.getId()).orElse(null);
            }

            if (existing != null) {
                user.setCreatedAt(existing.getCreatedAt()); // giữ createdAt cũ
                user.setLastLoginAt(existing.getLastLoginAt());
            } else {
                user.setCreatedAt(Instant.now());
            }

            user.setUpdatedAt(Instant.now());

            // Upload avatar nếu có
            if (user.getFileAvatar() != null && !user.getFileAvatar().isEmpty()) {
                Map<?, ?> res = cloudinary.uploader().upload(
                        user.getFileAvatar().getBytes(),
                        ObjectUtils.asMap("resource_type", "auto")
                );
                user.setAvatar(res.get("secure_url").toString());
            }

            // Có thể hash password nếu là mới hoặc password được cập nhật
            if (existing == null || !existing.getPassword().equals(user.getPassword())) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            }

            // Lưu xuống DB
            userRepo.save(user);

        } catch (IOException e) {
            Logger.getLogger(UserServiceImpl.class.getName()).log(Level.SEVERE, null, e);
            throw new RuntimeException("Upload avatar thất bại!", e);
        }
    }

    @Override
    public void deleteUserByUserName(String username) {
        User user = userRepo.findByUsername(username);
        if (user == null) {
            throw new EntityNotFoundException("User với username " + username + " không tồn tại");
        }
        userRepo.delete(user);
    }
}