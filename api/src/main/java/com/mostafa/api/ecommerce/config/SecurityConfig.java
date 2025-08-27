package com.mostafa.api.ecommerce.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final UserDetailsService userDetailsService;
    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(c -> {
                    CorsConfigurationSource source = corsConfigurationSource();
                    c.configurationSource(source);
                })
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers(
                            "/api/auth/register",
                            "/api/auth/login").permitAll()
                            // Swagger/OpenAPI endpoints
                            .requestMatchers(
                                    "/swagger-ui/**",
                                    "/swagger-ui.html",
                                    "/api-docs/**",
                                    "/v3/api-docs/**",
                                    "/swagger-resources/**",
                                    "/webjars/**")
                            .permitAll()
                            // NEW: Allow authenticated users to access /me endpoint
                            .requestMatchers(HttpMethod.GET, "/api/auth/me").authenticated()
                            .requestMatchers(HttpMethod.POST, "/api/auth/logout").authenticated()
                            // ((Users)) //
                            .requestMatchers(HttpMethod.PUT, "/api/users/{userId}").hasRole("USER")
                            .requestMatchers(HttpMethod.DELETE, "/api/users/{userId}").hasAnyRole("ADMIN", "USER")
                            .requestMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/users/{userId}").hasAnyRole("ADMIN", "USER")
                            // ((Categories)) //
                            .requestMatchers(HttpMethod.POST, "/api/categories").permitAll()
                            .requestMatchers(HttpMethod.PUT, "/api/categories/{categoryId}").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.DELETE, "/api/categories/{categoryId}").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/categories").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/categories/{categoryId}").hasAnyRole("ADMIN", "USER")
                            // ((Products)) //
                            .requestMatchers(HttpMethod.POST, "/api/products").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.PUT, "/api/products/{productId}").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.DELETE, "/api/products/{productId}").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/products").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/products/{productId}").hasAnyRole("ADMIN", "USER")
                            // ((Addresses)) //
                            .requestMatchers(HttpMethod.POST, "/api/addresses").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.PUT, "/api/addresses/**").hasAnyRole("USER", "ADMIN")
                            // ((Reviews)) //
                            .requestMatchers(HttpMethod.POST, "/api/reviews").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.DELETE, "/api/reviews/{reviewId}").authenticated()
                            .requestMatchers(HttpMethod.GET, "/api/reviews/product/{productId}").authenticated()
                            // ((Favourites)) //
                            .requestMatchers(HttpMethod.POST, "/api/favourites").authenticated()
                            .requestMatchers(HttpMethod.GET, "/api/favourites/{favouriteId}").authenticated()
                            .requestMatchers(HttpMethod.DELETE, "/api/favourites/{favouriteId}").authenticated()
                            .requestMatchers(HttpMethod.GET, "/api/favourites/user/{userId}").authenticated()
                            // ((Orders)) //
                            .requestMatchers(HttpMethod.POST, "/api/orders").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.PUT, "/api/orders/{orderId}").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.PUT, "/api/orders/payment").authenticated()
                            .requestMatchers(HttpMethod.DELETE, "/api/orders/{orderId}").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/orders").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/orders/{orderId}").hasAnyRole("ADMIN", "USER")
                            .requestMatchers(HttpMethod.GET, "/api/orders/{userId}/user").hasAnyRole("ADMIN", "USER")
                            .anyRequest()
                            .authenticated();

                })
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .authenticationManager(authenticationManager(http));

        return http.build();
    }

    @Bean
    AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        var authBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());

        return authBuilder.build();
    }

    // @Bean
    // public CorsConfigurationSource corsConfigurationSource() {
    // CorsConfiguration configuration = new CorsConfiguration();
    // configuration.setAllowedOrigins(List.of("https://react-ecommerce-rho-nine.vercel.app"));
    // configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE",
    // "PATCH", "OPTIONS"));
    // configuration.setAllowedHeaders(List.of("*"));
    // configuration.setAllowCredentials(true);

    // UrlBasedCorsConfigurationSource source = new
    // UrlBasedCorsConfigurationSource();
    // source.registerCorsConfiguration("/**", configuration);
    // return source;
    // }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Enhanced CORS configuration for Vercel deployment
        configuration.setAllowedOriginPatterns(Arrays.asList(
                "https://react-ecommerce-rho-nine.vercel.app",
                "https://*.vercel.app", // Allow any Vercel subdomain
                "http://localhost:5173", // For Vite local development
                "http://localhost:3000" // For local development
        ));

        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"));

        configuration.setAllowedHeaders(Arrays.asList(
                "Origin",
                "Content-Type",
                "Accept",
                "Authorization",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers",
                "X-Requested-With",
                "Cache-Control"));

        configuration.setExposedHeaders(Arrays.asList(
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Credentials",
                "Authorization"));

        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // Cache preflight for 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
