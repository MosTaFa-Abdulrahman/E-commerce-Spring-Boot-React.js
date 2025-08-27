package com.mostafa.api.ecommerce.service;


import com.mostafa.api.ecommerce.dto.favourites.CreateFavouritesDTO;
import com.mostafa.api.ecommerce.dto.favourites.FavouritesResponseDTO;
import com.mostafa.api.ecommerce.exception.CustomResponseException;
import com.mostafa.api.ecommerce.mapper.EntityDtoMapper;
import com.mostafa.api.ecommerce.model.Favourites;
import com.mostafa.api.ecommerce.model.Product;
import com.mostafa.api.ecommerce.model.User;
import com.mostafa.api.ecommerce.repository.FavouritesRepo;
import com.mostafa.api.ecommerce.repository.ProductRepo;
import com.mostafa.api.ecommerce.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FavouritesService {
    private final UserRepo userRepo;
    private final ProductRepo productRepo;
    private final FavouritesRepo favouritesRepo;
    private final EntityDtoMapper mapper;


    //    Create
    public FavouritesResponseDTO createFavourite(CreateFavouritesDTO dto) {
        User user = userRepo.findById(dto.userId())
                .orElseThrow(() -> CustomResponseException.ResourceNotFound(
                        "User not Found with this ID: " + dto.userId()
                ));
        Product product = productRepo.findById(dto.productId())
                .orElseThrow(() -> CustomResponseException.ResourceNotFound(
                        "Product not Found with this ID: " + dto.productId()
                ));

        Favourites favourites = new Favourites();
        favourites.setUser(user);
        favourites.setProduct(product);

        Favourites savedFavourite = favouritesRepo.save(favourites);

        return mapper.mapToFavouritesResponseDTO(savedFavourite);
    }

    //    Get Single
    public FavouritesResponseDTO getByFavouriteId(UUID favouriteId) {
        Favourites favourite = favouritesRepo.findById(favouriteId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound(
                        "Favourite Not Found with this ID: " + favouriteId
                ));

        return mapper.mapToFavouritesResponseDTO(favourite);
    }


    //    Delete
    public String deleteFavourite(UUID favouriteId) {
        Favourites existingFavourite = favouritesRepo.findById(favouriteId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound(
                        "Favourite Not Found with this ID:  " + favouriteId
                ));

        favouritesRepo.delete(existingFavourite);

        return "Favourite deleted successfully";
    }


    // ***************************** ((Specifications)) *********************** //

    // Get All Favourites for Specific ((USER))
    public List<FavouritesResponseDTO> getFavouritesByUserId(UUID userId) {
        userRepo.findById(userId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound(
                        "User not found with this ID: " + userId
                ));

        List<Favourites> favourites = favouritesRepo.findByUserId(userId);


        return favourites.stream()
                .map(mapper::mapToFavouritesResponseDTO)
                .toList();
    }


}
