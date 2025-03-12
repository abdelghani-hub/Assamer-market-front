import {Routes} from "@angular/router";
import {CategoriesPageComponent} from './categories-page/categories-page.component';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: ':name',
    component: CategoriesPageComponent
  }
]
