import { BsModalService, ModalModule, ModalBackdropComponent } from 'ngx-bootstrap/modal';
import { ColumnsService } from './api-handlers/Columns/columns.service';
import { TodoTasksService } from './api-handlers/TodoTasks/todo-tasks.service';
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
import { LinksService } from './api-handlers/Links/links.service';
import { ProjectManagementComponent } from './project-management/project-management.component';
import { LongTermGoalsService } from './api-handlers/LongTermGoals/long-term-goals.service';
import { FormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';
import { MarkdownModule } from 'ngx-markdown';

//bootstrap
import { CollapseModule, BsDropdownModule } from 'ngx-bootstrap';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { LtgDetailsComponent } from './ltg-details/ltg-details.component';


@NgModule({
  declarations: [
    AppComponent,
    ProtectedComponent,
    AuthCallbackComponent,
    CallApiComponent,
    ProjectsOverviewComponent,
    ProjectManagementComponent,
    TaskDetailsComponent,
    LtgDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    DragulaModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    MarkdownModule.forRoot()
  ],
  entryComponents: [
    TaskDetailsComponent
  ],
  providers: [
    AuthService,
    AuthGuardService,
    ProjectsService,
    LinksService,
    TodoTasksService,
    LongTermGoalsService,
    ColumnsService,
    BsModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
