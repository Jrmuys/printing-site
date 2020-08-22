import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { CartItem } from './cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private httpClient: HttpClient) {}
  private apiUrl: string = '/api/cart';
  private cart: CartItem[];
  private cartUpdated = new Subject<{ cart: CartItem[]; totalPrice: number }>();
  private cartItemCount = new Subject<number>();
  private cartCount;

  getItemCountListener() {
    return this.cartItemCount.asObservable();
  }

  getCartUpdateListener() {
    return this.cartUpdated.asObservable();
  }

  public getItemCount() {
    return this.cartCount;
  }

  public getCart() {
    this.httpClient
      .get<{ cartItems: CartItem[]; totalPrice: number }>(this.apiUrl)
      .subscribe((newCartItems) => {
        this.cart = newCartItems.cartItems;
        this.cartUpdated.next({
          cart: [...this.cart],
          totalPrice: newCartItems.totalPrice,
        });
        this.cartCount = this.cart.length;
        this.cartItemCount.next(this.cart.length);
      });
  }

  clearCart() {
    return this.httpClient.delete(this.apiUrl + '/clear');
  }

  deleteCartItem(cartItemToDelete: CartItem) {
    return this.httpClient.post(this.apiUrl + '/delete', cartItemToDelete);
  }

  addCartItem(
    modelId: string,
    price: number,
    title: string,
    image: File,
    quantity: number,
    modelPath: string
  ) {
    const cartData = new FormData();
    cartData.append('modelId', modelId);
    cartData.append('price', price.toString());
    cartData.append('title', title);
    cartData.append('image', image, title);
    cartData.append('quantity', quantity.toString());
    cartData.append('modelPath', modelPath);
    cartData.append('itemTotal', (price * quantity).toString());
    console.log(this.apiUrl);
    this.httpClient
      .post<{ cart: CartItem[]; totalPrice: number }>(
        `${this.apiUrl}/add`,
        cartData
      )
      .subscribe((result) => {
        if (result) {
          this.cart = result.cart;
          this.cartUpdated.next({
            cart: [...this.cart],
            totalPrice: result.totalPrice,
          });
          this.cartCount = this.cart.length;

          this.cartItemCount.next(this.cart.length);
        } else {
          console.error('Could not add cart item');
        }
      });
  }

  updateCartItem(updatedCart: CartItem[]) {
    console.log('updating cart...');
    return this.httpClient.post(this.apiUrl + '/update', updatedCart);
  }
}
