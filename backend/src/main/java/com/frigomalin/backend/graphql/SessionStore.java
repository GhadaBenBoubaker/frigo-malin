package com.frigomalin.backend.graphql;


//après connexion, le serveur génère un jeton aléatoire et 
// le retient. Chaque requête suivante prouve son identité avec ce jeton.
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Garde en mémoire la correspondance jeton -> email des utilisateurs connectés.
 */
@Component
public class SessionStore {

    private final Map<String, String> sessions = new ConcurrentHashMap<>();

    public String creer(String email) {
        String token = UUID.randomUUID().toString();
        sessions.put(token, email);
        return token;
    }

    public String emailPour(String token) {
        return sessions.get(token);
    }
}