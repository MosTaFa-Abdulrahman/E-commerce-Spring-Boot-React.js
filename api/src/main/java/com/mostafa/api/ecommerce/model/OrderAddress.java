package com.mostafa.api.ecommerce.model;


import jakarta.persistence.*;
import lombok.*;


@Embeddable // that is Embeddable Class For ((Order-Address))
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderAddress {
    @Column(name = "address_name")
    private String addressName;


    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "lat", column = @Column(name = "address_lat")),
            @AttributeOverride(name = "lng", column = @Column(name = "address_lng"))
    })
    private LatLng addressLatLng;


}
