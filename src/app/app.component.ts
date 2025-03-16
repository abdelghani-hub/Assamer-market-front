import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {initFlowbite} from "flowbite";
import {Store} from '@ngrx/store';
import {loadCart} from './store/cart/cart.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'assamer-market';
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  ngOnInit() {
    initFlowbite();
    this.store.dispatch(loadCart());
  }
}
