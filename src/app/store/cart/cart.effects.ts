import {Injectable, inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {addToCart, loadCart, loadCartSuccess, removeFromCart} from './cart.actions';
import CartItem from '../../types/CartItem';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);

  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCart),
      mergeMap(() => {
        const cart = JSON.parse(localStorage.getItem('cart') ?? '{"productsUnits": []}');
        return of(loadCartSuccess({cart}));
      })
    )
  );

  addToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addToCart),
      mergeMap(({product, quantity}) => {
        const cart = JSON.parse(localStorage.getItem('cart') ?? '{"productsUnits": []}');

        // Check if product already exists in cart
        const existingProductIndex = cart.productsUnits.findIndex(
          (item: CartItem) => item.productSlug === product.slug
        );

        if (existingProductIndex !== -1) {
          // Update quantity and price if product already exists
          cart.productsUnits[existingProductIndex].quantity += quantity;
          cart.productsUnits[existingProductIndex].price += product.price * quantity;
        } else {
          // Add new product if it doesn't exist
          cart.productsUnits.push({
            productSlug: product.slug,
            quantity: quantity,
            photo: product.attachmentsSrc[0],
            price: product.price * quantity
          });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        return of(loadCart());
      })
    )
  );

  removeFromCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeFromCart),
      mergeMap(({productSlug}) => {
        const cart = JSON.parse(localStorage.getItem('cart') ?? '{"productsUnits": []}');
        cart.productsUnits = cart.productsUnits.filter(
          (pu: CartItem) => pu.productSlug !== productSlug
        );
        localStorage.setItem('cart', JSON.stringify(cart));
        return of(loadCart());
      })
    )
  );
}
