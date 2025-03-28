import { Post, Route, Tags, Body, Get, Path } from 'tsoa';
import {
  fetchProfileSegmentLabels,
  saveProfileSegment,
} from '../managers/aiService/profileSegments';
import { ProfileLabels } from '../../interfaces/aiService';
import { BDError, ErrorCode, HttpStatusCode } from '../../utils/bdError';

@Tags('Profile Segments')
@Route('profile-segment')
export class ProfileSegmentController {
  @Post('/')
  public async saveSegment(@Body() segmentData: ProfileLabels) {
    const result = await saveProfileSegment(segmentData);

    if (!result.success) {
      throw new BDError(
        'Failed to save profile segment',
        HttpStatusCode.InternalServerError,
        ErrorCode.ValidationFailed,
      );
    }
    return result;
  }

  @Get('/labels/{userId}')
  public async getProfileLabels(
    @Path() userId: number,
  ): Promise<{ labels: string[] }> {
    return { labels: await fetchProfileSegmentLabels(userId) };
  }
}
