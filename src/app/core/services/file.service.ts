import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType} from "@angular/common/http";
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
    const formData = new FormData();

    // Validate files
    if (!files || (files instanceof FileList && files.length === 0) ||
      (Array.isArray(files) && files.length === 0)) {
      return throwError(() => new Error('No files selected for upload'));
    }

    // Handle different file input types
    if (files instanceof FileList) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
    } else if (Array.isArray(files)) {
      for (const file of files) {
        formData.append('files', file);
      }
    } else if (files instanceof File) {
      formData.append('files', files);
    }

    // Validate and add entityType
    const entityType = 'Product';
    formData.append('entityType', entityType);

    // Validate and add entityId
    if (!product?.id) {
      return throwError(() => new Error('Product ID is required'));
    }
    formData.append('entityId', product.id);

    // Add request options with increased timeout
    const options = {
      reportProgress: true,
      observe: 'events' as const
    };

    return this.http.post<ApiResponse<string>>(
      this.baseUrl + "api/v1/attachments/upload-multiple",
      formData,
      options
    ).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          // Calculate and return upload progress if needed
          const progress = Math.round(100 * event.loaded / event.total);
          return { status: 'progress', progress };
        } else if (event.type === HttpEventType.Response) {
          // Return the complete response
          return event.body;
        }
        return null; // Other events
      }),
      filter(response => response !== null),
      catchError(error => {
        return throwError(() => new Error('File upload failed: ' +
          (error.message || 'Server connection error. Please try again with smaller files or later.')));
      }),
      switchMap((response: any) => {
        if (!response) {
          return of(null);
        }
        if (response.status === 'progress') return of(response);

        // Handle API response
        if (response && response.status === 'success') {
          return of(response.data);
        } else {
          return throwError(() => new Error(response?.message || 'Unknown upload error'));
        }
      })
    );
  }
}
