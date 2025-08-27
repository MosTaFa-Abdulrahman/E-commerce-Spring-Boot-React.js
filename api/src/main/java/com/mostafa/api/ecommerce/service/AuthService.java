package com.mostafa.api.ecommerce.service;


import com.mostafa.api.ecommerce.config.JwtHelper;
import com.mostafa.api.ecommerce.dto.auth.LoginDto;
import com.mostafa.api.ecommerce.dto.auth.RegisterDto;
import com.mostafa.api.ecommerce.exception.CustomResponseException;
import com.mostafa.api.ecommerce.model.User;
import com.mostafa.api.ecommerce.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtHelper jwtHelper;


    // Register
    public void register(RegisterDto dto) {
        User userAccount = new User();

        userAccount.setUsername(dto.username());
        userAccount.setEmail(dto.email());
        userAccount.setPassword(passwordEncoder.encode(dto.password()));

        userRepo.save(userAccount);
    }


    //    Login
    public Map<String, Object> login(LoginDto dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.username(), dto.password()));

        User user = userRepo.findOneByUsername(dto.username())
                .orElseThrow(CustomResponseException::BadCredentials);

        Map<String, Object> customClaims = new HashMap<>();
        customClaims.put("userId", user.getId());

        String token = jwtHelper.generateToken(customClaims, user);

        // Prepare response with token and user info
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());

        return response;
    }

}
