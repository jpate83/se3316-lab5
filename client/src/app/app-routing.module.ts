import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StartpageComponent } from './startpage/startpage.component';


const routes = [
  { path: 'startpage', component: StartpageComponent },
  { path: '', redirectTo: '/startpage', pathMatch: 'full' },
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
