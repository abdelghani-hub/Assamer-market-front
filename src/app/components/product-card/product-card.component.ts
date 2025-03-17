import {Component, Input} from '@angular/core';
import Product from '../../types/Product';
import {NgIf, SlicePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';
import {addToCart} from '../../store/cart/cart.actions';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    SlicePipe
  ],
  templateUrl: './product-card.component.html',
  styles: ``
})
export class ProductCardComponent {
  @Input() product: Product | null = null;

  private authService: AuthService;
  private store: Store;

  constructor(authService: AuthService, store: Store) {
    this.authService = authService;
    this.store = store;
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
  isInFavorites(id: string | undefined) {
    return false;
  }

  removeFromFavorites(id: string | undefined) {
    // todo
  }

  addToFavorites(id: string | undefined) {
    // todo
  }
}
