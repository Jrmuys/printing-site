import { CartState, initialState } from './cart-state';
import { Store } from '@core/store';
import { Injectable } from '@angular/core';
import { CartItem } from './cart-item';

@Injectable({ providedIn: 'root' })
export class CartStore extends Store<CartState> {
  constructor() {
    super(initialState);
  }

  addCartItem(cartItemToAdd: CartItem) {
    console.log('[Cart] Add Cart Item');
    const newState = {
      ...this.state,
      cartItems: [].concat(this.state.cartItems, cartItemToAdd),
    };
    this.setState(newState);
  }

  removeCartItem(cartItemToRemove: CartItem) {
    console.log('[Cart] Remove Cart Item');
    const newState = {
      ...this.state,
      cartItems: this.state.cartItems.filter(
        (cartItem) => cartItem.modelId !== cartItemToRemove.modelId
      ),
    };
    this.setState(newState);
  }

  updateCartItem(cartItemToUpdate: CartItem) {
    console.log('[Cart] Update Cart Item');
    const newState = {
      ...this.state,
      cartItems: this.state.cartItems.map((cartItem) =>
        cartItem.modelId === cartItemToUpdate.modelId
          ? cartItemToUpdate
          : cartItem
      ),
    };
    this.setState(newState);
  }

  clearCart() {
    console.log('[Cart] Clear Cart');
    const newState = initialState;
    this.setState(newState);
  }

  restoreCart(stateToRestore: CartState) {
    console.log('[Cart] Restore Cart');
    this.setState(stateToRestore);
  }
}
