import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import Category from '../../types/Category';
import ApiResponse from '../../types/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl: string = 'http://localhost:8080/api/v1/categories';
  private baseUrl: string = 'http://localhost:8080';
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  public getCategories(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/all`)
      .pipe(
        switchMap(res => {
          // If there's no data or content is empty, return empty array
          if (!res.data) {
            return of([]);
          }

          const categories = res.data;

          // Create an array of observables for each category image
          const imageLoadObservables = categories.map(category => {
            // If no image source, just return the category as is
            if (!category.imageSrc) {
              return of(category);
            }

            // Get the full URL if it's a relative path
            const fullImageUrl = category.imageSrc.startsWith('/')
              ? `${this.baseUrl}${category.imageSrc}`
              : category.imageSrc;

            // Load the image
            return this.loadImageAsBase64(fullImageUrl).pipe(
              map(base64Image => {
                return { ...category, imageSrc: base64Image };
              })
            );
          });

          // Wait for all image operations to complete
          return forkJoin(imageLoadObservables);
        })
      );
  }

  private loadImageAsBase64(imageUrl: string): Observable<string> {
    return this.http.get(imageUrl, { responseType: 'blob' })
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
