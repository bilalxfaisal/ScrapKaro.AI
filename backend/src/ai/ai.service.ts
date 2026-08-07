import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
  private readonly gemini: GoogleGenAI;
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new InternalServerErrorException(
        'GEMINI_API_KEY is not configured. Please set it in your .env file.',
      );
    }

    this.gemini = new GoogleGenAI({
      apiKey,
    });
  }

  async generateCompletion(
    systemPrompt: string,
    userPrompt: string,
  ): Promise<string> {
    try {
      this.logger.log('Sending request to Gemini...');

      const response = await this.gemini.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          maxOutputTokens: 1024,
        },
      });

      const content = response.text;

      if (!content) {
        throw new InternalServerErrorException(
          'Gemini returned an empty response.',
        );
      }

      this.logger.log('Received response from Gemini.');

      return content;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      this.logger.error('Gemini API error:', error);

      throw new InternalServerErrorException(
        `Gemini API error: ${(error as Error).message}`,
      );
    }
  }
}