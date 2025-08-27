package com.mostafa.api.ecommerce.service;


import com.mostafa.api.ecommerce.dto.user.UpdateUserDTO;
import com.mostafa.api.ecommerce.dto.user.UserResponseDTO;
import com.mostafa.api.ecommerce.dto.user.UserResponseSummaryDTO;
import com.mostafa.api.ecommerce.exception.CustomResponseException;
import com.mostafa.api.ecommerce.mapper.EntityDtoMapper;
import com.mostafa.api.ecommerce.model.User;
import com.mostafa.api.ecommerce.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepo userRepo;
    private final EntityDtoMapper mapper;


    //    Update
    public UserResponseSummaryDTO updateUser(UUID userId, UpdateUserDTO dto) {
        User existingUser = userRepo.findById(userId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("User Not Found with This ID:  " + userId));

        existingUser.setPhoneNumber(dto.phoneNumber());
        User updatedUser = userRepo.save(existingUser);

        return mapper.toUserSummaryDTO(updatedUser);
    }

    //    Delete ((userId))
    public String deleteByUserId(UUID userId) {
        userRepo.findById(userId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("User Not Found with This ID:  " + userId));

        userRepo.deleteById(userId);
        return "User Deleted Success with this ID: " + userId;
    }

    //    Get All
    public Page<UserResponseSummaryDTO> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> usersPage = userRepo.findAll(pageable);

        return usersPage.map(mapper::toUserSummaryDTO);
    }

    //    Get By ((userId)
    public UserResponseDTO getByUserId(UUID userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("User Not Found with This ID:  " + userId));

        return mapper.toUserResponseDTO(user);
    }


}
