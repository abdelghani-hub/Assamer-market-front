import User from './User';

type SellerRequest = {
  id: string;
  user: User;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  requestedAt: string;
};

export default SellerRequest;
