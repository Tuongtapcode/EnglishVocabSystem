package com.nnt.englishvocabsystem.services.impl;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.exceptions.DuplicateFieldException;
import com.nnt.englishvocabsystem.repositories.UserRepository;

import com.nnt.englishvocabsystem.services.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;


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
        return u != null && this.passwordEncoder.matches(password, u.getPassword());
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
}