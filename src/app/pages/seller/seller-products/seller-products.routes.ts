import {Routes} from "@angular/router";
import {CreateProductComponent} from './create/create.component';
import {UpdateComponent} from './update/update.component';
import {IndexComponent} from './index/index.component';

export const SellerProductsRoutes: Routes = [
  {
    path: 'create',
    component: CreateProductComponent,
  },
  {
    path: 'update/:slug',
    component: UpdateComponent,
  },
  {
    path: '',
    component: IndexComponent,
  }
]
