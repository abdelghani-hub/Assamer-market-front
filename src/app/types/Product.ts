type Product = {
  id?: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  quantity: number;
  price: number;
  categoryName: string;
  status: string;
  attachmentsSrc: string[];
  storeId: string;
  createdAt: string;
  updatedAt: string;
  totalSales?: number;
};

export default Product;
