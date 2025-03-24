import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpEventType} from "@angular/common/http";
import {catchError, Observable, of, throwError} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';
import Product from '../../types/Product';
import ApiResponse from '../../types/ApiResponse';

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

  uploadProductImages(files: File[] | FileList | File, product: Product | null): Observable<any> {
    // Early validation
    if (!product?.id) {
      return throwError(() => new Error('Product slug is required'));
    }

    if (!files ||
      (files instanceof FileList && files.length === 0) ||
      (Array.isArray(files) && files.length === 0)) {
      return throwError(() => new Error('No files selected for upload'));
    }

    // Prepare form data
    const formData = this.prepareFormData(files, 'Product', product.id);

    // Request options
    const options = {
      reportProgress: true,
      observe: 'events' as const
    };

    // API endpoint
    const endpoint = `${this.baseUrl}api/v1/attachments/upload-multiple`;

    return this.http.post<ApiResponse<string[]>>(endpoint, formData, options).pipe(
      map(event => this.mapHttpEvent(event)),
      filter(response => response !== null),
      catchError(error => this.handleUploadError(error)),
      switchMap(response => this.processResponse(response))
    );
  }

  /**
   * Creates FormData from different types of file inputs
   */
  private prepareFormData(files: File[] | FileList | File, entityType: string, entityId: string): FormData {
    const formData = new FormData();

    // Add files based on input type
    if (files instanceof FileList) {
      Array.from(files).forEach(file => formData.append('files', file));
    } else if (Array.isArray(files)) {
      files.forEach(file => formData.append('files', file));
    } else if (files instanceof File) {
      formData.append('files', files);
    }

    // Add metadata
    formData.append('entityType', entityType);
    formData.append('entityId', entityId);

    return formData;
  }

  /**
   * Maps HTTP events to meaningful responses
   */
  private mapHttpEvent(event: HttpEvent<any>): any {
    if (event.type === HttpEventType.UploadProgress && event.total) {
      const progress = Math.round(100 * event.loaded / event.total);
      return { status: 'progress', progress };
    } else if (event.type === HttpEventType.Response) {
      return event.body;
    }
    return null; // Other events
  }

  /**
   * Handles upload errors
   */
  private handleUploadError(error: any): Observable<never> {
    const errorMessage = error.message || 'Server connection error. Please try again with smaller files or later.';
    return throwError(() => new Error(`File upload failed: ${errorMessage}`));
  }

  /**
   * Processes the response from the API
   */
  private processResponse(response: any): Observable<any> {
    if (!response) {
      return of(null);
    }

    if (response.status === 'progress') {
      return of(response);
    }

    if (response && response.status === 'success') {
      return of(response.data);
    } else {
      return throwError(() => new Error(response?.message || 'Unknown upload error'));
    }
  }
}
