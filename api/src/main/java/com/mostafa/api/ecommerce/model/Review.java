package com.mostafa.api.ecommerce.model;

import com.mostafa.api.ecommerce.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;


@Entity
@Table(name = "reviews")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Review extends BaseEntity<UUID> {
    @Column(name = "rating")
    private int rating;

    @Column(name = "description")
    private String description;


    //    Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

}
