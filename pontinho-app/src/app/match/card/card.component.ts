import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, transition, animate, style } from '@angular/animations';

@Component({
  selector: '[appCard]',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  animations: [
    trigger('flipState', [
      state('down', style({
        transform: 'rotateY(179deg)'
      })),
      state('up', style({
        transform: 'rotateY(0)'
      })),
      transition('down => up', animate('500ms ease-out')),
      transition('up => down', animate('500ms ease-in'))
    ])
  ]
})
export class CardComponent implements OnInit {

  @Input() value: string;

  @Input() flip: string = 'up';

  constructor() { }

  ngOnInit() {

  }

  toggleFlip() {
    this.flip = (this.flip == 'up') ? 'down' : 'up';
  }

}
