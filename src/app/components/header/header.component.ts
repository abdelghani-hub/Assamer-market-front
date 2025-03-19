import {Component, HostListener, ElementRef} from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {LogoComponent} from "../logo/logo.component";
import {ThemeButtonComponent} from '../theme-button/theme-button.component';
import User from '../../types/User';
import {AsyncPipe, NgIf} from '@angular/common';
import {CartComponent} from '../cart/cart.component';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {selectCartProducts, selectCartTotalPrice} from '../../store/cart/cart.selectors';
import {SellerService} from '../../core/services/seller.service';
import {NotificationUtil} from '../../helpers/NotificationUtil';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    LogoComponent,
    ThemeButtonComponent,
    NgIf,
    RouterLinkActive,
    CartComponent,
    AsyncPipe
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private authService: AuthService;
  role: string | null;
  isUserDropdownOpen = false;
  isMobileMenuOpen = false;
  isCartOpen = false;
  cartProducts$: Observable<any[]>;
  cartTotalPrice$: Observable<number>;

  constructor(
    authService: AuthService,
    private sellerService: SellerService,
    private elementRef: ElementRef,
    private store: Store
  ) {
    this.authService = authService;
    this.role = authService.user?.role ?? null;
    this.cartProducts$ = this.store.select(selectCartProducts);
    this.cartTotalPrice$ = this.store.select(selectCartTotalPrice);
  }

  // Toggle user dropdown
  toggleUserDropdown(event: Event) {
    event.stopPropagation();
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
    this.isMobileMenuOpen = false;
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

  // ****************** Seller Request ****************** //
  requestSeller() {
    this.sellerService.requestSeller().subscribe(res => {
      if(res.status == "success") {
        NotificationUtil.success("Request sent successfully");
        if (res.token) {
          this.authService.refreshUser(res.token);
        }
      }else{
        NotificationUtil.error("Request failed");
      }
    });
  }


  // ****************** Cart ****************** //
  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
  }
}
