export class Purchase {
    id: number = 0;
    billno: string = '';
    purchasedate: string = '';
    suppliername: string = '';
    products: Array<any> = [];
    modeofpay: string = '';
    totalamount: number = 0;
    taxpercent: number = 0;
    taxamount: number = 0;
    grossamount: number = 0;
    roundoff: number = 0;
    netamount: number = 0;
    savestatus: boolean = false;
}
