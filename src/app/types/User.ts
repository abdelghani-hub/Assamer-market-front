type User = {
  id?: string;
  username: string;
  email: string;
  password?: string;
  role: string;
  firstName: string;
  lastName: string;
  cin: string;
  isSellerRequester: boolean
};

export default User;
