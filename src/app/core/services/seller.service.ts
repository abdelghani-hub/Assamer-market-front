import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import ApiResponse from '../../types/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private apiUrl: string = 'http://localhost:8080/api/v1/sellers';
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  public requestSeller(): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl + '/request', {}).pipe(
      map(res => {
        return res;
      })
    );
  }

  getSellerRequestsCount() {
    return this.http.get<ApiResponse<number>>(this.apiUrl + '/requests/count').pipe(
      map(res => {
        return res.data;
      })
    );
  }
}
