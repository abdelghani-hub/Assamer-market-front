import { Component, OnInit } from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-theme-button',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './theme-button.component.html'
})
export class ThemeButtonComponent implements OnInit {

  isDarkMode: boolean = false;

  ngOnInit(): void {
    this.loadTheme();
  }

  loadTheme(): void {
    const storedTheme = localStorage.getItem('color-theme');
    this.isDarkMode = storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
    }
  }
}
