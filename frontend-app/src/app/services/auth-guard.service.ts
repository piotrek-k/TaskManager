import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService) { }

  // canActivate(): boolean {
  //   if (this.authService.isLoggedIn()) {
  //     return true;
  //   }

  //   this.authService.startAuthentication();
  //   return false;
  // }

  canActivate() {
    let isLoggedIn = this.authService.isLoggedInObs();
    isLoggedIn.subscribe((loggedin) => {
      if (!loggedin) {
        //this.router.navigate(['unauthorized']);
        this.authService.startAuthentication();
      }
    });
    return isLoggedIn;
  }

}
