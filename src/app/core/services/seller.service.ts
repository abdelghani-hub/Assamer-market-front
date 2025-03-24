import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import ApiResponse from '../../types/ApiResponse';
import SellerRequest from '../../types/SellerRequest';
import Pageable from '../../types/Pageable';

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
    return this.http.get<number>(this.apiUrl + '/pending-requests/count').pipe(
      map(res => {
        return res;
      })
    );
  }

  getSellerRequests(page: number = 0, size: number = 10): Observable<ApiResponse<Pageable<SellerRequest>>> {
    return this.http.get<ApiResponse<Pageable<SellerRequest>>>(`${this.apiUrl}/requests?page=${page}&size=${size}`).pipe(
      map(res => {
        return res;
      })
    );
  }

  updateSellerRequest(requestId: string, status: 'ACCEPTED' | 'REJECTED'): Observable<ApiResponse<any>> {
    let action = status === 'ACCEPTED' ? 'accept' : 'reject';
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/request/${action}?requestId=${requestId}`, {}).pipe(
      map(res => {
        return res;
      })
    );
  }

  getAllSellerRequests() {
    return this.http.get<ApiResponse<SellerRequest[]>>(this.apiUrl + '/requests/all').pipe(
      map(res => {
        return res;
      })
    );
  }
}
