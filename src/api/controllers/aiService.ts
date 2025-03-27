import { Tags, Route, Post, Body } from 'tsoa';
import { esIdsFetch } from '../managers/esIds/index';

import { ProfileRequest } from '../../interfaces/aiService';
import { getProfileSegmentByEsids } from '../managers/aiService';

@Tags('profile')
@Route('profile')
export class AiProfileController {
  @Post('/getProfileSegments')
  public async getProfileSegments(
    @Body() segmentData: string[],
  ): Promise<ProfileRequest> {
    const data = await esIdsFetch(segmentData);
    return getProfileSegmentByEsids(data);
  }
}
