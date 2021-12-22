import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Purchase } from 'src/app/model/purchase.model';
import { Products } from 'src/app/model/products.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'src/app/shared/cookie.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {

  public purchaseForm !: FormGroup;
  public purchaseFormObj: Purchase = new Purchase();

  public baseDBUrl: any = environment.baseDBUrl;

  public showMainUpdate: boolean = false;
  public showMainSave: boolean = true;
  public showSubUpdate: boolean = false;
  public showSubAdd: boolean = true;

  public billno: string = '';
  public productlist: Array<any> = [];
  public products: Array<Products> = [];

  public currentDate: string = new Date().toISOString().substring(0, 10);
  public productid: string = ''; // sublist product id store until added

  constructor(public router: Router, public http: HttpClient, public formBuilder: FormBuilder, public cookie: CookieService) { }

  ngOnInit(): void {

    this.checkAuthToken();

    // this.http.get(`${this.baseDBUrl}/purchase?savestatus=false`).pipe().subscribe( (res: any) => {
      
    //   if (res.length == 0)

    //   res.slice().reverse();

    // });

    this.generateBillNo('PUR-');

    this.listofproducts();

    this.purchaseForm = this.formBuilder.group({
      billno: ['', Validators.required],
      purchasedate: ['', Validators.required],
      suppliername: ['', Validators.required],
      productname: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      amount: ['', Validators.required],
      modeofpay: ['cash', Validators.required],
      totalamount: ['', Validators.required],
      taxpercent: ['', Validators.required],
      taxamount: ['', Validators.required],
      grossamount: ['', Validators.required],
      roundoff: ['', Validators.required],
      netamount: ['', Validators.required]
    });

    setTimeout(() => {
      this.purchaseForm.controls['billno'].setValue(this.billno);
    }, 1000);

    setTimeout(() => {
      this.sublistProducts(this.billno);
    }, 1500);

    this.purchaseForm.controls['billno'].setValue(this.billno);

    this.purchaseForm.controls['purchasedate'].setValue(this.currentDate);



    // onchange event for formcontrol
    this.purchaseForm.get('productname')?.valueChanges.subscribe( (res: any) => {
      console.log(res);
    });

    
    this.purchaseForm.get('price')?.valueChanges.subscribe( (res:any) => {
      var price = this.purchaseForm.controls['price'].value;
      var quantity = this.purchaseForm.controls['quantity'].value;

      this.productItemAmountCalc(price, quantity);
    });

    this.purchaseForm.get('quantity')?.valueChanges.subscribe( (res: any) => {
      var price = this.purchaseForm.controls['price'].value;
      var quantity = this.purchaseForm.controls['quantity'].value;

      this.productItemAmountCalc(price, quantity);
    });

  }

  generateBillNo(prefix: string = '', suffix: string = '') {
    this.http.get(`${this.baseDBUrl}/purchase`).pipe().subscribe((res: any) => {
      this.billno = prefix + (res.length + 1).toString().padStart(4, '0') + suffix;
    });
  }

  listofproducts() {    
    this.http.get(`${this.baseDBUrl}/products`).pipe().subscribe((res: any) => {
      this.products = res;
    });
  }


  sublistProducts(billno: string = '') {
    var requesturl = this.baseDBUrl + '/purchase' + ( (billno == '') ? '' : '?billno=' + billno.toUpperCase() );
    this.http.get(requesturl).pipe().subscribe( (res: any) => {
      
      // if ("products" in res) {
        // this.productlist = res.products;
        console.log(res[0].products[0]);

        try {
          this.productlist = res[0].products;
        } catch (e) {
          this.productlist = [];
          console.log(e);
        }

      // }          
    });
  }

  onProductSelect(event: any) {
    const el = event.target;

    var id = el.options[el.selectedIndex].getAttribute('data-id');
    var price = el.options[el.selectedIndex].getAttribute('data-price');

    this.productid = id;

    this.purchaseForm.controls['price'].setValue(price);

  }
  
  productItemAmountCalc(price: number, quantity: number ) {
    var amount = 0;
    amount = price * quantity;

    this.purchaseForm.controls['amount'].setValue(amount);
  }

  addProducts() {

    this.generateBillNo('PUR-');
    this.listofproducts();
    this.sublistProducts(this.billno);

    var purchasedate: string = this.purchaseForm.controls['purchasedate'].value;
    var suppliername: string = this.purchaseForm.controls['suppliername'].value;

    var productname: string = this.purchaseForm.controls['productname'].value;
    var price: number = this.purchaseForm.controls['price'].value;
    var quantity: number = this.purchaseForm.controls['quantity'].value; 
    var amount: number = this.purchaseForm.controls['amount'].value;

    var previousProducts: any = [];
    var currentProducts: any = [];
    var products: any = [];

    if (isNaN(Date.parse(purchasedate))) {
      alert('Please enter valid date');
    } else if (suppliername == '' || suppliername == undefined || suppliername == null ) {
      alert('Please enter supplier name');      
    } else if (productname == '' || productname == undefined || productname == null) {
      alert('Please select product');
    } else if (price == 0 || price == undefined || price == null) {
      alert('Price doesn\'t empty');
    } else if (quantity == 0 || quantity == undefined || quantity == null) {
      alert('Quantity doesn\'t empty');
    } else {

      if (this.productlist.length == 0) {
        previousProducts = [];        
        console.log(1);        
      } else {
        previousProducts = this.productlist;
        console.log(2);
      }

      products = previousProducts;
      
      currentProducts = [
        {
          productid: this.productid,
          productname: productname,
          price: price,
          quantity: quantity,
          amount: amount
        }
      ];

      products = products.concat(currentProducts);

      this.purchaseFormObj.billno = this.billno;
      this.purchaseFormObj.purchasedate = purchasedate;
      this.purchaseFormObj.suppliername = suppliername;
      this.purchaseFormObj.products = products;
      this.purchaseFormObj.modeofpay = this.purchaseForm.controls['modeofpay'].value;
      this.purchaseFormObj.totalamount = this.purchaseForm.controls['totalamount'].value;
      this.purchaseFormObj.taxpercent = this.purchaseForm.controls['taxpercent'].value;
      this.purchaseFormObj.taxamount = this.purchaseForm.controls['taxamount'].value;
      this.purchaseFormObj.grossamount = this.purchaseForm.controls['grossamount'].value;
      this.purchaseFormObj.roundoff = this.purchaseForm.controls['roundoff'].value;
      this.purchaseFormObj.netamount = this.purchaseForm.controls['netamount'].value;
      this.purchaseFormObj.savestatus = false;

      console.log(this.billno);

      // decide where insert or update
      this.http.get(`${this.baseDBUrl}/purchase?billno=${this.billno}`).pipe().subscribe( (res: any) => {
        if (res.length > 0) {          
          this.http.patch(`${this.baseDBUrl}/purchase/${res[0].id}`, this.purchaseFormObj).pipe().subscribe( (res: any) => {
            
            this.purchaseForm.controls['productname'].setValue('');
            this.purchaseForm.controls['price'].setValue('');
            this.purchaseForm.controls['quantity'].setValue('');
            this.purchaseForm.controls['amount'].setValue('');

            try {
              if (res.billno == undefined || res.billno == null || res.billno == "") {                
                this.sublistProducts(res[0].billno);
              } else {
                this.sublistProducts(res.billno);
              }
            }  catch (e) {
              console.log(e);
            }                      
          });

        } else {
          this.http.post(`${this.baseDBUrl}/purchase`, this.purchaseFormObj).pipe().subscribe( (res: any) => {
            console.log(res);

            this.purchaseForm.controls['productname'].setValue('');
            this.purchaseForm.controls['price'].setValue('');
            this.purchaseForm.controls['quantity'].setValue('');
            this.purchaseForm.controls['amount'].setValue('');

            this.sublistProducts(this.billno);
          });
        }
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
