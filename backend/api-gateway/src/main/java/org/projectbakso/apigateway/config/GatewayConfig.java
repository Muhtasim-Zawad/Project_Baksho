package org.projectbakso.apigateway.config;

import java.net.URI;
import org.projectbakso.apigateway.filter.AuthenticationFilter;
import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RequestPredicates;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

@Configuration
public class GatewayConfig {

    private final AuthenticationFilter authenticationFilter;

    public GatewayConfig(AuthenticationFilter authenticationFilter) {
        this.authenticationFilter = authenticationFilter;
    }

    // ---------------- PUBLIC ROUTES ---------------- //

    @Bean
    public RouterFunction<ServerResponse> publicUserRoutes() {
        return GatewayRouterFunctions.route("public-user-service")
                .route(
                        RequestPredicates.path("/api/users/auth/**"),
                        HandlerFunctions.http(URI.create("lb://user-service:5001"))
                )
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> publicCampaignRoutes() {
        return GatewayRouterFunctions.route("public-campaign-service")
                // Public campaigns
                .route(
                        RequestPredicates.path("/campaigns/**"),
                        HandlerFunctions.http(URI.create("lb://campaign-service:8001/campaigns/**"))
                )
                // Public docs: /campaigns/docs -> /docs
                .route(
                        RequestPredicates.path("/campaigns/docs/**"),
                        request -> {
                            String newPath = request.uri().getPath().replaceFirst("/campaigns/docs", "/docs");
                            URI forwardUri = URI.create("lb://campaign-service:8001" + newPath);
                            return HandlerFunctions.http(forwardUri).handle(request);
                        }
                )
                .build();
    }

    // this does not work as intended.1
//    @Bean
//    public RouterFunction<ServerResponse> publicNotificationRoutes() {
//        return GatewayRouterFunctions.route("public-notification-service")
//                .route(
//                        RequestPredicates.path("/notifications/docs/**"),
//                        request -> {
//                            String newPath = request.uri().getPath().replaceFirst("/notifications/docs", "/docs");
//                            URI forwardUri = URI.create("http://notification-service:8002" + newPath);
//                            return HandlerFunctions.http(forwardUri).handle(request);
//                        }
//                )
//                .build();
//    }

    // ---------------- PROTECTED ROUTES ---------------- //

    @Bean
    public RouterFunction<ServerResponse> protectedUserRoutes() {
        return GatewayRouterFunctions.route("protected-user-service")
                .route(
                        RequestPredicates.path("/api/users/**")
                                .and(RequestPredicates.path("/api/users/auth/**").negate()),
                        HandlerFunctions.http(URI.create("lb://user-service:5001"))
                )
                .filter(authenticationFilter.apply())
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> campaignServiceRoute() {
        return GatewayRouterFunctions.route("protected-campaign-service")
                .route(
                        RequestPredicates.path("/campaigns/**")
                                .and(RequestPredicates.path("/campaigns/docs/**").negate()), /// /campaigns/docs/** does not work
                        HandlerFunctions.http(URI.create("lb://campaign-service:8001"))
                )
                .filter(authenticationFilter.apply())
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> notificationServiceRoute() {
        return GatewayRouterFunctions.route("protected-notification-service")
                .route(
                        RequestPredicates.path("/notifications/**")
                                .and(RequestPredicates.path("/notifications/docs/**").negate()), // /notifications/docs/** does not work
                        HandlerFunctions.http(URI.create("lb://notification-service:8002"))
                )
                .filter(authenticationFilter.apply())
                .build();
    }
}
