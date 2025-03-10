import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FooterComponent} from "../../../components/footer/footer.component";
import {HeaderComponent} from "../../../components/header/header.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-dashboard-main',
  standalone: true,
  imports: [CommonModule, FooterComponent, HeaderComponent, RouterOutlet],
  templateUrl: './main.component.html'
})
export class MainComponent {

}
