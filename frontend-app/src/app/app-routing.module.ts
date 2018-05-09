import { ProjectManagementComponent } from './project-management/project-management.component';
import { AuthGuardService } from './services/auth-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProtectedComponent } from './protected/protected.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { CallApiComponent } from './call-api/call-api.component';
import { ProjectsOverviewComponent } from './projects-overview/projects-overview.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/projects-overview',
    pathMatch: 'full'
  },
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'auth-callback',
    component: AuthCallbackComponent
  },
  {
    path: 'call-api',
    component: CallApiComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'projects-overview',
    component: ProjectsOverviewComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'project/:id',
    component: ProjectManagementComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
