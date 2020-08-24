import { Order } from '../../core/admin/order.model';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../core/admin/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  displayedColumns: string[] = [
    'orderId',
    'customerName',
    'orderStatus',
    'paymentStatus',
    'totalPrice',
    'date',
    'details',
  ];
  dataSource: MatTableDataSource<Order>;
  private orderListener: Subscription;
  orders: Order[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private adminService: AdminService) {
    // Create 100 users
    // Assign the data to the data source for the table to render
  }

  ngOnInit() {
    console.log('INIT');

    this.adminService.getOrders();
    this.orderListener = this.adminService
      .getordersListener()
      .subscribe((order) => {
        this.orders = order;
        this.dataSource = new MatTableDataSource(this.orders);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.dataSource);
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
