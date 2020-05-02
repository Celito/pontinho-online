import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragStart, CdkDropList } from '@angular/cdk/drag-drop';
import { Card } from 'src/app/interfaces/Card';
import { MatchService } from 'src/app/services/match.service';
import { GameState } from 'src/app/interfaces/GameState';
import { animate } from '@angular/animations';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  gameState: GameState;
  playerCards = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
  pile: Card[] = [];
  discard = [];
  playerName = "Celito";
  draggedCardNumber: number = 0;
  draggedCard: Card;

  @ViewChild('playerHand') playeHand: CdkDropList;

  constructor(private matchService: MatchService) { }

  ngOnInit() {
    this.matchService.getGameState().subscribe(gameState => {
      this.pile = gameState.mainPile.cards;
      this.gameState = gameState;
    });
  }

  drawFromMainPile(event: CdkDragStart, drawnCard: Card) {
    this.matchService.drawFromMainPile().subscribe(card => {
      if (this.draggedCard) {
        this.draggedCard.id = card.id;
        this.draggedCard = undefined;
      } else {
        this.draggedCardNumber = card.id;
      }
    });
  }

  dropBackToMainPile(event: CdkDragDrop<Card[]>) {
    event.previousIndex = (event.previousContainer.data.length - 1) - event.previousIndex;
    transferArrayItem(event.previousContainer.data, this.playeHand.data, event.previousIndex,
      this.playeHand.data.length);

    setTimeout(() => {
      this.playeHand.data[this.playeHand.data.length - 1].id = this.draggedCardNumber;
      this.draggedCardNumber = 0;
    }, 100);
  }

  dropToPlayerHand(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.playerCards, event.previousIndex, event.currentIndex);
    } else {
      if (event.previousContainer.id === 'discardPile' || event.previousContainer.id === 'mainPile') {
        event.previousIndex = (event.previousContainer.data.length - 1) - event.previousIndex;
      }
      transferArrayItem(event.previousContainer.data, event.container.data,
        event.previousIndex, event.currentIndex);
      if (event.previousContainer.id === 'mainPile') {
        if (this.draggedCardNumber) {
          setTimeout(() => {
            event.container.data[event.currentIndex].id = this.draggedCardNumber;
            this.draggedCardNumber = 0;
          }, 100);
        } else {
          this.draggedCard = event.container.data[event.currentIndex];
        }
      }
    }
  }

  dropToDiscard(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(event.previousContainer.data, event.container.data,
        event.previousIndex, event.container.data.length)
    }
  }

}
