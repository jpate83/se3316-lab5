import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { StartpageComponent } from './startpage/startpage.component';
import { AppRoutingModule } from './/app-routing.module';

import { CollectionsQuerierService } from './collections-querier.service';
import { AccountsService } from './accounts.service';
import { AdminService } from './admin.service';
import { NasaApiService } from './nasa-api.service';
import { UserActionsService } from './user-actions.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashComponent } from './dash/dash.component';
import { PublicFeedComponent } from './public-feed/public-feed.component';
import { NasaSearchComponent } from './nasa-search/nasa-search.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { PoliciesComponent } from './policies/policies.component';
import { CollectionViewComponent } from './collection-view/collection-view.component';
import { AdminDashComponent } from './admin-dash/admin-dash.component';
import { AdminLogsComponent } from './admin-logs/admin-logs.component';

@NgModule({
  declarations: [
    AppComponent,
    StartpageComponent,
    LoginComponent,
    RegisterComponent,
    DashComponent,
    PublicFeedComponent,
    NasaSearchComponent,
    AdminLoginComponent,
    PoliciesComponent,
    CollectionViewComponent,
    AdminDashComponent,
    AdminLogsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    AccountsService,
    AdminService,
    CollectionsQuerierService,
    NasaApiService,
    UserActionsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
