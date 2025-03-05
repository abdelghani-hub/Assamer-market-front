import {Component, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';
import User from '../../types/User';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  ngOnInit(): void {

  }

  get user(): User | null {
    return this.authService.user;
  }
}
