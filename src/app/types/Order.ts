import CartItem from './CartItem';

type Order = {
  id?: string;
  productsUnits: CartItem[];
  totalAmount: number;
  status: string;
  reference: string,
  fromAddress: string,
  toAddress: string,
  username: string,
  createdAt: string;
  updatedAt: string;
  payment: {},
};

export default Order;
