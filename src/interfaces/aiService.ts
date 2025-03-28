export type BusinessImpactScore = {
  total: number;
  label: string;
};

export type Profile = {
  name: string;
  username: string;
  location: string;
  company: string;
  business_impact_score: BusinessImpactScore;
  follow_status: boolean;
};

export type ProfileSegment = {
  publicIdentifiers: string[];
};

export type ProfileEsid = {
  es_id: string;
};

export type ProfileRequest = {
  profiles: ProfileEsid[];
};

export type ProfileLabels = {
  id: string;
  userId: number;
  labels: string;
  isChecked: boolean;
  created_at?: Date;
  updated_at?: Date;
};
export type ProfileRecieve = {
  score: number;
  id: string;
  experienceHits: number[];
};

export type ProfilesResponse = {
  message: string;
  profiles: ProfileRecieve[];
};

export type EsIds = {
  profiles: {
    es_id: string;
  }[];
};
