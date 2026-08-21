import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'crypto';
import { eq } from 'drizzle-orm';
import type { Database } from '../db/db';
import { DATABASE } from '../db/database.module';
import { userApiKeys } from '../db/schema';

export interface ApiKeysStatus {
  geminiConfigured: boolean;
  exaConfigured: boolean;
  maxSources: number;
}

export interface DecryptedApiKeys {
  geminiApiKey: string | null;
  exaApiKey: string | null;
  maxSources: number;
}

const DEFAULT_MAX_SOURCES = 5;

const ENCRYPTION_CONTEXT = 'scrapkaro:user-api-keys:aes-256-gcm:v1';

@Injectable()
export class UserApiKeysService {
  private readonly logger = new Logger(UserApiKeysService.name);
  private readonly encryptionKey: Buffer;

  constructor(
    configService: ConfigService,
    @Inject(DATABASE) private readonly db: Database,
  ) {
    const serverSecret = configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!serverSecret) {
      throw new InternalServerErrorException(
        'SUPABASE_SERVICE_ROLE_KEY is not configured. Please set it in your .env file.',
      );
    }

    this.encryptionKey = createHash('sha256')
      .update(`${serverSecret}:${ENCRYPTION_CONTEXT}`)
      .digest();
  }

  async getStatus(userId: string): Promise<ApiKeysStatus> {
    const [row] = await this.db
      .select({
        geminiApiKey: userApiKeys.geminiApiKey,
        exaApiKey: userApiKeys.exaApiKey,
        maxSources: userApiKeys.maxSources,
      })
      .from(userApiKeys)
      .where(eq(userApiKeys.userId, userId));

    return {
      geminiConfigured: Boolean(row?.geminiApiKey),
      exaConfigured: Boolean(row?.exaApiKey),
      maxSources: row?.maxSources ?? DEFAULT_MAX_SOURCES,
    };
  }

  async saveKeys(
    userId: string,
    keys: { geminiApiKey?: string; exaApiKey?: string; maxSources?: number },
  ): Promise<ApiKeysStatus> {
    const [existing] = await this.db
      .select()
      .from(userApiKeys)
      .where(eq(userApiKeys.userId, userId));

    const geminiApiKey = keys.geminiApiKey
      ? this.encrypt(keys.geminiApiKey)
      : (existing?.geminiApiKey ?? null);
    const exaApiKey = keys.exaApiKey
      ? this.encrypt(keys.exaApiKey)
      : (existing?.exaApiKey ?? null);
    const maxSources =
      keys.maxSources ?? existing?.maxSources ?? DEFAULT_MAX_SOURCES;

    await this.db
      .insert(userApiKeys)
      .values({
        userId,
        geminiApiKey,
        exaApiKey,
        maxSources,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: userApiKeys.userId,
        set: { geminiApiKey, exaApiKey, maxSources, updatedAt: new Date() },
      });

    return {
      geminiConfigured: Boolean(geminiApiKey),
      exaConfigured: Boolean(exaApiKey),
      maxSources,
    };
  }

  async getDecryptedKeys(userId: string): Promise<DecryptedApiKeys> {
    const [row] = await this.db
      .select({
        geminiApiKey: userApiKeys.geminiApiKey,
        exaApiKey: userApiKeys.exaApiKey,
        maxSources: userApiKeys.maxSources,
      })
      .from(userApiKeys)
      .where(eq(userApiKeys.userId, userId));

    return {
      geminiApiKey: row?.geminiApiKey ? this.decrypt(row.geminiApiKey) : null,
      exaApiKey: row?.exaApiKey ? this.decrypt(row.exaApiKey) : null,
      maxSources: row?.maxSources ?? DEFAULT_MAX_SOURCES,
    };
  }

  async requireKeys(userId: string): Promise<{
    geminiApiKey: string;
    exaApiKey: string;
    maxSources: number;
  }> {
    const keys = await this.getDecryptedKeys(userId);

    const missing: string[] = [];
    if (!keys.geminiApiKey) missing.push('Gemini');
    if (!keys.exaApiKey) missing.push('Exa');

    if (missing.length > 0) {
      throw new BadRequestException(
        `Please configure your ${missing.join(' and ')} API ${missing.length === 1 ? 'key' : 'keys'} in Settings before starting research.`,
      );
    }

    return {
      geminiApiKey: keys.geminiApiKey as string,
      exaApiKey: keys.exaApiKey as string,
      maxSources: keys.maxSources,
    };
  }

  private encrypt(plaintext: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.encryptionKey, iv);
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted.toString('base64')}`;
  }

  private decrypt(payload: string): string | null {
    const parts = payload.split(':');

    if (parts.length !== 3) {
      this.logger.warn(
        'Stored API key has an unexpected format; treating it as not configured.',
      );
      return null;
    }

    try {
      const decipher = createDecipheriv(
        'aes-256-gcm',
        this.encryptionKey,
        Buffer.from(parts[0], 'base64'),
      );
      decipher.setAuthTag(Buffer.from(parts[1], 'base64'));

      return Buffer.concat([
        decipher.update(Buffer.from(parts[2], 'base64')),
        decipher.final(),
      ]).toString('utf8');
    } catch {
      this.logger.warn(
        'Failed to decrypt a stored API key; ask the user to re-save it in Settings.',
      );
      return null;
    }
  }
}
