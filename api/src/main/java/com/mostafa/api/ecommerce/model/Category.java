package com.mostafa.api.ecommerce.model;


import com.mostafa.api.ecommerce.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "categories")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Category extends BaseEntity<UUID> {
    @Column(name = "name", unique = true, nullable = false)
    private String name;

    //    RelationShips
    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Product> products;
}
