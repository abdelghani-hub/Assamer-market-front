type Cart = {
  productsUnits: {
    productSlug: string;
    quantity: number;
    photo: string;
    price: number;
  }[]
};

export default Cart;
