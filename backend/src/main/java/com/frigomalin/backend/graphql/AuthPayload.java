package com.frigomalin.backend.graphql;

import com.frigomalin.backend.dto.UserDTO;

public record AuthPayload(String token, UserDTO user) {
}