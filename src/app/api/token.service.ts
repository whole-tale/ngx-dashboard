// src/app/framework/http/token.service.ts

import { Injectable } from '@angular/core';
import { User } from '@api/models/user';
import { UserService } from '@api/services/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LogService } from '@shared/core/log.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  // JWT helper service for checking token expiration
  jwt: JwtHelperService = new JwtHelperService();

  returnRoute: string;

  // Cache the user that this token represents (for display)
  user: BehaviorSubject<User> = new BehaviorSubject<User>(undefined);
  currentUser: Observable<User> = this.user.asObservable();

  constructor(private readonly userService: UserService, private readonly logger: LogService) {}

  setUser(user: User): void {
    this.user.next(user);
  }
  getUser(): Observable<User> {
    return this.currentUser;
  }
  setToken(token: string): void {
    this.logger.warn('Setting token:', token);
    localStorage.setItem('girderToken', token);
  }
  getToken(): string {
    return localStorage.getItem('girderToken');
  }
  clearToken(): void {
    localStorage.removeItem('girderToken');
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
        (user) => {
          this.logger.debug('Fetched user:', user);
          this.user = user;
        },
        (err) => {
          this.logger.error(`Failed to fetch the currently logged-in user`);
        }
      );
    }

    // return a boolean reflecting
    // whether or not the token is expired
    return !isExpired;
  }
}
