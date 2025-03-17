import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import ApiResponse from '../../types/ApiResponse';
import Cart from '../../types/Cart';
import Order from '../../types/Order';

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  private apiUrl: string = 'http://localhost:8080/api/v1/orders';
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  public create(cart: Cart): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(this.apiUrl, cart).pipe(
      map(res => {
        return res;
      })
    )
  }
}
