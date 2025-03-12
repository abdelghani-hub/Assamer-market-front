import {Routes} from "@angular/router";
import {ProductShowComponent} from './product-show/product-show.component';
export const PRODUCTS_ROUTES: Routes = [
  {
    path: ':slug',
    component: ProductShowComponent,
  }
]
