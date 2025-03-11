import Swal from 'sweetalert2';

export class NotificationUtil {
  static success(message: string, title: string = 'Success') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }

  static error(message: string, title: string = 'Error') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }

  static info(message: string, title: string = 'Info') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'info',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }

  static warning(message: string, title: string = 'Warning') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }
}
