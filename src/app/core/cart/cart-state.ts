import { CartItem } from './cart-item';
export class CartState {
  cartItems: CartItem[];
}

export const initialState = { cartItems: [] };
