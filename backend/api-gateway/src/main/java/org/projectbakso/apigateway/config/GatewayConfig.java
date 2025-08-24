package org.projectbakso.apigateway.config;

import java.net.URI;
import org.projectbakso.apigateway.filter.AuthenticationFilter;
import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOriginPattern("*"); // Allow all origins (use specific origins in prod)
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
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

    @Bean
    public RouterFunction<ServerResponse> campaignServiceRoute() {
        return GatewayRouterFunctions.route("campaign-service")
            .route(
                RequestPredicates.path("/campaigns/**"),
                HandlerFunctions.http(
                    URI.create("http://campaign-service:8001")
                )
            )
            .filter(authenticationFilter.apply()) // Assuming all campaign routes are protected
            .build();
    }
}
