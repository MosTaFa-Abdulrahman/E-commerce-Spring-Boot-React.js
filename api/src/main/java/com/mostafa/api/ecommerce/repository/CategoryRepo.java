package com.mostafa.api.ecommerce.repository;

import com.mostafa.api.ecommerce.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface CategoryRepo extends JpaRepository<Category, UUID> {
    //    Found or Not
    boolean existsByName(String name);


}
