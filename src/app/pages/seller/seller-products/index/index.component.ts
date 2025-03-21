import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Product from '../../../../types/Product';
import {ProductService} from '../../../../core/services/product.service';
import {NotificationUtil} from '../../../../helpers/NotificationUtil';

@Component({
  selector: 'app-seller-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getMyStoreProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  async deleteProduct(productSlug: string): Promise<void> {
    const userConfirmed = await NotificationUtil.confirm('Are you sure you want to delete this product?', 'Delete Product');
    if (userConfirmed) {
      this.productService.deleteProduct(productSlug).subscribe({
        next: () => {
          this.products = this.products.filter(product => product.slug !== productSlug);
          NotificationUtil.success("Product deleted successfully.");
        },
        error: (error) => {
          NotificationUtil.error("Error deleting product. Please try again later.");
        }
      });
    }
  }

  getImageSrc(product: Product) {
    if (product.attachmentsSrc.length == 0)
      return "assets/images/default-product-image.png";

    return product.attachmentsSrc[0];
  }
}
