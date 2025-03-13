import {Routes} from '@angular/router';
import {LandingComponent} from './layouts/landing/landing.component';
import {HomeComponent} from './pages/home/home.component';
import {roleGuard} from './core/guards/role.guard';
import {authGuard} from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },

      // Products routes
      {
        path: 'products',
        children: [
          {
            path: "",
            loadChildren: () => import('./pages/products/products.routes').then(m => m.PRODUCTS_ROUTES)
          }
        ]
      },

      // Categories routes
      {
        path: 'categories',
        loadChildren: () => import('./pages/categories/categories.routes').then(m => m.CATEGORIES_ROUTES)
      }
    ]
  },

  // Auth routes
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.routes').then(m => m.AUTH_ROUTES),
    canActivate: [authGuard]
  },

  // Admin routes
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [roleGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },

  // Seller routes
  {
    path: 'seller',
    loadChildren: () => import('./pages/seller/seller.routes').then(m => m.SellerRoutes),
    canActivate: [roleGuard],
    data: {
      roles: ['ROLE_SELLER']
    }
  }
];
