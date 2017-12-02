import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StartpageComponent } from './startpage/startpage.component';
import { PoliciesComponent } from './policies/policies.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { DashComponent } from './dash/dash.component';
import { PublicFeedComponent } from './public-feed/public-feed.component';
import { CollectionViewComponent } from './collection-view/collection-view.component';
import { NasaSearchComponent } from './nasa-search/nasa-search.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashComponent } from './admin-dash/admin-dash.component';
import { AdminLogsComponent } from './admin-logs/admin-logs.component';



const routes = [
  { path: 'startpage', component: StartpageComponent },
  { path: 'policies', component: PoliciesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dash', component: DashComponent },
  { path: 'public-feed', component: PublicFeedComponent },
  { path: 'collection/:collectionId', component: CollectionViewComponent },
  { path: 'nasa-search', component: NasaSearchComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'admin-dash', component: AdminDashComponent },
  { path: 'admin-logs', component: AdminLogsComponent },
  { path: '', redirectTo: '/startpage', pathMatch: 'full' },
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
