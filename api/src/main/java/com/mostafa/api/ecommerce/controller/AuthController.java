package com.mostafa.api.ecommerce.controller;


import com.mostafa.api.ecommerce.dto.auth.LoginDto;
import com.mostafa.api.ecommerce.dto.auth.LoginResponseDto;
import com.mostafa.api.ecommerce.dto.auth.RegisterDto;
import com.mostafa.api.ecommerce.dto.user.UserInfoDto;
import com.mostafa.api.ecommerce.exception.GlobalResponse;
import com.mostafa.api.ecommerce.model.User;
import com.mostafa.api.ecommerce.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;


    @PostMapping("/register")
    public ResponseEntity<GlobalResponse<String>> register(@RequestBody RegisterDto dto) {
        authService.register(dto);

        return new ResponseEntity<>(new GlobalResponse<>("Registerd Successfully"), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<GlobalResponse<LoginResponseDto>> login(@RequestBody LoginDto dto) {
        Map<String, Object> loginData = authService.login(dto);

        // Safe casting with proper handling
        LoginResponseDto response = new LoginResponseDto(
                (String) loginData.get("token"),
                (UUID) loginData.get("userId"),
                (String) loginData.get("username"),
                (String) loginData.get("email"),
                (String) loginData.get("role") // This should now be a String from the service
        );

        return new ResponseEntity<>(new GlobalResponse<>(response), HttpStatus.OK);
    }


    @GetMapping("/me")
    public ResponseEntity<GlobalResponse<UserInfoDto>> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() ||
                authentication.getPrincipal().equals("anonymousUser")) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // Get user info from authentication
        User currentUser = (User) authentication.getPrincipal();

        UserInfoDto userInfo = new UserInfoDto(
                currentUser.getId(),
                currentUser.getUsername(),
                currentUser.getEmail(),
                currentUser.getRole().name()
        );

        return new ResponseEntity<>(new GlobalResponse<>(userInfo), HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<GlobalResponse<String>> logout() {
        // Clear security context
        SecurityContextHolder.clearContext();
        return new ResponseEntity<>(new GlobalResponse<>("Logged out successfully"), HttpStatus.OK);
    }

}
