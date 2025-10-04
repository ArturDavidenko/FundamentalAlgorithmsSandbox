import { Routes } from '@angular/router';
import { Taks1 } from './taskPages/taks1/taks1';
import { Taks2 } from './taskPages/taks2/taks2';
import { LayoutComponent } from './taskPages/layout.component/layout.component';

export const routes: Routes = [
    { path: 'taks1', component: Taks1 },
    { path: 'taks2', component: Taks2 },
    { path: 'taks3', component: Taks1 },
    { path: 'taks4', component: Taks2 },
    { path: 'taks5', component: Taks1 },
    { path: 'taks6', component: Taks2 },
    { path: 'taks7', component: Taks1 },
    { path: 'taks8', component: Taks2 },
    { path: 'taks9', component: Taks1 },
    { path: 'layout', component: LayoutComponent },
    { path: '', redirectTo: 'layout', pathMatch: 'full' }
];
