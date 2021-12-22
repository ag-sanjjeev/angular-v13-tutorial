import { Component, OnInit } from '@angular/core';
import { CookieService } from 'src/app/shared/cookie.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public baseDBUrl: string = environment.baseDBUrl;

  constructor(public http: HttpClient, public router: Router, public cookie: CookieService) { }

  ngOnInit(): void {
    
    this.checkAuthToken();

  }

  logout() {
    
    alert('Logout succesfully');
    this.cookie.deleteCookie('authtoken');
    this.router.navigate(['login']);

  }

  checkAuthToken () {
    var authtoken: string = this.cookie.getCookie('authtoken');
    this.http.get(`${this.baseDBUrl}/users?authtoken=${authtoken}`).pipe().subscribe( (res: any) => {      
      
      if (res.length > 0) {        
        this.router.navigate(['home']);
      } else {
        this.router.navigate(['login']);
      }

    });
  }

}
