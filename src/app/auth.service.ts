import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NumberValueAccessor } from '@angular/forms/src/directives';

export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;

  constructor(private http: HttpClient, private router: Router) { }

  private saveToken(token: string): void {
    localStorage.setItem('jwtoken', token);
    this.token = token;
  }

  public getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('jwtoken');
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now()/1000;
    } else {
      return false;
    }
  }

  // private request(method: 'post'|'get', type: 'login'|'register', user?: TokenPayload): Observable<any> {
  //   let base;

  //   if (method === 'post') {
  //     console.log(user.password);
      
  //     base = this.http.post(`http://localhost:3000/auth/${type}`, {data:{email: user.email, password:user.password}});
  //   } else {
  //     base = this.http.get(`http://localhost:3000/auth/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}`}}); 
  //   }

  //   const request = base.pipe(
  //     map((data: TokenResponse) => {
  //       if (data.token) {
  //         this.saveToken(data.token);
  //       }
  //       return data;
  //     })
  //   );
  //   return request;
  // }

  public register(user: TokenPayload): Observable<any> {
    let base = (this.http.post(`http://localhost:3000/auth/register?email=${user.email}&password=${user.password}&name=${user.name}`, {}));
    // return this.request('post', 'login', user);
    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
    return request;
    // return this.request('post', 'register', user);
  }

  public login(user: TokenPayload): Observable<any> {
    let base = (this.http.post(`http://localhost:3000/auth/login?email=${user.email}&password=${user.password}`, {}));
    // return this.request('post', 'login', user);
    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
    return request;
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('jwtoken');
    this.router.navigateByUrl('/');
  }
}
