package org.projectbakso.apigateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.net.URI;
import java.security.Key;
import java.util.List;
import java.util.function.Function;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

@Component
public class AuthenticationFilter {

    @Value("${jwt.secret}")
    private String secretKey;

    public HandlerFilterFunction<ServerResponse, ServerResponse> apply() {
        return (request, next) -> {
            // List of public endpoints that do not require authentication
            List<String> publicEndpoints = List.of(
                "/api/users/auth/signup",
                "/api/users/auth/login",
                "/api/users/auth/refresh"
            );

            // Bypass authentication for public endpoints
            if (
                publicEndpoints
                    .stream()
                    .anyMatch(uri -> request.uri().getPath().contains(uri))
            ) {
                return next.handle(request);
            }

            // Check for Authorization header
            List<String> authHeaders = request
                .headers()
                .header("Authorization");
            if (authHeaders.isEmpty()) {
                return ServerResponse.status(HttpStatus.UNAUTHORIZED).build();
            }

            String authHeader = authHeaders.get(0);
            if (!authHeader.startsWith("Bearer ")) {
                return ServerResponse.status(HttpStatus.UNAUTHORIZED).build();
            }

            // Extract and validate token
            try {
                String token = authHeader.substring(7);
                Key key = Keys.hmacShaKeyFor(secretKey.getBytes());
                Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
                String userId = claims.get("id", String.class);
                String userName = claims.get("name", String.class); // Assuming 'name' is in the token

                // Add user info to request headers for downstream services
                ServerRequest modifiedRequest = ServerRequest.from(request)
                    .header("X-User-Id", userId)
                    .header(
                        "X-User-Name",
                        userName != null ? userName : "Unknown"
                    )
                    .build();

                return next.handle(modifiedRequest);
            } catch (Exception e) {
                return ServerResponse.status(HttpStatus.UNAUTHORIZED).build();
            }
        };
    }
}
