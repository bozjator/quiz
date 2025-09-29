import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppHttpService } from './app-http.service';
import { CurrentPassword, User, UserUpdate } from '../../../auth/models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class UserApiService extends AppHttpService {
  constructor() {
    super('user');
  }

  public getUser(): Observable<User> {
    return this.http.get<User>(this.url('me'));
  }

  public updateUser(data: UserUpdate): Observable<number> {
    return this.http.put<number>(this.url('me'), data);
  }

  public deleteAccount(data: CurrentPassword): Observable<number> {
    return this.http.delete<number>(this.url('delete-me'), { body: data });
  }
}
