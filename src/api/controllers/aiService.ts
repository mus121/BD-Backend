import { Tags, Route, Post, Body, Get, Query } from 'tsoa';
import { esIdsFetch } from '../managers/esIds/index';
import {
  handleFollowProfile,
  handleGetFollowProfile,
  getFollowedProfileData,
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

      const [profilesData, followedProfileEsids] = await Promise.all([
        profileFetchByEsids(esIds),
        getFollowedProfileData({ profileEsIds: esIds }),
      ]);
      const followedSet = new Set(followedProfileEsids);

      /* eslint-disable */
      const finalProfileData = profilesData.map((fprofile: any) => ({
        ...fprofile,
        isConnected: followedSet.has(fprofile.id),
      }));
      return { profiles: finalProfileData };
    } catch (error) {
      console.error('Error fetching full profiles:', error);
      return {
        profiles: [],
      };
    }
  }

  /**
   * Follow or Unfollow a profile
   */

  @Post('/followProfile')
  public async followProfile(
    @Body() body: { esId: string; connectionStatus: boolean },
    userId: number,
  ) {
    try {
      const { esId, connectionStatus } = body;
      const result = await handleFollowProfile({
        userId,
        esId,
        connectionStatus,
      });
      return result;
    } catch (error) {
      console.error('Error handling follow profile:', error);
      throw new Error('Failed to process follow profile request');
    }
  }

  @Get('/getFollowProfile')
  public async getFollowProfile(@Query() userId: number) {
    try {
      const esIds = await handleGetFollowProfile({ userId });

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
