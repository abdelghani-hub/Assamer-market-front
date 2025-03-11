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
      }
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.routes').then(m => m.AUTH_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [roleGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'seller',
    loadChildren: () => import('./pages/seller/seller.routes').then(m => m.SellerRoutes),
    canActivate: [roleGuard],
    data: {
      roles: ['ROLE_SELLER']
    }
  }
];
