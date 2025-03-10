import {Component, OnInit} from '@angular/core';
import {HeroSectionComponent} from '../../components/hero-section/hero-section.component';
import {CategoriesSectionComponent} from '../../components/categories-section/categories-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroSectionComponent,
    CategoriesSectionComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {

  }
}
