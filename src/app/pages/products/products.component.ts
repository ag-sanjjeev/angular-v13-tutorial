import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, RequiredValidator, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'src/app/shared/cookie.service';
import { environment } from 'src/environments/environment';
import { Products } from 'src/app/model/products.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  public productForm !: FormGroup;

  public baseDBUrl: string = environment.baseDBUrl;

  public productslist: any;

  public productModelObj: Products = new Products();

  public showAdd: boolean = true;
  public showUpdate: boolean = false;

  constructor(public formBuilder: FormBuilder, public http: HttpClient, public router: Router, public cookie: CookieService) { }  

  ngOnInit(): void {

    this.checkAuthToken();

    this.productForm = this.formBuilder.group({
      productname: ['', Validators.required],
      price: ['', Validators.required]
    });

    this.listProducts();

  }

  onAddForm() {
    this.productForm.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  listProducts() {
    this.http.get(`${this.baseDBUrl}/products`).pipe().subscribe( (res) => {
      this.productslist = res;
    });
  }

  onProductSave() {
    
    var productname = this.productForm.value.productname;
    var price = this.productForm.value.price;

    if (productname == "" || productname == undefined || productname == null || !isNaN(productname)) {
      alert('Please enter valid product name');
    } else if (price == "" || price == undefined || price == null || price == 0 || isNaN(price) ) {
      alert('Please enter valid price');
    } else {

      this.http.get(`${this.baseDBUrl}/products?productname=${productname}`).pipe().subscribe( (res: any) => {
        
        if (res.length > 0) {
          alert('Product name already exist. \n Please enter different one...');
        } else {
          this.http.post(`${this.baseDBUrl}/products`, this.productForm.value).pipe().subscribe( (res: any) => {
            console.log(res);
            this.listProducts();
            alert('Product has created');
            this.productForm.reset();
            
            let cancelModalBtn = document.getElementById('cancelModalBtn');
            cancelModalBtn?.click();

          }, (res: any) => {
            console.log(res);
            alert('Somethingwent wrong');
          });
        }

      });

    }

  }

  editProduct(data: any) {
    var product_id = data.id;
    var productname = data.productname;
    var price = data.price;

    this.productForm.controls['productname'].setValue(productname);
    this.productForm.controls['price'].setValue(price);
    this.productModelObj.id = product_id;
    this.productModelObj.productname = productname;
    this.productModelObj.price = price;

    this.showAdd = false;
    this.showUpdate = true;
  }

  onProductUpdate() {

    this.productModelObj.productname = this.productForm.value.productname;
    this.productModelObj.price = this.productForm.value.price;

    this.http.put(`${this.baseDBUrl}/products/${this.productModelObj.id}`, this.productModelObj).pipe().subscribe( (res: any) => {
      console.log(res);
      alert('Product details updated');
      this.productForm.reset();    
      let cancelModalBtn = document.getElementById('cancelModalBtn');
      cancelModalBtn?.click();  
      this.listProducts();
      this.showAdd =true;
      this.showUpdate = false;      
    });

  }

  onProductDelete(id: any) {
    if (confirm('Are you sure want delete ?') ) {
      this.http.delete(`${this.baseDBUrl}/products/${id}`).pipe().subscribe( (res: any) => {
        console.log(res);
        alert('Product has deleted'); 
        this.listProducts();
      });
    }
  }

  checkAuthToken () {
    var authtoken: string = this.cookie.getCookie('authtoken');
    this.http.get(`${this.baseDBUrl}/users?authtoken=${authtoken}`).pipe().subscribe( (res: any) => {      
      
      if (res.length > 0) {        
        console.log('logined');
      } else {
        this.router.navigate(['login']);
      }

    });
  }

}
