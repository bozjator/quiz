import { Injectable } from '@angular/core';
import { APP_STORAGE_NAMES } from '../shared/models/other/app-storage-name.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  getAccessToken(): string {
    return window.localStorage.getItem(APP_STORAGE_NAMES.accessToken) || '';
  }

  setAccessToken(token: string): void {
    window.localStorage.setItem(APP_STORAGE_NAMES.accessToken, token);
  }

  removeAccessToken(): void {
    window.localStorage.removeItem(APP_STORAGE_NAMES.accessToken);
  }

  logout(): void {
    this.removeAccessToken();
    window.localStorage.clear();
  }

  decodeToken(token: string) {
    // Split the token into its parts.
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) throw new Error('Invalid access token!');

    // Decode the payload part (second part).
    const payloadBase64 = tokenParts[1];
    const payloadJson = atob(payloadBase64);

    return JSON.parse(payloadJson);
  }

  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);

    // If token does not have expiration set, we assume that is not expirable.
    if (!payload?.exp) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }
}
