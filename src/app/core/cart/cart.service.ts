import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { CartItem } from './cart-item';
import { Model } from '../model.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private httpClient: HttpClient) { }
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

  public getCartItem(id: String): CartItem {
    let foundElement: CartItem = null;
    this.cart.forEach((element) => {
      console.log("Comparing: ", element.model.id, " and ", id)
      if (element.model.id == id) {
        console.log("Found matching ID");
        foundElement = element;
      }
    });
    return foundElement;
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
    console.log(model, image, price, boundingVolume);
    let totalPrice = price * model.quantity;
    if (totalPrice < 5) totalPrice = 5.0;
    const cartData = new FormData();
    cartData.append('model', JSON.stringify(model));
    cartData.append('price', price.toString());
    cartData.append('image', image, model.title);
    cartData.append('itemTotal', totalPrice.toString());
    cartData.append('units', model.units);
    cartData.append('boundingVolume', boundingVolume.toString());
    this.httpClient
      .post<{ cart: CartItem[]; totalPrice: number }>(
        `${this.apiUrl}/add`,
        cartData
      )
      .subscribe((result) => {
        if (result) {
          console.log(JSON.stringify(result));
          this.cart = result.cart;
          console.log('Cart test: ', this.cart);
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

  updateCartItemSingular(cartItem: CartItem) {
    let updateCartObservable;
    this.cart.forEach((item, index, array) => {
      if (item.model.id == cartItem.model.id) {
        array[index] = cartItem;
        updateCartObservable = this.updateCartItem(array);
        return;
      }
    });
    return updateCartObservable;
  }

}
