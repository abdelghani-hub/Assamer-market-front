import {Routes} from "@angular/router";
import {CheckoutSuccessComponent} from './success.component';
import {CheckoutCancelComponent} from './cancel.component';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: 'success',
    component: CheckoutSuccessComponent
  },
  {
    path: 'cancel',
    component: CheckoutCancelComponent
  }
]
