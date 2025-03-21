import {Component, OnInit, inject} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {Router} from '@angular/router';
import {ProductService} from '../../../../core/services/product.service';
import {NotificationUtil} from '../../../../helpers/NotificationUtil';
import {NgForOf, NgIf} from '@angular/common';
import Category from '../../../../types/Category';
import {CategoryService} from '../../../../core/services/category.service';
import {FileService} from '../../../../core/services/file.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  templateUrl: './create.component.html',
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf
  ]
})
export class CreateProductComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  loading: boolean = false;

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private fileService = inject(FileService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      slug: ['', [Validators.maxLength(100)]],
      summary: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
      images: [null, [this.fileTypeValidator([
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml',
        'image/bmp',
        'image/tiff'
      ])]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      categoryName: ['', Validators.required],
      status: ['ACTIVE', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]]
    });
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
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.loading = true;
      this.errorMessage = null;
      this.successMessage = null;

      this.productService.createProduct(this.productForm.value).subscribe({
        next: (product) => {
          NotificationUtil.info("Uploading images...");
          this.fileService.uploadProductImages(this.productForm.get('images')?.value, product).subscribe(
            {
              next: () => {
                this.loading = false;
                NotificationUtil.success('Product created successfully.');
                this.router.navigate(['/seller/products']);
              },
              error: () => {
                this.loading = false;
                // delete product if image upload fails
                product && this.productService.deleteProduct(product?.slug).subscribe();
              }
            }
          )
        },
        error: (error) => {
          this.loading = false;

          if (error.error && error.error.status === "error") {
            NotificationUtil.error('Error creating product. Please try again.')

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
            NotificationUtil.error('Error creating product. Please try again.')
          }
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      this.markFormGroupTouched(this.productForm);
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      // Store the FileList directly instead of converting to array
      this.productForm.patchValue({
        images: input.files
      });
      this.productForm.get('images')?.updateValueAndValidity();
    }
  }

  fileTypeValidator(allowedTypes: string[]) {
    return (control: AbstractControl): ValidationErrors | null => {
      const files = control.value;

      if (!files) {
        return null;
      }

      // Handle both array of Files and FileList
      let fileArray: File[];
      if (files instanceof FileList) {
        fileArray = Array.from(files);
      } else if (Array.isArray(files)) {
        fileArray = files;
      } else if (files instanceof File) {
        fileArray = [files];
      } else {
        return null;
      }

      const invalidFiles = fileArray.filter(file => !allowedTypes.includes(file.type));

      return invalidFiles.length > 0 ? { fileType: true } : null;
    };
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
}
