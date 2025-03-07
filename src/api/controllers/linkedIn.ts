import { Post, Route, Tags, Body, Query, Get } from 'tsoa';
import { saveLinkedInProfile } from '../managers/profile';
import { LiConnectionProfile, LiProfile } from '../../interfaces/connection';
import { BDError, ErrorCode, HttpStatusCode } from '../../utils/bdError';
import {
  handleProfileConnection,
  retrieveConnectedProfiles,
} from '../managers/connection';

@Tags('profile')
@Route('profile')
export class LinkedInController {
  @Post('/profile')
  public async saveProfile(@Body() profileData: LiProfile) {
    return saveLinkedInProfile(profileData);
  }

  @Post('/follow')
  public async connectProfile(@Body() connectionData: LiConnectionProfile) {
    const result = await handleProfileConnection(connectionData);

    if (!result) {
      throw new BDError(
        'Profile connection failed.',
        HttpStatusCode.BadRequest,
        ErrorCode.ValidationFailed,
      );
    }

    return { success: true, data: result };
  }

  @Get('/connection')
  public async getConnectedProfiles(@Query() userId: string) {
    if (!userId) {
      throw new BDError(
        'userId is required.',
        HttpStatusCode.BadRequest,
        ErrorCode.ValidationFailed,
      );
    }
    const profiles = await retrieveConnectedProfiles({ userId });
    return { success: true, data: profiles };
  }
}
