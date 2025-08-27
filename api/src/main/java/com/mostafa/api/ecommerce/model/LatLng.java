package com.mostafa.api.ecommerce.model;


import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;


@Embeddable // that is Embeddable Class For ((Coordinates))
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LatLng {
    @Column(name = "latitude", nullable = false)
    private String lat;

    @Column(name = "longitude", nullable = false)
    private String lng;


}
