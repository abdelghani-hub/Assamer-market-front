import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import Category from '../../types/Category';
import ApiResponse from '../../types/ApiResponse';
import {FileService} from './file.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl: string = 'http://localhost:8080/api/v1/categories';
  private http: HttpClient;
  private fileService: FileService;

  constructor(http: HttpClient, fileService: FileService) {
    this.http = http;
    this.fileService = fileService;
  }

  public getCategories(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/all`)
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

            // Load the image
            return this.fileService.loadImageAsBase64(category.imageSrc).pipe(
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
}
