import { AdminService } from '../../core/admin/admin.service';
import { Order } from '../../core/admin/order.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../core/cart/cart-item';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class OrderPageComponent implements OnInit, OnDestroy {
  id: string;
  private sub: any;
  order: Order;
  orderItems: CartItem[];
  loading = false;
  expandedElement: string | null;
  displayedColumns: string[] = [
    'imgUrl',
    'title',
    'units',
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
    this.loading = true;
    this.route.params.subscribe((params) => {
      this.id = params.id;
      console.log(params);
      this.orderSub = this.adminService
        .getOrder(this.id.toString())
        .subscribe((order) => {
          this.order = order;
          this.orderItems = order.orderItems;
          console.log(order);
          this.loading = false;
        });
    });
  }

  downloadAll() {
    console.log('Downloading');
    this.adminService.downloadAll(this.order);
  }

  updateOrder() {
    console.log('UPDATING ORDER');
    this.adminService.updateOrder(this.order).subscribe(
      (res) => {
        console.log(res.message);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
    this.orderSub.unsubscribe();
  }
}
