import {Component, OnInit, inject} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../../core/services/product.service';
import {NotificationUtil} from '../../../../helpers/NotificationUtil';
import {NgForOf, NgIf} from '@angular/common';
import Category from '../../../../types/Category';
import {CategoryService} from '../../../../core/services/category.service';
import {FileService} from '../../../../core/services/file.service';
import Product from '../../../../types/Product';
import {FileUtil} from '../../../../helpers/FileUtil';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  templateUrl: './edit.component.html',
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf
  ]
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup = new FormGroup({});
  categories: Category[] = [];
  loading: boolean = false;
  product: Product = {
    name: '',
    slug: '',
    summary: '',
    quantity: 0,
    price: 0,
    categoryName: '',
    status: 'ACTIVE',
    description: '',
    attachmentsSrc: [],
    storeId: '',
    createdAt: '',
    updatedAt: ''
  };

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private fileService = inject(FileService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  constructor(private activatedRoute: ActivatedRoute) {
    this.initForm();
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: () => {
        NotificationUtil.error('Failed to load categories. Please try again.')
      }
    });
    this.activatedRoute.params.subscribe(params => {
      const slug: string = params['slug'];
      this.productService.getProductBySlug(slug).subscribe({
        next: (product) => {
          if (product) {
            this.product = product;
            this.productForm.patchValue({
              name: product.name,
              slug: product.slug,
              summary: product.summary,
              quantity: product.quantity,
              price: product.price,
              categoryName: product.categoryName,
              status: product.status,
              description: product.description
            });
          }
        },
        error: () => {
          NotificationUtil.error('Failed to load product. Please try again.')
        }
      });
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.loading = true;

      this.productService.updateProduct(this.product.slug, this.productForm.value).subscribe({
        next: (product) => {
          const fileInput = this.productForm.get('images')?.value;

          if (fileInput) {
            NotificationUtil.info("Uploading images...");

            // Create a progress variable if you want to show upload progress
            let uploadProgress = 0;

            this.fileService.uploadProductImages(fileInput, product).subscribe({
              next: (response) => {
                if (response && response.status === 'progress') {
                  // Update progress if desired
                  uploadProgress = response.progress;
                  console.log(`Upload progress: ${uploadProgress}%`);
                  // You could update a progress bar here
                } else {
                  // This is the final response with uploaded file URLs
                  console.log('Images uploaded successfully:', response);
                  // You might want to update the product's images here
                  if (Array.isArray(response)) {
                    this.product.attachmentsSrc = response;
                  }
                }
              },
              error: (err) => {
                this.loading = false;
                NotificationUtil.error(`Failed to upload images: ${err.message}`);
              },
              complete: () => {
                this.loading = false;
                NotificationUtil.success('Product and images updated successfully.');
                this.router.navigate(['/seller/products']).then(null);
              }
            });
          } else {
            this.loading = false;
            NotificationUtil.success('Product updated successfully.');
            this.router.navigate(['/seller/products']).then(null);
          }
        },
        error: (error) => {
          this.loading = false;

          if (error.error && error.error.status === "error") {
            NotificationUtil.error('Error editing product. Please try again.')

            // Handle field-specific validation errors from server
            if (error.error.errors && Array.isArray(error.error.errors)) {
              error.error.errors.forEach((err: { field: string; message: string }) => {
                const control = this.productForm.get(err.field);
                if (control) {
                  control.setErrors({serverError: err.message});
                  control.markAsTouched();
                }
              });
            }
          } else {
            NotificationUtil.error('Error editing product. Please try again.')
          }
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      this.markFormGroupTouched(this.productForm);
    }
  }

// Fix the onFileChange method to properly handle the file input
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      // This is the key change - keep the FileList intact
      this.productForm.patchValue({
        images: input.files
      });
      this.productForm.get('images')?.updateValueAndValidity();
    }
  }

  // Helper method to mark all form controls as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  generateSlug() {
    const name = this.productForm.get('name')?.value;
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      this.productForm.get('slug')?.setValue(slug);
    }
  }

  // Getters for form controls to simplify template access
  get name() {
    return this.productForm.get('name');
  }

  get slug() {
    return this.productForm.get('slug');
  }

  get summary() {
    return this.productForm.get('summary');
  }

  get description() {
    return this.productForm.get('description');
  }

  get quantity() {
    return this.productForm.get('quantity');
  }

  get price() {
    return this.productForm.get('price');
  }

  get categoryName() {
    return this.productForm.get('categoryName');
  }

  get images() {
    return this.productForm.get('images');
  }

  private initForm() {
    this.productForm = this.fb.group({
      name: [this.product.name, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      slug: [this.product.slug, [Validators.maxLength(100)]],
      summary: [this.product.summary, [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
      images: [null, [FileUtil.fileTypeValidator([
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml',
        'image/bmp',
        'image/tiff'
      ])]],
      quantity: [this.product.quantity, [Validators.required, Validators.min(0)]],
      price: [this.product.price, [Validators.required, Validators.min(0)]],
      categoryName: [this.product.categoryName, Validators.required],
      status: [this.product.status, Validators.required],
      description: [this.product.description, [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]]
    });
  }
}
