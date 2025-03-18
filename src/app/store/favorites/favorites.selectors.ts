import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoritesState } from './favorites.reducer';

export const selectFavoritesState = createFeatureSelector<FavoritesState>('favorites');

export const selectAllFavorites = createSelector(
  selectFavoritesState,
  (state: FavoritesState) => state.products
);

export const selectFavoritesLoading = createSelector(
  selectFavoritesState,
  (state: FavoritesState) => state.loading
);

export const selectIsFavorite = (productSlug: string) => createSelector(
  selectAllFavorites,
  (favorites) => favorites.some(product => product.slug === productSlug)
);

export const selectFavoritesCount = createSelector(
  selectAllFavorites,
  (favorites) => favorites.length
);
