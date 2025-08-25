package org.projectbakso.apigateway.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry
            .addMapping("/**") // Apply to all routes in the gateway
            .allowedOrigins("http://localhost:3000") // Your frontend URL
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH") // Allowed HTTP methods
            .allowedHeaders("*") // Allow all headers
            .allowCredentials(true); // Crucial for authentication
    }
}
