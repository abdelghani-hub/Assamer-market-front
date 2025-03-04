import {HttpInterceptorFn} from '@angular/common/http';
import {catchError, throwError} from 'rxjs';
import Swal from 'sweetalert2';

export const errorInterceptor: HttpInterceptorFn = (response, next) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  return next(response).pipe(
    catchError((err) => {
      if (err.status === 401 || err.status === 403) {
        Toast.fire({
          icon: 'error',
          title: 'Unauthorized : ' + err.message
        });
      }
      if (err.status === 404) {
        Toast.fire({
          icon: 'error',
          title: 'Not Found : ' + err.message
        });
      }
      if (err.status === 500) {
        Toast.fire({
          icon: 'error',
          title: 'Internal Server Error : ' + err.message
        });
      }
      return throwError(() => err);
    }));
};
