import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private baseUrl: string = 'http://localhost:8080/';
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  public loadImageAsBase64(imageUrl: string): Observable<string> {
    return this.http.get(this.baseUrl + imageUrl, {responseType: 'blob'})
      .pipe(
        switchMap(blob => {
          return new Observable<string>(observer => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              observer.next(reader.result as string);
              observer.complete();
            };
            reader.onerror = (error) => {
              observer.error(error);
            };
          });
        })
      );
  }

}
