package com.mostafa.api.ecommerce.repository;

import com.mostafa.api.ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;


@Repository
public interface ProductRepo extends JpaRepository<Product, UUID> {
    //    Get All Products By ((categoryId))
    List<Product> findByCategoryId(UUID categoryId);

    //    Get All Products By ((name || description))
    List<Product> findByNameOrDescriptionContaining(String name, String description);


}
