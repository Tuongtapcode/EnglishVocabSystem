package com.nnt.englishvocabsystem.services;


import com.nnt.englishvocabsystem.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface UserService extends UserDetailsService {
    User getUserByUsername(String username);
    User addUser(Map<String, String> params, MultipartFile avatar);
    boolean authenticate(String username, String password);
    Page<User> getAllUsers(Map<String, String> params);

    void addOrUpdateUser(User user);
    void deleteUserByUserName(String username);
}