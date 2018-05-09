import { Injectable } from '@angular/core';
import { UserManager, UserManagerSettings, User, WebStorageStateStore } from 'oidc-client';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

  private manager = new UserManager(getClientSettings());
  private user: User = null;

  constructor() {
    this.manager.getUser().then(user => {
      this.user = user;
    });

    this.manager.events.addSilentRenewError(function () {
      console.error("Problem with silent token renewal");
    });
  }

  /**
   * Returns information about user info availability
   * 
   * @returns {boolean} 
   * @memberof AuthService
   */
  isLoggedIn(): boolean {
    if (this.user != null) {
      console.log("Session expired: " + (this.user.expires_at > Date.now()));
    }
    return this.user != null && !this.user.expired;
  }

  /**
   * Recommended way to check if user is logged in.
   * Sometimes isLoggiedIn() is called before client load user info from storage
   * Return Observable so it will all happen in correct order.
   * 
   * @returns {Observable<boolean>} 
   * @memberof AuthService
   */
  isLoggedInObs(): Observable<boolean> {
    return Observable.fromPromise(this.manager.getUser()).map<User, boolean>((user) => {
      if (user) {
        return true;
      } else {
        return false;
      }
    });
  }

  getClaims(): any {
    return this.user.profile;
  }

  getAuthorizationHeaderValue(): string {
    return `${this.user.token_type} ${this.user.access_token}`;
  }

  startAuthentication(): Promise<void> {
    return this.manager.signinRedirect();
  }

  completeAuthentication(): Promise<void> {
    return this.manager.signinRedirectCallback().then(user => {
      this.user = user;
    });
  }

}

export function getClientSettings(): UserManagerSettings {
  return {
    authority: 'http://localhost:5000/',
    client_id: 'js',
    redirect_uri: 'http://localhost:4200/auth-callback',
    post_logout_redirect_uri: 'http://localhost:4200/',
    response_type: "id_token token",
    scope: "openid profile api1",
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: 'http://localhost:4200/assets/silent-refresh.html'
  };
}