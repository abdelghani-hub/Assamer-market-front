import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import ApiResponse from '../../types/ApiResponse';
import Product from '../../types/Product';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl: string = 'http://localhost:8080/api/v1/products';

  constructor(private http: HttpClient, private fileService: FileService) {}

  public getPopularProducts(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/popular`)
      .pipe(
        switchMap(res => this.loadProductImages(res.data))
      );
  }

  public getProductBySlug(slug: string | null): Observable<Product | null> {
    if (!slug) {
      return of(null);
    }

    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${slug}`)
      .pipe(
        switchMap(res => this.loadProductImages([res.data])),
        map(products => products[0]),
        catchError(() => {
          return of(null);
        })
      );
  }

  public getByCategory(categoryName: string): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(this.apiUrl.replace('products', `categories/${categoryName}/products`))
      .pipe(
        switchMap(res => this.loadProductImages(res.data))
      );
  }

  public getMyStoreProducts(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/my-store`)
      .pipe(
        switchMap(res => this.loadProductImages(res.data)),
        catchError(() => {
          return of([]);
        })
      );
  }

  public createProduct(data: FormData): Observable<Product | null> {
    return this.http.post<ApiResponse<Product>>(this.apiUrl, data)
      .pipe(
        map(res => res.data)
      );
  }

  public updateProduct(slug: string, product: Product): Observable<Product | null> {
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/${slug}`, product)
      .pipe(
        map(res => res.data),
        catchError(() => {
          return of(null);
        })
      );
  }

  public deleteProduct(slug: string): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/delete/${slug}`)
      .pipe(
        map(res => res),
        catchError(() => {
          return of(null);
        })
      );
  }

  private loadProductImages(products: Product[] | undefined): Observable<Product[]> {
    if (!products) {
      return of([]);
    }

    const imageLoadObservables = products.map(product => {
      if (!product.attachmentsSrc || product.attachmentsSrc.length === 0) {
        return of(product);
      }

      const imageRequests = product.attachmentsSrc.map(imagePath => {
        return this.fileService.loadImageAsBase64(imagePath);
      });

      return forkJoin(imageRequests).pipe(
        map(base64Images => ({ ...product, attachmentsSrc: base64Images }))
      );
    });

    return forkJoin(imageLoadObservables);
  }
}
