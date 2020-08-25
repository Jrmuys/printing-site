import { Component, OnInit, OnDestroy } from '@angular/core';
import { Order } from 'src/app/core/admin/order.model';
import { CartItem } from 'src/app/core/cart/cart-item';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/core/admin/admin.service';

@Component({
  selector: 'app-confirmation-page',
  templateUrl: './confirmation-page.component.html',
  styleUrls: ['./confirmation-page.component.scss'],
})
export class ConfirmationPageComponent implements OnInit, OnDestroy {
  id: string;
  private sub: any;
  order: Order;
  orderItems: CartItem[];
  displayedColumns: string[] = ['imgUrl', 'title', 'quantity'];
  orderSub: any;
  error: Error;
  loading: Boolean = false;
  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.route.params.subscribe(
      (params) => {
        this.id = params.id;
        console.log(params);
        this.orderSub = this.adminService
          .getOrder(this.id.toString())
          .subscribe(
            (order) => {
              this.order = order;
              this.orderItems = order.orderItems;
              console.log(order);
              this.loading = false;
            },
            (error) => {
              this.error = error;
              if (error.status == 403) {
                this.router.navigate(['/forbidden']);
              }
            }
          );
      },
      (error) => {
        console.log(error);
        this.error = error;
      }
    );
  }

  downloadAll() {
    console.log('Downloading');
    this.adminService.downloadAll(this.order);
  }

  updateOrder() {
    this.adminService.updateOrder(this.order).subscribe();
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
    this.orderSub.unsubscribe();
  }
}
