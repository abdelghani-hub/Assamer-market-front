import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {errorInterceptor} from './core/interceptors/error.interceptor';
import {jwtInterceptor} from './core/interceptors/jwt.interceptor';
import { provideStore } from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import {cartReducer} from './store/cart/cart.reducer';
import {CartEffects} from './store/cart/cart.effects';
import {provideStoreDevtools} from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([jwtInterceptor, errorInterceptor])
    ),
    provideStore({ cart: cartReducer }),
    provideEffects([CartEffects]),
    provideStoreDevtools({ maxAge: 25 })
  ]
};
