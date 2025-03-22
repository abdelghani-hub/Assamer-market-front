import {Routes} from "@angular/router";
import {CreateProductComponent} from './create/create.component';
import {IndexComponent} from './index/index.component';
import {EditProductComponent} from './update/edit.component';

export const SellerProductsRoutes: Routes = [
  {
    path: 'create',
    component: CreateProductComponent,
  },
  {
    path: 'edit/:slug',
    component: EditProductComponent,
  },
  {
    path: '',
    component: IndexComponent,
  }
]
