package org.projectbakso.apigateway.config;

import java.net.URI;
import org.projectbakso.apigateway.filter.AuthenticationFilter;
import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.function.RequestPredicates;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

@Configuration
public class GatewayConfig {

    private final AuthenticationFilter authenticationFilter;

    public GatewayConfig(AuthenticationFilter authenticationFilter) {
        this.authenticationFilter = authenticationFilter;
    }

    // A dedicated, UNFILTERED route for public authentication endpoints
    @Bean
    public RouterFunction<ServerResponse> publicUserRoutes() {
        return GatewayRouterFunctions.route("public-user-service")
            .route(
                RequestPredicates.path("/api/users/auth/**"), // Matches /login, /signup, etc.
                HandlerFunctions.http(URI.create("http://user-service:5001"))
            )
            .build();
    }

    // A route for PROTECTED user endpoints that applies the authentication filter
    @Bean
    public RouterFunction<ServerResponse> protectedUserRoutes() {
        return GatewayRouterFunctions.route("protected-user-service")
            .route(
                // This now specifically targets routes *other than* /auth
                RequestPredicates.path("/api/users/**").and(
                    RequestPredicates.path("/api/users/auth/**").negate()
                ),
                HandlerFunctions.http(URI.create("http://user-service:5001"))
            )
            .filter(authenticationFilter.apply()) // The filter is ONLY applied here
            .build();
    }

    // --- Revised Campaign Routes ---

    /**
     * PROTECTED routes for campaign write operations (POST, PUT, DELETE).
     * These require authentication.
     */
    @Bean
    public RouterFunction<ServerResponse> protectedCampaignRoutes() {
        return GatewayRouterFunctions.route("protected-campaign-service")
            .route(
                // Matches any POST, PUT, or DELETE request under /campaigns/
                RequestPredicates.path("/campaigns/**").and(
                    RequestPredicates.method(HttpMethod.POST)
                        .or(RequestPredicates.method(HttpMethod.PUT))
                        .or(RequestPredicates.method(HttpMethod.DELETE))
                ),
                HandlerFunctions.http(
                    URI.create("http://campaign-service:8001")
                )
            )
            .filter(authenticationFilter.apply()) // The filter is ONLY applied here
            .build();
    }

    /**
     * PUBLIC routes for campaign read operations (GET).
     * These are publicly accessible and do not require authentication.
     */
    @Bean
    public RouterFunction<ServerResponse> publicCampaignRoutes() {
        return GatewayRouterFunctions.route("public-campaign-service")
            .route(
                // Matches ALL GET requests under /campaigns/, including /campaigns and /campaigns/{id}
                RequestPredicates.GET("/campaigns/**"),
                HandlerFunctions.http(
                    URI.create("http://campaign-service:8001")
                )
            )
            .build(); // No filter applied
    }

    @Bean
    public RouterFunction<ServerResponse> publicNotificationRoutes() {
        return GatewayRouterFunctions.route("public-notification-service")
                .route(
                        RequestPredicates.path("/notifications/**")
                                .and(RequestPredicates.method(org.springframework.http.HttpMethod.GET)
                                        .or(RequestPredicates.method(org.springframework.http.HttpMethod.POST))
                                        .or(RequestPredicates.method(org.springframework.http.HttpMethod.PUT))
                                        .or(RequestPredicates.method(org.springframework.http.HttpMethod.DELETE))),
                        HandlerFunctions.http(
                                URI.create("http://notification-service:8002")
                        )
                )
                .build(); // No filter applied
    }

}
