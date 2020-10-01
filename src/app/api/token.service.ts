// src/app/framework/http/token.service.ts

import { Injectable } from '@angular/core';
import { User } from '@api/models/user';
import { UserService } from '@api/services/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LogService } from '@framework/core/log.service';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class TokenService {
  // JWT helper service for checking token expiration
  jwt: JwtHelperService = new JwtHelperService();

  returnRoute: string;

  // Cache the user that this token represents (for display)
  user: ReplaySubject<User> = new ReplaySubject<User>();

  constructor(private readonly userService: UserService, private readonly logger: LogService) {}

  setToken(token: string): void {
    localStorage.setItem('girderToken', token);
  }
  getToken(): string {
    return localStorage.getItem('girderToken');
  }
  clearToken(): void {
    localStorage.removeItem('girderToken');
  }
  setReturnRoute(returnRoute: string) {
    localStorage.setItem('returnRoute', returnRoute);
  }
  getReturnRoute(): string {
    const route = localStorage.getItem('returnRoute');

    if (route) {
      return route;
    } else {
      return 'public';
    }
  }
  isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();

    if (!token) {
      return false;
    }

    // Other functions
    const expirationDate = this.jwt.getTokenExpirationDate(token);
    const isExpired = this.jwt.isTokenExpired(token);

    this.logger.debug(`Token expires: ${expirationDate}. Is Expired? ${isExpired}`);

    if (!isExpired) {
      this.logger.debug(`Token not yet expired - checking Girder for validity`);
      this.userService.userGetMe().subscribe(
        user => {
          this.logger.debug('Fetched user:', user);
          this.user = user;
        },
        err => {
          this.logger.error(`Failed to fetch the currently logged-in user`);
        }
      );
    }

    // return a boolean reflecting
    // whether or not the token is expired
    return !isExpired;
  }
}
