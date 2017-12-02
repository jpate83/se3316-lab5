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

@NgModule({
  declarations: [
    AppComponent,
    StartpageComponent
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
