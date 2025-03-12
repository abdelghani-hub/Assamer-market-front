import {Component, Input} from '@angular/core';
import Product from '../../types/Product';
import {NgIf, SlicePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';

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

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  get user() {
    return this.authService.user;
  }

  getAttachementsSrc(product: Product): string[] {
    if (product.attachmentsSrc.length == 0)
      return ['assets/images/default-product.png'];

    return product.attachmentsSrc;
  }

  getImageSrc(product: Product) {
    if (product.attachmentsSrc.length == 0)
      return "assets/images/default-product-image.png";

    return product.attachmentsSrc[0];
  }
}
