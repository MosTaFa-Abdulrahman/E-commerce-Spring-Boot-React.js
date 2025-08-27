package com.mostafa.api.ecommerce.controller;


import com.mostafa.api.ecommerce.dto.favourites.CreateFavouritesDTO;
import com.mostafa.api.ecommerce.dto.favourites.FavouritesResponseDTO;
import com.mostafa.api.ecommerce.exception.GlobalResponse;
import com.mostafa.api.ecommerce.service.FavouritesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/favourites")
public class FavouritesController {
    private final FavouritesService favouritesService;


    //    Create
    @PostMapping
    public ResponseEntity<GlobalResponse<FavouritesResponseDTO>> createFavourite(
            @Valid @RequestBody CreateFavouritesDTO dto
    ) {
        FavouritesResponseDTO createdFavourite = favouritesService.createFavourite(dto);
        GlobalResponse<FavouritesResponseDTO> res = new GlobalResponse<>(createdFavourite);

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    //    Get Single
    @GetMapping("/{favouriteId}")
    public ResponseEntity<GlobalResponse<FavouritesResponseDTO>> getById(
            @PathVariable UUID favouriteId) {
        FavouritesResponseDTO favourite = favouritesService.getByFavouriteId(favouriteId);
        GlobalResponse<FavouritesResponseDTO> res = new GlobalResponse<>(favourite);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //    Delete
    @DeleteMapping("/{favouriteId}")
    public ResponseEntity<GlobalResponse<String>> deleteFavourite(
            @PathVariable UUID favouriteId
    ) {
        String deletedFavourite = favouritesService.deleteFavourite(favouriteId);
        GlobalResponse<String> res = new GlobalResponse<>(deletedFavourite);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }


    // ***************************** ((Specifications)) *********************** //
    // Get All Favourites for Specific ((USER))
    @GetMapping("/user/{userId}")
    public ResponseEntity<GlobalResponse<List<FavouritesResponseDTO>>> getFavouritesByUserId(
            @PathVariable UUID userId) {
        List<FavouritesResponseDTO> favourites = favouritesService.getFavouritesByUserId(userId);
        GlobalResponse<List<FavouritesResponseDTO>> response = new GlobalResponse<>(favourites);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


}
