package com.mostafa.api.ecommerce.repository;

import com.mostafa.api.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;


@Repository
public interface UserRepo extends JpaRepository<User, UUID> {
    //    Get User By ((username))
    Optional<User> findOneByUsername(String username);


    //    Get User By ((email))
    Optional<User> findByEmail(String email);


}
