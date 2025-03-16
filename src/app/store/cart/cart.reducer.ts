import { createReducer, on } from '@ngrx/store';
import Cart from '../../types/Cart';
import { loadCartSuccess, addToCart, removeFromCart, clearCart } from './cart.actions';

export const initialState: Cart = { productsUnits: [] };

export const cartReducer = createReducer(
  initialState,
  on(loadCartSuccess, (state, { cart }) => ({ ...state, ...cart })),
  on(addToCart, (state, { product }) => ({
    ...state,
    productsUnits: [...state.productsUnits, product]
  })),
  on(removeFromCart, (state, { productSlug }) => ({
    ...state,
    productsUnits: state.productsUnits.filter(product => product.productSlug !== productSlug)
  })),
  on(clearCart, state => ({ ...state, productsUnits: [] }))
);
