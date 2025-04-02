import { Tags, Route, Post, Body, Get } from 'tsoa';
import { esIdsFetch } from '../managers/esIds/index';
import {
  handleFollowProfile,
  handleGetFollowProfile,
} from '../managers/aiService/followProfile/index';
import { ProfileRequest } from '../../interfaces/aiService';
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

  /**
   * Follow or Unfollow a profile
   */

  @Post('/followProfile')
  public async followProfile(
    @Body() body: { esId: string; connectionStatus: boolean },
  ) {
    try {
      const result = await handleFollowProfile({
        esId: body.esId,
        connectionStatus: body.connectionStatus,
      });
      return result;
    } catch (error) {
      console.error('Error handling follow profile:', error);
      throw new Error('Failed to process follow profile request');
    }
  }

  @Get('/getFollowProfile')
  public async getFollowProfile() {
    try {
      const esIds = await handleGetFollowProfile();

      if (esIds === null) {
        throw new Error('No follow profile found');
      }

      const profilesData = await profileFetchByEsids(esIds);
      return {
        profiles: profilesData,
      };
    } catch (error) {
      console.error('Error fetching Follow Profiles:', error);
      throw new Error('Failed to fetch profiles');
    }
  }
}
