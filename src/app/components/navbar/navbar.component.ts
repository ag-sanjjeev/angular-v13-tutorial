import { Component, OnInit } from '@angular/core';
import { CookieService } from 'src/app/shared/cookie.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public baseDBUrl: string = environment.baseDBUrl;
  
  isLogined: boolean;
  
  constructor(public cookie: CookieService, public router: Router, public http: HttpClient) { 

    this.isLogined = false;

    var authtoken: string = this.cookie.getCookie('authtoken');
    this.http.get(`${this.baseDBUrl}/users?authtoken=${authtoken}`).pipe().subscribe( (res: any) => {      
      
      if (res.length > 0) {        
        this.isLogined = true;
        environment.isLogined = true;
      } else {
        this.isLogined = false;   
        environment.isLogined = false;     
      }

    });

  }

  ngOnInit(): void {
  }

  logout() {
    
    alert('Logout succesfully');
    this.cookie.deleteCookie('authtoken');
    this.router.navigate(['login']);

  }

}
