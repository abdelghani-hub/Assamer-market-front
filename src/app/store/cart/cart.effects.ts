import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { loadCart, loadCartSuccess } from './cart.actions';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);

  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCart),
      mergeMap(() => {
        const cart = JSON.parse(localStorage.getItem('cart') ?? '{"productsUnits": []}');
        return of(loadCartSuccess({ cart }));
      })
    )
  );
}
