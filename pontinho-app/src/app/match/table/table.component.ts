import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  playerCards = ['AC', '2C', '3C', '4C'];
  pile = ['KC', 'QC', 'JC', '10C', '9C', '8C', '7C', '6C', '5C'];
  discard = [];

  constructor() { }

  ngOnInit() {

  }

  dropToPlayerHand(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.playerCards, event.previousIndex, event.currentIndex);
    } else {
      if (event.previousContainer.id === 'discardPile' || event.previousContainer.id === 'mainPile') {
        event.previousIndex = (event.previousContainer.data.length - 1) - event.previousIndex;
      }
      transferArrayItem(event.previousContainer.data, event.container.data,
        event.previousIndex, event.currentIndex)
    }
  }

  dropToDiscard(event: CdkDragDrop<string[]>) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(event.previousContainer.data, event.container.data,
        event.previousIndex, event.container.data.length)
    }
  }

}
