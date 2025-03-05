import { Component, HostListener, ElementRef } from '@angular/core';
import { AuthService } from "../../core/services/auth.service";
import {RouterLink, RouterLinkActive} from "@angular/router";
import { LogoComponent } from "../logo/logo.component";
import { ThemeButtonComponent } from '../theme-button/theme-button.component';
import User from '../../types/User';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    LogoComponent,
    ThemeButtonComponent,
    NgIf,
    RouterLinkActive
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private authService: AuthService;
  role: string | null;
  isUserDropdownOpen = false;
  isMobileMenuOpen = false;

  constructor(
    authService: AuthService,
    private elementRef: ElementRef
  ) {
    this.authService = authService;
    this.role = authService.user?.role ?? null;
  }

  // Toggle user dropdown
  toggleUserDropdown(event: Event) {
    event.stopPropagation();
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
    this.isMobileMenuOpen = false; // Close mobile menu when opening user dropdown
  }

  // Toggle mobile menu
  toggleMobileMenu(event: Event) {
    event.stopPropagation();
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.isUserDropdownOpen = false; // Close user dropdown when opening mobile menu
  }

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isUserDropdownOpen = false;
      this.isMobileMenuOpen = false;
    }
  }

  logout() {
    this.authService.logout();
    this.isUserDropdownOpen = false;
    this.isMobileMenuOpen = false;
  }

  get user(): User | null {
    return this.authService.user;
  }
}
