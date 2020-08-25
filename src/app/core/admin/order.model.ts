import { CartItem } from '../cart/cart-item';

export interface Order {
  orderItems: CartItem[];
  userId: string;
  orderId: string;

  date: Date;
  orderStatus: string;

  paymentDetails: {
    totalPrice: number;
    shipping: number;
    tax: number;
    paymentStatus: string;
  };

  customerName: string;
  customerEmail: string;
  shipping: {
    address: {
      address_line_1: string;
      address_line_2: string;
      admin_area_2: string;
      admin_area_1: string;
      postal_code: string;
      country_code: string;
    };
  };
}
