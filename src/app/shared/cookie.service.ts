import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor() { }

  public getCookie(name: string) {

    var cookie: Array<string> = document.cookie.split(';');
    var cookieLength: number = cookie.length;
    var cookieName: string = `${name}=`;
    var cookiecontent: string = '';

    for (let i: number = 0; i < cookieLength; i += 1) {
      cookiecontent = cookie[i].replace(/^\s+/g, '');
      if (cookiecontent.indexOf(cookieName) == 0) {
          return cookiecontent.substring(cookieName.length, cookiecontent.length);
      }
    }
    return '';

  }

  public deleteCookie(name: string) {
    this.setCookie(name, '', -1);
  }

  public setCookie(name: string, value: string, expiry: number, path: string = '') {
    let d:Date = new Date();
    d.setTime(d.getTime() + expiry * 24 * 60 * 60 * 1000);
    let expires:string = `expires=${d.toUTCString()}`;
    let cookiepath:string = path ? `; path=${path}` : '';
    document.cookie = `${name}=${value}; ${expires}${cookiepath}`;
  }
}
