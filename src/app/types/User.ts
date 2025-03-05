type User = {
  id?: string;
  username: string;
  email: string;
  password?: string;
  role: string;
  firstName: string;
  lastName: string;
  cin: string;
  sellerRequest?: {
    status: string;
  }
};

export default User;
