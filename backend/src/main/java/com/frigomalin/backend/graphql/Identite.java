package com.frigomalin.backend.graphql;

import com.frigomalin.backend.exception.AccessDeniedOperationException;

public final class Identite {

    private Identite() {
    }

    public static String exiger(String email) {
        if (email == null) {
            throw new AccessDeniedOperationException("Connexion requise.");
        }
        return email;
    }
}