import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ApiService {  

  public baseDBUrl: string = environment.baseDBUrl;

  constructor(private http: HttpClient) { }

  /****************************
   * User related api service *
   ****************************/

  getNewId() {
    var uid: any;
    return this.http.post(`${this.baseDBUrl}/users/`, '').pipe().subscribe();      
  }

  // isUserExist(key: string, value: any) {    
  //   return this.http.post(`${this.baseDBUrl}/users/checkcount`,{key: key, value: value}).pipe().subscribe();
  // }

  registerUser(data: any) {

    var usercount: any = 0;
    


    return this.http.post('http://localhost:3000/users', data).pipe(map((res:any) => {
      return res;      
    }));    
  }  

}
