import { createReducer, on } from '@ngrx/store';
import Product from '../../types/Product';
import { loadFavoritesSuccess } from './favorites.actions';

export interface FavoritesState {
  products: Product[];
  loading: boolean;
}

export const initialState: FavoritesState = {
  products: [],
  loading: false
};

export const favoritesReducer = createReducer(
  initialState,
  on(loadFavoritesSuccess, (state, { favorites }) => ({
    ...state,
    products: favorites,
    loading: false
  }))
);
