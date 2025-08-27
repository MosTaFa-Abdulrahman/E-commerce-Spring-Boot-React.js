package com.mostafa.api.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;


@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAwareImpl")
public class ApiEcommerceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiEcommerceApplication.class, args);
    }
}
