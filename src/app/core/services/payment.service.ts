import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

interface CheckoutResponse{
  status: string;
  message: string;
  sessionId: string;
  sessionUrl: string;
}

@Injectable({
  providedIn: 'root'
})

export class PaymentService {
  private apiUrl: string = 'http://localhost:8080/api/v1/payments';
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  public pay(orderReference: string): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(this.apiUrl + "/checkout/" + orderReference, null).pipe(
      map(res => {
        return res;
      })
    )
  }
}
