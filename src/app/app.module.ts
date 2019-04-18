import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from './app-routing.module';
import { FooterComponent } from './footer/footer.component';
import { SplashPageComponent } from './pages/splash-page/splash-page.component';
import { EventsPageComponent } from './pages/events-page/events-page.component';
import { DiscussionPageComponent } from './pages/discussion-page/discussion-page.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

import { FilterPipe } from './filter.pipe';
import { RegisterComponent } from './modals/register/register.component';
import { LoginComponent } from './modals/login/login.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    SplashPageComponent,
    EventsPageComponent,
    DiscussionPageComponent,
    PageNotFoundComponent,
    FilterPipe,
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule { }
