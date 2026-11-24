package com.frigomalin.backend.graphql;

import org.springframework.graphql.server.WebGraphQlInterceptor;
import org.springframework.graphql.server.WebGraphQlRequest;
import org.springframework.graphql.server.WebGraphQlResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.Collections;

/**
 * Lit "Authorization: Bearer <jeton>" et place l'email dans le contexte GraphQL.
 */
@Component
public class AuthInterceptor implements WebGraphQlInterceptor {

    private final SessionStore sessionStore;

    public AuthInterceptor(SessionStore sessionStore) {
        this.sessionStore = sessionStore;
    }

    @Override
    public Mono<WebGraphQlResponse> intercept(WebGraphQlRequest request, Chain chain) {
        String entete = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (entete != null && entete.startsWith("Bearer ")) {
            String email = sessionStore.emailPour(entete.substring(7));
            if (email != null) {
                request.configureExecutionInput((input, builder) ->
                        builder.graphQLContext(Collections.singletonMap("userEmail", email)).build());
            }
        }
        return chain.next(request);
    }
}