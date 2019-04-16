import { NgModule } from '@angular/core';
import { PreloadAllModules, Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { SplashPageComponent } from './pages/splash-page/splash-page.component';
import { EventsPageComponent } from './pages/events-page/events-page.component';
import { DiscussionPageComponent } from './pages/discussion-page/discussion-page.component';

const routes: Routes = [
  { path: '', component: SplashPageComponent },
  { path: 'events', component: EventsPageComponent },
  { path: 'discussion/:id', component: DiscussionPageComponent },
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
