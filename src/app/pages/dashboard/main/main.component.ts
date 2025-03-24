import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FooterComponent} from "../../../components/footer/footer.component";
import {HeaderComponent} from "../../../components/header/header.component";
import {RouterOutlet} from "@angular/router";
import {AsideComponent} from "../../../components/aside/aside.component";

@Component({
  selector: 'app-dashboard-main',
  standalone: true,
    imports: [CommonModule, FooterComponent, HeaderComponent, RouterOutlet, AsideComponent],
  templateUrl: './main.component.html'
})
export class MainComponent {

}
