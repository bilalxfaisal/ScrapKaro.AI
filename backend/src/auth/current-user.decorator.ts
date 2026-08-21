import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from './auth.types';

/**
 * Extracts the authenticated user that was verified and attached to the
 * request by AuthGuard. Never trust a user id sent in the request body.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const request = context.switchToHttp().getRequest();
    return request.user as AuthenticatedUser;
  },
);
