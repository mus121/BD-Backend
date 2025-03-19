import { Tags, Route, Get } from 'tsoa';
import { getProfiles } from '../managers/aiService';
import { Profile } from '../../interfaces/aiService';

@Tags('profile')
@Route('profile')
export class AiProfileController {
  @Get('/')
  public async getAllProfiles(): Promise<Profile[]> {
    return getProfiles();
  }
}
