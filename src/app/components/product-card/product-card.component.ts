import {Component, Input, OnInit} from '@angular/core';
import Product from '../../types/Product';
import {NgIf, SlicePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';
import {addToCart} from '../../store/cart/cart.actions';
import {Store} from '@ngrx/store';
import {selectAllFavorites, selectFavoritesLoading} from '../../store/favorites/favorites.selectors';
import {addToFavorites, loadFavorites, removeFromFavorites} from '../../store/favorites/favorites.actions';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    SlicePipe
  ],
  templateUrl: './product-card.component.html',
  styles: `
    .favorites-loading {
      opacity: 0.3;
      pointer-events: none;
    }
  `
})
export class ProductCardComponent implements OnInit {
  @Input() product: Product | null = null;
  favorites: Product[] = [];
  favoritesLoading = false;
  favoriteActionInProgress = false;

  private authService: AuthService;
  private store: Store;

  constructor(authService: AuthService, store: Store) {
    this.authService = authService;
    this.store = store;
  }

  ngOnInit(): void {
    // Check if user authenticated
    if (!this.user){
      return;
    }
    // Load favorites when component initializes
    this.store.dispatch(loadFavorites());

    // Subscribe to favorites state to keep local cache updated
    this.store.select(selectAllFavorites).subscribe(favorites => {
      this.favorites = favorites;
    });

    // Subscribe to loading state
    this.store.select(selectFavoritesLoading).subscribe(loading => {
      this.favoritesLoading = loading;
    });
  }

  get user() {
    return this.authService.user;
  }

  getImageSrc(product: Product) {
    if (product.attachmentsSrc.length == 0)
      return "assets/images/default-product-image.png";

    return product.attachmentsSrc[0];
  }

  // ****************** Cart logic ******************
  addToCart() {
    if (this.product)
      this.store.dispatch(addToCart({product: this.product, quantity: 1}));
  }

  // ****************** Favorite logic ******************
  isInFavorites(): boolean {
    return this.favorites.some(p => p.slug === this.product?.slug);
  }

  addToFavorites(): void {
    if (this.product && !this.favoriteActionInProgress) {
      this.favoriteActionInProgress = true;
      this.store.dispatch(addToFavorites({productSlug: this.product.slug}));

      // Reset action flag after a short delay to prevent multiple clicks
      setTimeout(() => {
        this.favoriteActionInProgress = false;
      }, 1000);
    }
  }

  removeFromFavorites(): void {
    if (this.product && !this.favoriteActionInProgress) {
      this.favoriteActionInProgress = true;
      this.store.dispatch(removeFromFavorites({productSlug: this.product.slug}));

      // Reset action flag after a short delay to prevent multiple clicks
      setTimeout(() => {
        this.favoriteActionInProgress = false;
      }, 1000);
    }
  }
}
