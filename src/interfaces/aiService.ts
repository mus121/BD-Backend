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
