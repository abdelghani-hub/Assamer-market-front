import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import ApiResponse from '../../types/ApiResponse';
import Product from '../../types/Product';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl: string = 'http://localhost:8080/api/v1/products';
  private http: HttpClient;
  private fileService: FileService;

  constructor(http: HttpClient, fileService: FileService) {
    this.http = http;
    this.fileService = fileService;
  }

  public getFavoriteProducts(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/favorites`)
      .pipe(
        switchMap(res => {
          if (!res.data) {
            return of([]);
          }

          const products = res.data;
          const imageLoadObservables = products.map(product => {
            if (!product.attachmentsSrc || product.attachmentsSrc.length === 0) {
              return of(product);
            }

            const imageRequests = product.attachmentsSrc.map(imagePath => {
              return this.fileService.loadImageAsBase64(imagePath);
            });

            return forkJoin(imageRequests).pipe(
              map(base64Images => {
                return { ...product, attachmentsSrc: base64Images };
              })
            );
          });

          return forkJoin(imageLoadObservables);
        })
      );
  }

  public addProductToFavorites(productSlug: string): Observable<ApiResponse<Product[]>> {
    return this.http.post<ApiResponse<Product[]>>(`${this.apiUrl}/${productSlug}/favorite`, {});
  }

  public removeProductFromFavorites(productSlug: string): Observable<ApiResponse<Product[]>> {
    return this.http.delete<ApiResponse<Product[]>>(`${this.apiUrl}/${productSlug}/favorite`);
  }

  public isFavorite(productSlug: string): Observable<boolean> {
    return this.getFavoriteProducts().pipe(
      map(products => products.some(product => product.slug === productSlug))
    );
  }
}
