import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/core/admin/order.model';
import { CartItem } from 'src/app/core/cart/cart-item';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/core/admin/admin.service';

@Component({
  selector: 'app-confirmation-page',
  templateUrl: './confirmation-page.component.html',
  styleUrls: ['./confirmation-page.component.scss'],
})
export class ConfirmationPageComponent implements OnInit {
  id: string;
  private sub: any;
  order: Order;
  orderItems: CartItem[];
  displayedColumns: string[] = ['imgUrl', 'title', 'quantity'];
  orderSub: any;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params.id;
      console.log(params);
      this.orderSub = this.adminService
        .getOrder(this.id.toString())
        .subscribe((order) => {
          this.order = order;
          this.orderItems = order.orderItems;
          console.log(order);
        });
    });
  }

  downloadAll() {
    console.log('Downloading');
    this.adminService.downloadAll(this.order);
  }

  updateOrder() {
    this.adminService.updateOrder(this.order);
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
    this.orderSub.unsubscribe();
  }
}
