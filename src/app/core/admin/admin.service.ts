import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private httpClient: HttpClient) {}
  private apiUrl = '/api/admin';
  private ordersUpdated$ = new Subject<Order[]>();

  getordersListener() {
    return this.ordersUpdated$.asObservable();
  }

  getOrders() {
    console.log('Getting orders');
    this.httpClient.get<Order[]>(`${this.apiUrl}`).subscribe(
      (orders) => {
        console.log('Got order,', orders);
        if (orders) {
          this.ordersUpdated$.next(orders);
          console.log('Orders updated...');
        }
      },
      (error) => {
        throw error;
      }
    );
  }
  getOrder(orderId: string) {
    return this.httpClient.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  public downloadAll(order: Order) {
    var zip = new JSZip();
    var count = 0;
    var urls: string[] = [];
    var zipFilename = `order_${order.orderId}_files.zip`;
    order.orderItems.forEach((orderItem) => {
      urls.push(orderItem.model.modelPath);
    });

    urls.forEach(function (url) {
      var filename = url.split('/')[5];
      // loading a file and add it in a zip file
      JSZipUtils.getBinaryContent(url, function (err, data) {
        if (err) {
          throw err; // or handle the error
        }
        zip.file(filename, data, { binary: true });
        count++;
        if (count == urls.length) {
          zip.generateAsync({ type: 'blob' }).then(function (content) {
            saveAs(content, zipFilename);
          });
        }
      });
    });
  }

  public updateOrder(order: Order) {
    console.log('UPDATING...');
    return this.httpClient.post<{ message: string }>(
      this.apiUrl + '/update',
      order
    );
  }
}
