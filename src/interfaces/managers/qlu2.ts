export type IGetCurrentUserResponse = {
  response: {
    id: number;
    email: string;
    name: string;
    isBlocked: boolean;
    isOnboarded: boolean;
    isEmailVerified: boolean;
  };
};
