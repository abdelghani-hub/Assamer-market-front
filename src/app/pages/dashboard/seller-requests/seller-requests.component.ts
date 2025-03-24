import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SellerService} from '../../../core/services/seller.service';
import {NotificationUtil} from '../../../helpers/NotificationUtil';
import {NgxPaginationModule} from 'ngx-pagination';
import SellerRequest from '../../../types/SellerRequest';

@Component({
  selector: 'app-seller-requests',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  templateUrl: './seller-requests.component.html',
  styleUrls: ['./seller-requests.component.css']
})
export class SellerRequestsComponent implements OnInit {
  sellerRequests: SellerRequest[] = [];
  loading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private sellerService: SellerService,
  ) {}

  ngOnInit(): void {
    this.loadSellerRequests();
  }

  loadSellerRequests(): void {
    this.loading = true;
    this.sellerService.getAllSellerRequests().subscribe({
      next: (response) => {
        this.sellerRequests = response.data;
        this.loading = false;
      },
      error: (error: {message: string}) => {
        this.errorMessage = error.message || 'Failed to load seller requests';
        NotificationUtil.error(this.errorMessage, 'Error!');
        this.loading = false;
      }
    });
  }

  updateRequest(requestId: string, status: 'ACCEPTED' | 'REJECTED'): void {
    if (status === 'REJECTED' && !confirm('Are you sure you want to reject this request?')) {
      return;
    }

    this.loading = true;
    this.sellerService.updateSellerRequest(requestId, status).subscribe({
      next: (response) => {
        this.successMessage = status === 'ACCEPTED'
          ? 'Seller request accepted successfully.'
          : 'Seller request rejected successfully.';
        NotificationUtil.success(this.successMessage, 'Success!');
        this.loadSellerRequests();
      },
      error: (error: {message: string}) => {
        this.errorMessage = error.message || `Failed to ${status.toLowerCase()} seller request`;
        NotificationUtil.error(this.errorMessage, 'Error!');
        this.loading = false;
      }
    });
  }

  // Helper function to highlight pending rows
  isPending(status: string): boolean {
    return status === 'PENDING';
  }
}
