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
  ViewChild,
  ElementRef,
} from '@angular/core';

interface PayPalItem {
  description: string;
  amount: {
    currency_code: 'USD';
    value: number;
  };
}
declare var paypal: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;
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

  paypalGetItems(): PayPalItem[] {
    let paypalItems: PayPalItem[];
    this.cart.forEach((cartItem) => {
      let newPayPalItem: PayPalItem = {
        description: cartItem.title,
        amount: {
          currency_code: 'USD',
          value: cartItem.itemTotal,
        },
      };
    });

    return;
  }

  ngOnInit(): void {
    this.loadExternalScript(
      'https://www.paypal.com/sdk/js?client-id=ASo29H6AXV4zhdJiJBNDjxp1VXECNJF2CFApAIloYin79pP9HjbHH85AS1adEcLy9hrEtEf4Qu5sORkL'
    ).then(() => {
      paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: 'test',
                  amount: {
                    currency_code: 'USD',
                    value: 20,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
          },
        })
        .render(this.paypalElement.nativeElement);
    });
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

  private loadExternalScript(scriptUrl: string) {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = scriptUrl;
      scriptElement.onload = resolve;
      document.body.appendChild(scriptElement);
    });
  }
}
