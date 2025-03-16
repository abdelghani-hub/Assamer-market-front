import { createAction, props } from '@ngrx/store';
import Cart from '../../types/Cart';

export const loadCart = createAction('[Cart] Load Cart');
export const loadCartSuccess = createAction('[Cart] Load Cart Success', props<{ cart: Cart }>());
export const addToCart = createAction('[Cart] Add To Cart', props<{ product: any }>());
export const removeFromCart = createAction('[Cart] Remove From Cart', props<{ productSlug: string }>());
export const clearCart = createAction('[Cart] Clear Cart');
