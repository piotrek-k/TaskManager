import { HttpClient } from 'selenium-webdriver/http';
import { ProjectsService } from './api-handlers/Projects/projects.service';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ProtectedComponent } from './protected/protected.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { CallApiComponent } from './call-api/call-api.component';

import { HttpModule } from '@angular/http';
import { ProjectsOverviewComponent } from './projects-overview/projects-overview.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    ProtectedComponent,
    AuthCallbackComponent,
    CallApiComponent,
    ProjectsOverviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule
  ],
  providers: [
    AuthGuardService,
    AuthService,
    ProjectsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
