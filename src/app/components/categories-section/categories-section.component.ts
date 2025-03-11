import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener, Renderer2 } from '@angular/core';
import { CategoryService } from '../../core/services/category.service';
import Category from '../../types/Category';
import { NotificationUtil } from '../../helpers/NotificationUtil';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories-section',
  standalone: true,
  templateUrl: './categories-section.component.html',
  imports: [
    NgForOf,
    RouterLink,
    NgIf
  ],
  styleUrls: ['./categories-section.component.css']
})
export class CategoriesSectionComponent implements OnInit, AfterViewInit {
  public categories: Category[] = [];
  public defaultCategoryImage = 'assets/images/default-category.png';

  @ViewChild('slider') sliderElement!: ElementRef<HTMLDivElement>;
  @ViewChild('sliderContainer') sliderContainer!: ElementRef<HTMLDivElement>;

  public isLoading = true;

  constructor(
    private categoryService: CategoryService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
        this.isLoading = false;
        setTimeout(() => this.adjustSlider(), 0); // Adjust slider after data loads
      },
      error: (error) => {
        NotificationUtil.error(error);
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.adjustSlider();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.adjustSlider();
  }

  // Adjust slider dimensions and scroll behavior
  adjustSlider(): void {
    if (!this.sliderElement || !this.sliderContainer) return;

    const containerWidth = this.sliderContainer.nativeElement.clientWidth;
    const sliderWidth = this.sliderElement.nativeElement.scrollWidth;

    // Enable horizontal scrolling if content overflows
    if (sliderWidth > containerWidth) {
      this.renderer.setStyle(this.sliderContainer.nativeElement, 'overflow-x', 'auto');
      this.renderer.setStyle(this.sliderContainer.nativeElement, 'scrollbar-width', 'thin');
      this.renderer.setStyle(this.sliderContainer.nativeElement, 'scrollbar-color', '#4CAF50 #f1f1f1');
    } else {
      this.renderer.setStyle(this.sliderContainer.nativeElement, 'overflow-x', 'hidden');
    }
  }

  getCategoryImage(category: Category): string {
    return category.imageSrc || this.defaultCategoryImage;
  }
}
