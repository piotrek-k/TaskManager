import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.completeAuthentication();
  }

}
