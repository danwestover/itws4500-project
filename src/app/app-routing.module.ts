import { NgModule } from '@angular/core';
import { PreloadAllModules, Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { SplashPageComponent } from './pages/splash-page/splash-page.component';
import { EventsPageComponent } from './pages/events-page/events-page.component';
import { DiscussionPageComponent } from './pages/discussion-page/discussion-page.component';
import { LoginComponent } from './modals/login/login.component';
import { RegisterComponent } from './modals/register/register.component';

const routes: Routes = [
  { path: '', component: SplashPageComponent },
  { path: 'events', component: EventsPageComponent },
  { path: 'discussion/:id', component: DiscussionPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent},
  { path: '**', component: PageNotFoundComponent }
];



@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    CommonModule
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
