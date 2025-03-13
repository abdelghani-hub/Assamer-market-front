import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable, forkJoin, of} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import ApiResponse from '../../types/ApiResponse';
import Product from '../../types/Product';
import {FileService} from './file.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl: string = 'http://localhost:8080/api/v1/products';
  private http: HttpClient;
  private fileService: FileService;

  constructor(http: HttpClient, fileService: FileService) {
    this.http = http;
    this.fileService = fileService;
  }

  public getPopularProducts(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(this.apiUrl + '/popular')
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

  getProductBySlug(slug: string | null) {
    if (!slug) {
      return null;
    }

    return this.http.get<ApiResponse<Product>>(this.apiUrl + '/' + slug)
      .pipe(
        map(res => {
          if (!res.data || typeof(res.data) != "object") {
            return null;
          }

          const product: Product[] | Product = res.data;
          const imageLoadObservables = product.attachmentsSrc.map(imagePath => {
            return this.fileService.loadImageAsBase64(imagePath);
          });

          forkJoin(imageLoadObservables).subscribe(base64Images => {
            product.attachmentsSrc = base64Images;
          });

          return product;
        })
      )
  }

  public getByCategory(categoryName: string): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(this.apiUrl.replace('products', 'categories/' + categoryName + '/products'))
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
}
