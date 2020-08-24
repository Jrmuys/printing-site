import { AdminService } from '../../core/admin/admin.service';
import { Order } from '../../core/admin/order.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../core/cart/cart-item';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
})
export class OrderPageComponent implements OnInit, OnDestroy {
  id: string;
  private sub: any;
  order: Order;
  orderItems: CartItem[];
  displayedColumns: string[] = [
    'imgUrl',
    'title',
    'quantity',
    'price',
    'delete',
    'download',
  ];
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
