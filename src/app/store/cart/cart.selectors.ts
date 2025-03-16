import { createFeatureSelector, createSelector } from '@ngrx/store';
import Cart from '../../types/Cart';

export const selectCart = createFeatureSelector<Cart>('cart');

export const selectCartProducts = createSelector(
  selectCart,
  (state: Cart) => state.productsUnits
);

export const selectCartTotalPrice = createSelector(
  selectCart,
  (state: Cart) => state.productsUnits.reduce((acc, product) => acc + product.price, 0)
);
