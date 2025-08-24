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

    @Bean
    public RouterFunction<ServerResponse> userServiceRoute() {
        return GatewayRouterFunctions.route("user-service")
            .route(
                RequestPredicates.path("/api/users/**"),
                HandlerFunctions.http(URI.create("http://user-service:5001"))
            )
            .filter(authenticationFilter.apply())
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
            .filter(authenticationFilter.apply())
            .build();
    }
}
