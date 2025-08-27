package com.mostafa.api.ecommerce.service;


import com.mostafa.api.ecommerce.model.User;
import com.mostafa.api.ecommerce.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepo userRepo;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userAccount = userRepo.findOneByUsername(username);
        if (userAccount.isEmpty()) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        // Return the User entity directly since it implements UserDetails
        return userAccount.get();
    }


}
