import {Component, OnInit} from '@angular/core';
import {HeroSectionComponent} from '../../components/hero-section/hero-section.component';
import {CategoriesSectionComponent} from '../../components/categories-section/categories-section.component';
import {ProductCardComponent} from '../../components/product-card/product-card.component';
import {SearchComponent} from '../../components/search/search.component';
import { CategoryService } from '../../core/services/category.service';
import Category from '../../types/Category';
import {ProductService} from '../../core/services/product.service';
import Product from '../../types/Product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroSectionComponent,
    CategoriesSectionComponent,
    ProductCardComponent,
    SearchComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  public categories: Category[] = [];
  public popularProducts: Product[] = [];

  constructor(private categoryService: CategoryService, private productService: ProductService) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      }
    );

    this.productService.getPopularProducts().subscribe(
      (products: Product[]) => {
        this.popularProducts = products;
      }
    );
  }
}
