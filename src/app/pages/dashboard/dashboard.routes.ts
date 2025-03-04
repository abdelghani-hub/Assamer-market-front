import {Routes} from "@angular/router";
import { MainComponent } from "./main/main.component";
import {roleGuard} from "../../core/guards/role.guard";
import {StatisticsComponent} from "./statistics/statistics.component";

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMIN']
    },
    children: [
      {
        path: '',
        redirectTo: 'statistics',
        pathMatch: 'full'
      },
      {
        path: 'statistics',
        component: StatisticsComponent,
      },
    ]
  }
]
