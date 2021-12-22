import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/model/user-model.model';
import { ApiService } from 'src/app/shared/api.service';
import { IpaddressService } from 'src/app/shared/ipaddress.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public signupForm !: FormGroup;
  public userModelObj: UserModel = new UserModel();
  
  public ipaddress: string = '';
  public baseDBUrl: string = environment.baseDBUrl;

  constructor(private formBuilder: FormBuilder, public http: HttpClient, private router: Router, public apiservice: ApiService, public ipaddressservice: IpaddressService) { }

  ngOnInit(): void {

    this.signupForm = this.formBuilder.group({
      fullname: [''],
      email: [''],
      password: [''],
      confirmpassword: [''],
      agreeterms: ['']
    });

    this.ipaddress = this.ipaddressservice.getIPAddress();

  }

  onRegister() {
    
    var user = this.signupForm.value.email;
    var totaluser:number = 0;
    var req = '';
    var ipaddress: string = '';

    ipaddress = this.ipaddressservice.getIPAddress();

    this.http.get(`${this.baseDBUrl}/users?email=${this.signupForm.value.email}`).pipe().subscribe( (res:any) => {
      
      if (res.length > 0) {
        alert('Email ID already exist');
        console.log('Email ID already exist');
      } else {

        if (this.signupForm.value.password !== this.signupForm.value.confirmpassword) {
      
          alert('Password doesn\'t match with confirm password');
          console.log('Password doesn\'t match with confirm password');
          
        } else if (this.signupForm.value.agreeterms != true || this.signupForm.value.agreeterms == "") {

          alert('Please agree terms to register account');
          console.log('Please agree terms to register account');

        } else {

          const token: any = [... crypto.getRandomValues(new Uint8Array(20))].map(m => ('0'+m.toString(16)).slice(-2)).join('');
                            
          this.userModelObj.fullname = this.signupForm.value.fullname;
          this.userModelObj.email = this.signupForm.value.email;
          this.userModelObj.password = this.signupForm.value.password;
          this.userModelObj.agreeterms = this.signupForm.value.agreeterms;
          this.userModelObj.authtoken = token;
          this.userModelObj.ipaddress = ipaddress;
          this.userModelObj.activestatus = true;
          this.userModelObj.created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');;
          this.userModelObj.modified_at = new Date().toISOString().slice(0, 19).replace('T', ' ');;
      
          this.http.post(`${this.baseDBUrl}/users`, this.userModelObj).pipe().subscribe( (res) => {
            console.log(res);
            console.log('Account registration complete');
            alert('Account registration complete');
            this.signupForm.reset();
            this.router.navigate(['login']);
          } );


        }

      }

    } );

    /*
    if (user == undefined || user == null) { // user email doesn't exist and proceed

      if (this.signupForm.value.password !== this.signupForm.value.confirmpassword) {
      
          alert('Password doesn\'t match with confirm password');
          
      } else if (this.signupForm.value.agreeterms != true || this.signupForm.value.agreeterms == "") {

          alert('Please agree terms to register account');

      } else {

          const token: any = [... crypto.getRandomValues(new Uint8Array(20))].map(m => ('0'+m.toString(16)).slice(-2)).join('');
                            
          this.userModelObj.fullname = this.signupForm.value.fullname;
          this.userModelObj.email = this.signupForm.value.email;
          this.userModelObj.password = this.signupForm.value.password;
          this.userModelObj.agreeterms = this.signupForm.value.agreeterms;
          this.userModelObj.authtoken = token;
          this.userModelObj.ipaddress = ipaddress;
          this.userModelObj.activestatus = true;
          this.userModelObj.created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');;
          this.userModelObj.modified_at = new Date().toISOString().slice(0, 19).replace('T', ' ');;
      
      
          // this.apiservice.registerUser(this.userModelObj).subscribe((res:any) => {
          //     console.log(res);
          //     alert("Account created successfully");
          //     this.signupForm.reset();
          // });

          this.http.post(`${this.baseDBUrl}/users/register`, this.userModelObj).pipe().subscribe( (res) => {
            console.log(res);
            alert('Account created');

          } );


      }

    } else {
        alert('User already exists');
    }

    */
         

  }

}
