import { NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes, ParamMap, ActivatedRoute } from '@angular/router';

/* pages component imports */
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { PurchaseComponent } from './pages/purchase/purchase.component';
import { SalesComponent } from './pages/sales/sales.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';


const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full',
    data : {
      title: 'Login'
    }
  },
  {
    path: 'home', component: HomeComponent,
    data : {
      title: 'Home'
    }
  },
  {
    path: 'login', component: LoginComponent,
    data : {
      title: 'Login'
    }
  },
  {
    path: 'register', component: RegisterComponent,
    data : {
      title: 'Registration'
    }
  },
  {
    path: 'products', component: ProductsComponent,
    data : {
      title: 'Products'
    }
  },
  {
    path: 'purchase', component: PurchaseComponent,
    data : {
      title: 'Purchase'
    }
  },
  {
    path: 'sales', component: SalesComponent,
    data : {
      title: 'Sales'
    }
  },
  {
    path: '**', component: PageNotFoundComponent,
    data : {
      title: 'Page Not Found'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  constructor (private route: ActivatedRoute) {

  }

  ngOnInit () {

  }

}
