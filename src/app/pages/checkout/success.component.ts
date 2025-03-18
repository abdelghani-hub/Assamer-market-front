import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NotificationUtil} from '../../helpers/NotificationUtil';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  template: '<div>Processing successful payment...</div>',
})
export class CheckoutSuccessComponent implements OnInit {
  constructor(private router: Router) {
  }

  ngOnInit(): void {
    NotificationUtil.success('Payment successful');
    setTimeout(() => {
      this.router.navigate(['/home']).then(
        () => null
      );
    }, 2000);
  }
}
