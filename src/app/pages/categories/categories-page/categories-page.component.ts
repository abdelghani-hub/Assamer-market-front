import {Component, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import Category from '../../../types/Category';
import Product from '../../../types/Product';
import {ProductCardComponent} from '../../../components/product-card/product-card.component';
import {ProductService} from '../../../core/services/product.service';
import {CategoryService} from '../../../core/services/category.service';
import {NotificationUtil} from '../../../helpers/NotificationUtil';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './categories-page.component.html',
  styles: ``
})
export class CategoriesPageComponent implements OnInit, AfterViewInit {
  @ViewChild('categoriesHeader') categoriesHeader!: ElementRef;

  categories: Category[] = [];
  currentCategory: Category | null = null;
  products: Product[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const categoryName = params['name'];

      this.products = [];
      this.loading = true;

      this.categoryService.getCategories().subscribe({
        next: (categories: Category[]) => {
          this.categories = categories;

          this.currentCategory = this.categories.find(cat => cat.name == categoryName) || null;


          // Fetch products for this category
          if (!this.currentCategory) {
            this.currentCategory = this.categories[0];
            // Update URL without navigation
            const url = this.router.createUrlTree(['/categories', this.currentCategory.name]).toString();
            this.router.navigateByUrl(url, {
              replaceUrl: true,
              skipLocationChange: false
            }).then(null);
          }
          this.productService.getByCategory(this.currentCategory.name).subscribe({
            next: (products) => {
              this.products = products || [];
            },
            error: () => {
              NotificationUtil.error("Failed to fetch products");
            },
            complete: () => {
              this.loading = false;
            }
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCategorySlider();
    }, 100);
  }

  slidePrev(): void {
    if (this.categoriesHeader) {
      this.categoriesHeader.nativeElement.scrollLeft -= 200;
      this.updateButtonVisibility();
    }
  }

  slideNext(): void {
    if (this.categoriesHeader) {
      this.categoriesHeader.nativeElement.scrollLeft += 200;
      this.updateButtonVisibility();
    }
  }

  private initCategorySlider(): void {
    if (this.categoriesHeader) {
      this.categoriesHeader.nativeElement.addEventListener('scroll', () => {
        this.updateButtonVisibility();
      });

      // Initialize button visibility
      this.updateButtonVisibility();
    }
  }

  private updateButtonVisibility(): void {
    const header = this.categoriesHeader.nativeElement;
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');

    if (prevBtn && nextBtn) {
      if (header.scrollLeft > 0) {
        prevBtn.classList.remove('hidden');
      } else {
        prevBtn.classList.add('hidden');
      }

      if (header.scrollLeft + header.clientWidth < header.scrollWidth - 20) {
        nextBtn.classList.remove('hidden');
      } else {
        nextBtn.classList.add('hidden');
      }
    }
  }

  isCategoryActive(category: Category): boolean {
    return this.currentCategory?.name == category.name;
  }
}
