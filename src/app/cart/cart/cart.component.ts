import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../../core/cart/cart-item';
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
import decode from 'jwt-decode';

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
    private authService: AuthService,
    private httpClient: HttpClient,
    private router: Router
  ) { }

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
    'edit',
    'delete',
  ];
  shippingCost: number = 4.99;
  totalVolume: number = 0;
  taxRate: number = 0.0575;

  paypalGetItems(): PayPalItem[] {
    let paypalItems: PayPalItem[];
    this.cart.forEach((cartItem) => {
      let newPayPalItem: PayPalItem = {
        description: cartItem.model.title,
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
            let finalTotal: number =
              Math.round(
                (this.totalPrice + this.totalPrice * 0.05 + this.shippingCost) *
                100
              ) / 100;
            console.log(finalTotal);
            return actions.order.create({
              purchase_units: [
                {
                  description: `Order of different models`,
                  amount: {
                    currency_code: 'USD',
                    value: finalTotal,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const token = localStorage.getItem('token');
            // decode the token to get its payload
            const tokenPayload = decode(token);
            console.log(tokenPayload._id);
            return fetch('/api/payment/get-transaction', {
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'post',
              body: JSON.stringify({
                orderID: data.orderID,
                userID: tokenPayload._id,
                cartItems: this.cart,
                userName: tokenPayload.fullname,
                userEmail: tokenPayload.email,
                shipping: this.shippingCost,
                tax: this.taxRate * this.totalPrice,
              }),
            })
              .then((res) => {
                console.log(res);

                return res.text();
              })
              .then((details) => {
                this.cartService.clearCart().subscribe(
                  () => {
                    console.log('success');
                    this.cartService.getCart();
                  },
                  (err) => {
                    console.error(err);
                  }
                );
                this.router.navigate(['user/confirmation', data.orderID]);
                // alert('Transaction approved by ' + details.payer_given_name);
              });
          },
        })
        .render(this.paypalElement.nativeElement);
    });
    this.cartService.getCart();
    this.cartSub = this.cartService
      .getCartUpdateListener()
      .subscribe((cartData: { cart: CartItem[]; totalPrice: number }) => {
        console.log('Cart service got updated cart!');
        this.isLoading = false;
        this.totalPrice = parseFloat(cartData.totalPrice.toString());
        this.cart = cartData.cart;
        this.totalVolume = 0;
        this.cart.forEach((cartItem) => {
          this.totalVolume +=
            +cartItem.boundingVolume * cartItem.model.quantity;
        });
        let volume = this.totalVolume;
        this.shippingCost = 0;
        while (volume > 0) {
          if (this.totalVolume < 75.3) {
            this.shippingCost += 8.3;
            break;
          } else if (this.totalVolume < 514.25) {
            this.shippingCost += 15.05;
            break;
          } else {
            this.shippingCost += 19.6;
            volume -= 792;
          }
        }
        console.log('Got cart: ', this.cart);
      });
  }

  onClear() {
    this.isLoading = true;
    this.cartService.clearCart().subscribe(() => this.cartService.getCart());
  }

  onUpdate(cartItemToUpdate: CartItem) {
    cartItemToUpdate.itemTotal =
      cartItemToUpdate.model.quantity * cartItemToUpdate.price;
    console.log('Updating cart...');
    let cart: CartItem[] = this.cart.map((cartItem) =>
      cartItem.model.id === cartItemToUpdate.model.id
        ? cartItemToUpdate
        : cartItem
    );
    this.updatePrice();

    this.cartService.updateCartItem(cart).subscribe(() => {
      this.cartService.getCart();
    });
  }

  onEdit(cartItemToUpdate: CartItem) {
    this.router.navigate([`/edit/${cartItemToUpdate.model.id}`]);
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
