import { Tags, Route, Post, Body, Get } from 'tsoa';
import { esIdsFetch } from '../managers/esIds/index';

import { ProfileRequest, ProfilesResponse } from '../../interfaces/aiService';
import {
  getProfileSegmentByEsids,
  getProfileSegmentByLabel,
} from '../managers/aiService';
import { profileFetchByEsids } from '../managers/profileByEsIds';
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

  @Post('/getProfilesByEsId')
  public async getProfilesByEsId(@Body() body: { label: string }) {
    try {
      const esIdsResponse = await getProfileSegmentByLabel(body);
      console.log('esIdsResponse', esIdsResponse);
      const esIds = esIdsResponse.ids;

      if (!esIds.length) {
        return { message: 'No profiles found', profiles: [] };
      }

      const profilesData = await profileFetchByEsids(esIds);

      return {
        profiles: profilesData,
      };
    } catch (error) {
      console.error('Error fetching full profiles:', error);
      throw new Error('Failed to fetch profiles');
    }
  }
}
