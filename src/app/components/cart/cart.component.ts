import {Component, EventEmitter, Output} from '@angular/core';
import {AsyncPipe, NgForOf} from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCartProducts, selectCartTotalPrice } from '../../store/cart/cart.selectors';
import { removeFromCart, clearCart } from '../../store/cart/cart.actions';

interface CartItem {
  productSlug: string;
  photo: string;
  price: number;
  quantity: number;
}

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

  constructor(private store: Store) {
    this.cartProducts$ = this.store.select(selectCartProducts);
    this.cartTotalPrice$ = this.store.select(selectCartTotalPrice);
  }

  removeFromCart(slug: string) {
    this.store.dispatch(removeFromCart({ productSlug: slug }));
  }

  hideCart(): void {
    this.closeCart.emit();
  }

  checkout() {
    // Implement checkout logic here
    this.store.dispatch(clearCart());
    // Additional checkout logic
  }
}
