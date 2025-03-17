import {Injectable, inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {addToCart, clearCart, loadCart, loadCartSuccess, removeFromCart} from './cart.actions';
import CartItem from '../../types/CartItem';
import {ImgaesUtil} from '../../helpers/ImgaesUtil';

const getCart = () => {
  try {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : { productsUnits: [] };
  } catch (error) {
    console.error('Error parsing cart data:', error);
    return { productsUnits: [] };
  }
};

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);

  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCart),
      mergeMap(() => {
        const cart = getCart();
        return of(loadCartSuccess({cart}));
      })
    )
  );

  addToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addToCart),
      mergeMap(({product, quantity}) => {
        const cart = getCart();

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
            photo: ImgaesUtil.getLessLoadedImage(product.attachmentsSrc) || 'assets/images/default-product-image.png',
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
        const cart = getCart();
        cart.productsUnits = cart.productsUnits.filter(
          (pu: CartItem) => pu.productSlug !== productSlug
        );
        try {
          localStorage.setItem('cart', JSON.stringify(cart));
        } catch (error) {
          console.error('localStorage quota exceeded:', error);
        }
        return of(loadCart());
      })
    )
  );

  clearCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(clearCart),
      mergeMap(() => {
        localStorage.removeItem('cart');
        return of(loadCart());
      })
    )
  );
}
