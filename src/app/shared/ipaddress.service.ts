import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IpaddressService {
  ipaddress: string = '';
  
  constructor(public http: HttpClient) { }

  public getIPAddress() {
    this.http.get("http://api.ipify.org/?format=json").subscribe((res:any) => {
      this.ipaddress = res.ip;
    });

    return this.ipaddress;
  }
}
