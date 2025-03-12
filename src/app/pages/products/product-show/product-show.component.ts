import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ProductService} from '../../../core/services/product.service';
import Product from '../../../types/Product';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

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
  isAddingToCart: boolean = false;
  isAddingToFavorites: boolean = false;
  isRemovingFromFavorites: boolean = false;
  isFavorite: boolean = false;
  private slideInterval: any;


  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.slug = params['slug'];
    });

    this.productService.getProductBySlug(this.slug)?.subscribe(
      product => {
        this.product = product;
      }
    )
  }

  get hasProduct(): boolean {
    return this.product !== null;
  }

  get productImages(): string[] {
    if (this.product?.attachmentsSrc.length == 0)
      return ["assets/images/default-product-image.png"];
    return this.product?.attachmentsSrc || [];
  }

  // checkIfFavorite(): void {
  //   if (!this.product) return;
  //
  //   this.favoriteService.checkIsFavorite(this.product.id).subscribe({
  //     next: (isFavorite) => {
  //       this.isFavorite = isFavorite;
  //     },
  //     error: (error) => {
  //       console.error('Error checking favorite status:', error);
  //     }
  //   });
  // }
  //
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

  //
  // addToCart(): void {
  //   if (!this.product) return;
  //
  //   this.isAddingToCart = true;
  //   this.cartService.addToCart(this.product.id, this.quantity).subscribe({
  //     next: () => {
  //       this.isAddingToCart = false;
  //       // Show success notification or update cart count
  //     },
  //     error: (error) => {
  //       this.isAddingToCart = false;
  //       console.error('Error adding to cart:', error);
  //     }
  //   });
  // }
  //
  // addToFavorites(): void {
  //   if (!this.product) return;
  //
  //   this.isAddingToFavorites = true;
  //   this.favoriteService.addToFavorites(this.product.id).subscribe({
  //     next: () => {
  //       this.isAddingToFavorites = false;
  //       this.isFavorite = true;
  //     },
  //     error: (error) => {
  //       this.isAddingToFavorites = false;
  //       console.error('Error adding to favorites:', error);
  //     }
  //   });
  // }
  //
  // removeFromFavorites(): void {
  //   if (!this.product) return;
  //
  //   this.isRemovingFromFavorites = true;
  //   this.favoriteService.removeFromFavorites(this.product.id).subscribe({
  //     next: () => {
  //       this.isRemovingFromFavorites = false;
  //       this.isFavorite = false;
  //     },
  //     error: (error) => {
  //       this.isRemovingFromFavorites = false;
  //       console.error('Error removing from favorites:', error);
  //     }
  //   });
  // }
  public handleQuantityChange() {
    if (this.product && this.quantity > this.product?.quantity) {
      this.quantity = this.product?.quantity || 1;
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
