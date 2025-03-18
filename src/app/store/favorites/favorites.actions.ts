import { createAction, props } from '@ngrx/store';
import Product from '../../types/Product';

export const loadFavorites = createAction('[Favorites] Load Favorites');
export const loadFavoritesSuccess = createAction('[Favorites] Load Favorites Success', props<{ favorites: Product[] }>());
export const addToFavorites = createAction('[Favorites] Add To Favorites', props<{ productSlug: string }>());
export const removeFromFavorites = createAction('[Favorites] Remove From Favorites', props<{ productSlug: string }>());
