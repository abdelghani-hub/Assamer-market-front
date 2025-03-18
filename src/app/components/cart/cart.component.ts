import {Component, EventEmitter, Output} from '@angular/core';
import {AsyncPipe, NgForOf} from '@angular/common';
import {Store} from '@ngrx/store';
import {catchError, EMPTY, finalize, Observable, switchMap, take, tap} from 'rxjs';
import {selectCart, selectCartProducts, selectCartTotalPrice} from '../../store/cart/cart.selectors';
import {removeFromCart, clearCart} from '../../store/cart/cart.actions';
import CartItem from '../../types/CartItem';
import {OrderService} from '../../core/services/order.service';
import {NotificationUtil} from '../../helpers/NotificationUtil';
import {PaymentService} from '../../core/services/payment.service';
import {AuthService} from '../../core/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    NgForOf,
    AsyncPipe,
  ],
  templateUrl: './cart.component.html',
  styles: ``
})
export class CartComponent {
  @Output() closeCart = new EventEmitter<void>();
  cartProducts$: Observable<CartItem[]>;
  cartTotalPrice$: Observable<number>;

  constructor(
    private store: Store,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cartProducts$ = this.store.select(selectCartProducts);
    this.cartTotalPrice$ = this.store.select(selectCartTotalPrice);
  }

  removeFromCart(slug: string) {
    this.store.dispatch(removeFromCart({productSlug: slug}));
  }

  hideCart(): void {
    this.closeCart.emit();
  }

  checkout() {
    if (!this.authService.user) {
      this.router.navigate(['/auth/login']).then(
        () => NotificationUtil.warning('You need to login to checkout')
      );
      return;
    }

    this.store.select(selectCart).pipe(
      take(1),
      switchMap(cart => this.orderService.create(cart).pipe(
        tap(() => NotificationUtil.success("Order created successfully")),
        switchMap(res => this.paymentService.pay(res.data.reference).pipe(
          tap(res => window.open(res.sessionUrl, '_self')),
          catchError(() => {
            NotificationUtil.error("Failed to create payment session");
            return EMPTY;
          })
        )),
        finalize(() => {
          this.store.dispatch(clearCart());
          this.hideCart();
        })
      ))
    ).subscribe();
  }
}
