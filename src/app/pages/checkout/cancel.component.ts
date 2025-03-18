import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NotificationUtil} from '../../helpers/NotificationUtil';

@Component({
  selector: 'app-checkout-cancel',
  standalone: true,
  template: '<div>Processing payment cancellation...</div>',
})
export class CheckoutCancelComponent implements OnInit {
  constructor(private router: Router) {
  }

  ngOnInit(): void {
    NotificationUtil.warning('You have cancelled the payment');
    setTimeout(() => {
      this.router.navigate(['/profile']).then(
        () => null
      );
    }, 2000);
  }
}
