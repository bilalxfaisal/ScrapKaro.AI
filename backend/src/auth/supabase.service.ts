import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuthenticatedUser } from './auth.types';

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient;

  constructor(configService: ConfigService) {
    const url = configService.get<string>('SUPABASE_URL');
    const serviceRoleKey = configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    if (!url || !serviceRoleKey) {
      throw new InternalServerErrorException(
        'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not configured. Please set them in your .env file.',
      );
    }

    this.client = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  /**
   * Verifies a Supabase access token (from the Authorization header) and
   * returns the authenticated user. Returns null when the token is invalid.
   * The identity comes from the verified token — never from the client body.
   */
  async getUserFromToken(token: string): Promise<AuthenticatedUser | null> {
    const { data, error } = await this.client.auth.getUser(token);

    if (error || !data.user) {
      return null;
    }

    const meta = data.user.user_metadata ?? {};

    return {
      id: data.user.id,
      email: data.user.email ?? undefined,
      name: (meta.full_name as string) || (meta.name as string) || undefined,
      avatarUrl: (meta.avatar_url as string) || undefined,
    };
  }
}
