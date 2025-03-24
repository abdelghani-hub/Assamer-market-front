// sidebar.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {AuthService} from '../../core/services/auth.service';
import {SellerService} from '../../core/services/seller.service';

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

  constructor(private authService: AuthService,
              private sellerService: SellerService
  ) {}

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
    this.sellerService.getSellerRequestsCount().subscribe((count) => {
      this.sellerRequestsCount = count;
    });
  }

  toggleDropdown(dropdown: string): void {
    if (dropdown === 'pages') {
      this.dropdownPages = !this.dropdownPages;
    } else if (dropdown === 'sales') {
      this.dropdownSales = !this.dropdownSales;
    }
  }
}
