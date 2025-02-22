import { ISessionAuthResultService } from 'types/services/auth.service';

const getSessionAuthData = (sessionAuth: ISessionAuthResultService) => {
  delete sessionAuth.user.refreshedAt;
  delete sessionAuth.user.updatedAt;
  delete sessionAuth.user.createdAt;

  return sessionAuth;
};

export const SessionUtil = {
  getSessionAuthData: getSessionAuthData,
};
