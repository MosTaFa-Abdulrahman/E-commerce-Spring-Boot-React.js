package com.mostafa.api.ecommerce.repository;


import com.mostafa.api.ecommerce.model.Favourites;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;


@Repository
public interface FavouritesRepo extends JpaRepository<Favourites, UUID> {
    @Query("SELECT f FROM Favourites f WHERE f.user.id = :userId")
    List<Favourites> findByUserId(@Param("userId") UUID userId);
}
