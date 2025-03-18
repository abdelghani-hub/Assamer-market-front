import {Component, OnInit} from "@angular/core";
import {RouterModule} from "@angular/router";
import {HeaderComponent} from '../../components/header/header.component';
import {FooterComponent} from '../../components/footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterModule, HeaderComponent, FooterComponent
  ],
  templateUrl: './landing.component.html',
})
export class LandingComponent implements OnInit {
  ngOnInit(): void {
  }
}
