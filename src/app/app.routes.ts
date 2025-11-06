import { Routes } from '@angular/router';
import { Taks1 } from './taskPages/taks1/taks1';
import { Taks2 } from './taskPages/taks2/taks2';
import { LayoutComponent } from './taskPages/layout.component/layout.component';
import { Taks3 } from './taskPages/taks3/taks3';
import { Taks4 } from './taskPages/taks4/taks4';
import { Taks5 } from './taskPages/taks5/taks5';
import { CraftingPage } from './taskPages/CraftingPage/crafting-page';

export const routes: Routes = [
    { path: 'taks1', component: Taks1 },
    { path: 'taks2', component: Taks2 },
    { path: 'taks3', component: Taks3 },
    { path: 'taks4', component: Taks4 },
    { path: 'taks5', component: Taks5 },
    { path: 'craftingPage', component: CraftingPage },
    { path: 'layout', component: LayoutComponent },
    { path: '', redirectTo: 'layout', pathMatch: 'full' }
];
