package com.frigomalin.backend.graphql;

import com.frigomalin.backend.dto.LoginInput;
import com.frigomalin.backend.dto.RegisterInput;
import com.frigomalin.backend.dto.UserDTO;
import com.frigomalin.backend.service.UserService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.stereotype.Controller;

@Controller
public class AuthController {

    private final UserService userService;
    private final SessionStore sessionStore;

    public AuthController(UserService userService, SessionStore sessionStore) {
        this.userService = userService;
        this.sessionStore = sessionStore;
    }

    @MutationMapping
    public AuthPayload inscription(@Argument RegisterInput input) {
        UserDTO user = userService.register(input);
        return new AuthPayload(sessionStore.creer(user.email()), user);
    }

    @MutationMapping
    public AuthPayload connexion(@Argument LoginInput input) {
        UserDTO user = userService.login(input);
        return new AuthPayload(sessionStore.creer(user.email()), user);
    }
}