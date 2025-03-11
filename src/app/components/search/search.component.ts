import { Component, Input } from '@angular/core';
import Category from '../../types/Category';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './search.component.html',
  styles: ``,
})
export class SearchComponent {
  @Input() categories: Category[] = [];
}
