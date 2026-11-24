package com.frigomalin.backend.graphql;

import com.frigomalin.backend.exception.AccessDeniedOperationException;
import com.frigomalin.backend.exception.BusinessValidationException;
import com.frigomalin.backend.exception.DuplicateResourceException;
import com.frigomalin.backend.exception.ResourceNotFoundException;
import graphql.GraphQLError;
import graphql.GraphqlErrorBuilder;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.graphql.execution.DataFetcherExceptionResolverAdapter;
import org.springframework.graphql.execution.ErrorType;
import org.springframework.stereotype.Component;

/**
 * Garde les messages de vos exceptions métier pour que React puisse les afficher.
 */
@Component
public class GraphQlExceptionResolver extends DataFetcherExceptionResolverAdapter {

    @Override
    protected GraphQLError resolveToSingleError(Throwable ex, DataFetchingEnvironment env) {
        ErrorType type;
        if (ex instanceof ResourceNotFoundException) {
            type = ErrorType.NOT_FOUND;
        } else if (ex instanceof BusinessValidationException || ex instanceof DuplicateResourceException) {
            type = ErrorType.BAD_REQUEST;
        } else if (ex instanceof AccessDeniedOperationException) {
            type = ErrorType.FORBIDDEN;
        } else {
            return null; // autre erreur : Spring la masque (INTERNAL_ERROR)
        }
        return GraphqlErrorBuilder.newError(env)
                .errorType(type)
                .message(ex.getMessage())
                .build();
    }
}