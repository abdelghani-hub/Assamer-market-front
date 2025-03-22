// sidebar.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './aside.component.html'
})
export class AsideComponent implements OnInit {
  isAdmin = false;
  isSeller = false;
  sellerRequestsCount = 0;
  dropdownPages = true;
  dropdownSales = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.user;
    if (user) {
      this.isAdmin = user.role === 'ROLE_ADMIN';
      this.isSeller = user.role === 'ROLE_SELLER';
    }

    // In a real application, you would fetch this count from an API
    if (this.isAdmin) {
      this.fetchSellerRequestsCount();
    }
  }

  fetchSellerRequestsCount(): void {
    // This would be replaced with an actual API call
    this.sellerRequestsCount = 5;
  }

  toggleDropdown(dropdown: string): void {
    if (dropdown === 'pages') {
      this.dropdownPages = !this.dropdownPages;
    } else if (dropdown === 'sales') {
      this.dropdownSales = !this.dropdownSales;
    }
  }
}
