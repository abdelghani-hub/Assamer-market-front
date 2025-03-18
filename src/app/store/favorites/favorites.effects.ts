import {Injectable, inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {map, catchError, switchMap} from 'rxjs/operators';
import {FavoritesService} from '../../core/services/favorites.service';
import {addToFavorites, loadFavorites, loadFavoritesSuccess, removeFromFavorites} from './favorites.actions';

@Injectable()
export class FavoritesEffects {
  private actions$ = inject(Actions);
  private favoritesService = inject(FavoritesService);

  loadFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFavorites),
      switchMap(() => {
        return this.favoritesService.getFavoriteProducts().pipe(
          map(favorites => loadFavoritesSuccess({favorites})),
          catchError(error => {
            console.error('Error loading favorites:', error);
            return of(loadFavoritesSuccess({favorites: []}));
          })
        );
      })
    )
  );

  addToFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addToFavorites),
      switchMap(({productSlug}) => {
        return this.favoritesService.addProductToFavorites(productSlug).pipe(
          map(() => loadFavorites()),
          catchError(error => {
            console.error('Error adding to favorites:', error);
            return of(loadFavorites());
          })
        );
      })
    )
  );

  removeFromFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeFromFavorites),
      switchMap(({productSlug}) => {
        return this.favoritesService.removeProductFromFavorites(productSlug).pipe(
          map(() => loadFavorites()),
          catchError(error => {
            console.error('Error removing from favorites:', error);
            return of(loadFavorites());
          })
        );
      })
    )
  );
}
