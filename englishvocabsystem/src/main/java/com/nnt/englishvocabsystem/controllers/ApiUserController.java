package com.nnt.englishvocabsystem.controllers;

import com.nnt.englishvocabsystem.services.UserService;
import com.nnt.englishvocabsystem.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.nnt.englishvocabsystem.entity.User;
import java.security.Principal;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api") // nếu muốn prefix API
@CrossOrigin
public class ApiUserController {
    @Autowired
    private UserService userService;

    @PostMapping(path = "/users",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> create(@RequestParam Map<String, String> params,
                                       @RequestParam(value = "avatar", required = false) MultipartFile avatar) {
        return new ResponseEntity<>(this.userService.addUser(params, avatar), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User u) {
        if (this.userService.authenticate(u.getUsername(), u.getPassword())) {
            try {
                String token = JwtUtils.generateToken(u.getUsername());
                return ResponseEntity.ok().body(Collections.singletonMap("token", token));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error generating JWT");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
    }

    @GetMapping("/secure/profile")
    public ResponseEntity<User> getProfile(Principal principal) {
        return ResponseEntity.ok(this.userService.getUserByUsername(principal.getName()));
    }

    @DeleteMapping("/users/{username}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable(value = "username") String username) {
        this.userService.deleteUserByUserName(username);
    }

}
