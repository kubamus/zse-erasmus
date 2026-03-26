export type Category = {
  id: number;
  name: string;
  description: string | null;
};

export type Product = {
  product_id: number;
  name: string;
  description: string | null;
  category_id: number | null;
  category_name?: string | null;
  price: number;
  stock_quantity: number;
};

export type CartItemInput = {
  product_id: number;
  quantity: number;
};

export type CartItemDetailed = {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  line_total: number;
};

export type OrderPayload = {
  customer: {
    name: string;
    email: string;
    address?: string;
    phone?: string;
  };
  items: CartItemInput[];
};
