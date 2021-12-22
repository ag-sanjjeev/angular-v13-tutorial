import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() btnText: string;
  @Input() btnClass: string;
  @Input() btnType: string;
  @Input() btnTheme: string;

  @Output() onClick = new EventEmitter<any>();

  constructor() { 

    this.btnText = 'Click';
    this.btnClass = 'btn';
    this.btnType = 'button';
    this.btnTheme = 'primary';

  }

  ngOnInit(): void {
  }

  onButtonClick(event: any) {
    this.onClick.emit(event);    
  }

}
