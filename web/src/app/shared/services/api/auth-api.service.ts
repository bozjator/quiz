import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppHttpService } from './app-http.service';
import {
  ChangePassword,
  LoginCredentials,
  LoginResponse,
  RegisterUser,
  ResetPassword,
} from '../../../auth/models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService extends AppHttpService {
  constructor() {
    super('auth');
  }

  public login(loginCredentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.url('login'), loginCredentials);
  }

  public logout(): Observable<any> {
    return this.http.post<any>(this.url('logout'), null);
  }

  public logoutEverywhere(): Observable<any> {
    return this.http.post<any>(this.url('logout-everywhere'), null);
  }

  public register(data: RegisterUser): Observable<any> {
    return this.http.post<any>(this.url('register'), data);
  }

  public checkPassword(currentPassword: string): Observable<boolean> {
    return this.http.post<boolean>(this.url('check-password'), {
      currentPassword,
    });
  }

  public changePassword(data: ChangePassword): Observable<number> {
    return this.http.put<number>(this.url('change-password'), data);
  }

  public startPasswordReset(email: string): Observable<void> {
    return this.http.post<void>(this.url('start-reset-password'), { email });
  }

  public passwordReset(data: ResetPassword): Observable<void> {
    return this.http.put<void>(this.url('reset-password'), data);
  }
}
