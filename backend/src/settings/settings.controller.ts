import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { UserApiKeysService } from './user-api-keys.service';
import type { ApiKeysStatus } from './user-api-keys.service';
import { UpdateApiKeysDto } from './dto/update-api-keys.dto';

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly userApiKeysService: UserApiKeysService) {}

  @Get('api-keys')
  @ApiOperation({
    summary: "Get the authenticated user's API key configuration status",
    description:
      'Returns whether the user has configured their Gemini and Exa API keys. ' +
      'For security reasons the key material itself is never returned.',
  })
  @ApiOkResponse({
    schema: {
      example: {
        geminiConfigured: true,
        exaConfigured: false,
        maxSources: 5,
      },
    },
  })
  getStatus(@CurrentUser() user: AuthenticatedUser): Promise<ApiKeysStatus> {
    return this.userApiKeysService.getStatus(user.id);
  }

  @Put('api-keys')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Save or replace the authenticated user's API keys",
    description:
      'Stores encrypted copies of the provided Gemini and/or Exa API keys for the authenticated ' +
      'user. Keys are encrypted at rest and can only be decrypted by this backend for use in ' +
      'research requests. Omitted fields leave the existing stored key unchanged. The response ' +
      'never contains key material — only configuration status.',
  })
  @ApiBody({ type: UpdateApiKeysDto })
  @ApiOkResponse({
    schema: {
      example: {
        geminiConfigured: true,
        exaConfigured: true,
        maxSources: 10,
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired session.' })
  saveKeys(
    @Body() updateApiKeysDto: UpdateApiKeysDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ApiKeysStatus> {
    return this.userApiKeysService.saveKeys(user.id, updateApiKeysDto);
  }
}
