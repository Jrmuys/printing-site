import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { CartItem } from './cart-item';
import { Model } from '../model.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private httpClient: HttpClient) {}
  private apiUrl: string = '/api/cart';
  private cart: CartItem[];
  private cartUpdated = new Subject<{ cart: CartItem[]; totalPrice: number }>();
  private cartItemCount = new Subject<number>();
  private cartCount: number = 0;

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

  public clearCart() {
    return this.httpClient.delete(this.apiUrl + '/clear');
  }

  deleteCartItem(cartItemToDelete: CartItem) {
    return this.httpClient.post(this.apiUrl + '/delete', cartItemToDelete);
  }

  addCartItem(
    model: Model,
    image: File,
    price: number,
    boundingVolume: number
  ) {
    const cartData = new FormData();
    cartData.append('model', JSON.stringify(model));
    cartData.append('price', price.toString());
    cartData.append('image', image, model.title);
    cartData.append('itemTotal', (price * model.quantity).toString());
    cartData.append('boundingVolume', boundingVolume.toString());
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
