import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ProductService} from '../../../core/services/product.service';
import Product from '../../../types/Product';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {addToCart} from '../../../store/cart/cart.actions';
import {Store} from '@ngrx/store';
import {AuthService} from '../../../core/services/auth.service';
import {selectAllFavorites, selectFavoritesLoading} from '../../../store/favorites/favorites.selectors';
import {addToFavorites, loadFavorites, removeFromFavorites} from '../../../store/favorites/favorites.actions';

@Component({
  selector: 'app-product-show',
  standalone: true,
  templateUrl: './product-show.component.html',
  imports: [
    NgIf,
    NgClass,
    NgForOf,
    RouterLink,
    FormsModule
  ],
  styles: ``
})
export class ProductShowComponent implements OnInit {
  slug: string | null = null;
  product: Product | null = null;
  quantity: number = 1;
  currentSlide: number = 0;
  isAddingToFavorites: boolean = false;
  isRemovingFromFavorites: boolean = false;
  isFavorite: boolean = false;
  favorites: Product[] = [];
  favoritesLoading = false;
  favoriteActionInProgress = false;
  private slideInterval: any;
  private store: Store;
  private authService: AuthService;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    store: Store,
    authService: AuthService) {
    this.store = store;
    this.authService = authService;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.slug = params['slug'];
    });

    this.productService.getProductBySlug(this.slug)?.subscribe(
      product => {
        this.product = product;
        this.checkIfFavorite();
      }
    );

    if (!this.user) {
      return;
    }
    // Load favorites when component initializes
    this.store.dispatch(loadFavorites());

    // Subscribe to favorites state to keep local cache updated
    this.store.select(selectAllFavorites).subscribe(favorites => {
      this.favorites = favorites;
      this.checkIfFavorite();
    });

    // Subscribe to loading state
    this.store.select(selectFavoritesLoading).subscribe(loading => {
      this.favoritesLoading = loading;
    });
  }

  get hasProduct(): boolean {
    return this.product !== null;
  }

  get productImages(): string[] {
    if (this.product?.attachmentsSrc.length == 0)
      return ["assets/images/default-product-image.png"];
    return this.product?.attachmentsSrc || [];
  }

  get user() {
    return this.authService.user;
  }

  incrementQuantity(): void {
    if (this.product && this.quantity < this.product.quantity) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      this.store.dispatch(addToCart({product: this.product, quantity: this.quantity}));
    }
  }

  public handleQuantityChange() {
    if (this.product && this.quantity > this.product?.quantity) {
      this.quantity = this.product?.quantity || 1;
    }
  }

  checkIfFavorite(): void {
    if (!this.product) return;
    this.isFavorite = this.favorites.some(p => p.slug === this.product?.slug);
  }

  addToFavorites(): void {
    if (this.product && !this.favoriteActionInProgress) {
      this.isAddingToFavorites = true;
      this.favoriteActionInProgress = true;
      this.store.dispatch(addToFavorites({productSlug: this.product.slug}));

      // Reset action flags after a short delay to prevent multiple clicks
      setTimeout(() => {
        this.isAddingToFavorites = false;
        this.favoriteActionInProgress = false;
      }, 1000);
    }
  }

  removeFromFavorites(): void {
    if (this.product && !this.favoriteActionInProgress) {
      this.isRemovingFromFavorites = true;
      this.favoriteActionInProgress = true;
      this.store.dispatch(removeFromFavorites({productSlug: this.product.slug}));

      // Reset action flags after a short delay to prevent multiple clicks
      setTimeout(() => {
        this.isRemovingFromFavorites = false;
        this.favoriteActionInProgress = false;
      }, 1000);
    }
  }

  // Start automatic slideshow
  startSlideshow() {
    if (this.productImages.length > 1) {
      this.slideInterval = setInterval(() => {
        this.nextSlide();
      }, 2000); // Change slide every 2 seconds
    }
  }

  // Stop the slideshow
  stopSlideshow() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  // Restart the slideshow - useful after manual navigation
  restartSlideshow() {
    this.stopSlideshow();
    this.startSlideshow();
  }

  // Navigate to specific slide
  goToSlide(slideIndex: number) {
    if (this.productImages.length > 0) {
      this.currentSlide = slideIndex;
      // Reset the timer when manually changing slides
      this.restartSlideshow();
    }
  }

  // Go to next slide
  nextSlide() {
    if (this.productImages.length > 0) {
      this.currentSlide = (this.currentSlide + 1) % this.productImages.length;
    }
  }

  // Go to previous slide
  prevSlide() {
    if (this.productImages.length > 0) {
      this.currentSlide = (this.currentSlide - 1 + this.productImages.length) % this.productImages.length;
      // Reset the timer when manually changing slides
      this.restartSlideshow();
    }
  }
}
