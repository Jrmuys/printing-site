import { CartItem } from '@core/cart/cart-item';
import { Subscription } from 'rxjs';
import { AuthService } from './../../core/auth/auth.service';
import { CartService } from './../../core/cart/cart.service';
import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  private authSub: Subscription;
  private cartSub: Subscription;
  isLoading = false;
  totalPrice: number;
  cart: CartItem[];
  displayedColumns: string[] = [
    'imgUrl',
    'title',
    'quantity',
    'price',
    'delete',
  ];

  ngOnInit(): void {
    this.cartService.getCart();
    this.cartSub = this.cartService
      .getCartUpdateListener()
      .subscribe((cartData: { cart: CartItem[]; totalPrice: number }) => {
        this.isLoading = false;
        this.totalPrice = cartData.totalPrice;
        this.cart = cartData.cart;
        console.log('Got cart: ', this.cart);
      });
  }

  onClear() {
    this.isLoading = true;
    this.cartService.clearCart().subscribe(() => this.cartService.getCart());
  }

  onUpdate(cartItemToUpdate: CartItem) {
    cartItemToUpdate.itemTotal =
      cartItemToUpdate.quantity * cartItemToUpdate.price;
    console.log('Updating cart...');
    let cart: CartItem[] = this.cart.map((cartItem) =>
      cartItem.modelId === cartItem.modelPath ? cartItemToUpdate : cartItem
    );
    this.updatePrice();

    this.cartService.updateCartItem(cart).subscribe(() => {
      this.cartService.getCart();
    });
  }

  onDelete(cartItemToDelete: CartItem) {
    this.cartService.deleteCartItem(cartItemToDelete).subscribe(() => {
      this.cartService.getCart();
    });
  }

  updatePrice() {
    let newPrice: number = 0;
    this.cart.forEach((cartItem) => {
      newPrice += cartItem.itemTotal;
    });
    this.totalPrice = newPrice;
  }

  ngOnDestroy(): void {
    this.cartSub.unsubscribe();
  }
}
