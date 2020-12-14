import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragStart, CdkDropList } from '@angular/cdk/drag-drop';
import { Card } from 'src/app/interfaces/Card';
import { MatchService } from 'src/app/services/match/match.service';
import { GameState } from 'src/app/interfaces/GameState';
import { animate } from '@angular/animations';
import { TweenLite } from 'gsap';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  gameState: GameState;
  playerCards = [];
  pile: Card[] = [];
  discard = [];
  playerName = "Celito";
  draggedCardNumber: number = 0;
  draggedCard: Card;

  @ViewChild('playerHand') playeHand: CdkDropList;
  @ViewChild('mainPile') mainPile: CdkDropList;

  constructor(
    private matchService: MatchService
  ) { }

  ngOnInit() {
    this.matchService.getGameState().subscribe(gs => this.updateGameState(gs));
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

    const pileElement = this.mainPile.element.nativeElement;
    const topCardElement = pileElement.children[pileElement.childElementCount - 1];
    const handElement = this.playeHand.element.nativeElement.children[0];
    const lastHandCard = handElement.children[handElement.childElementCount - 1];
    const topCardBounds = topCardElement.getBoundingClientRect();
    const lastHandCardBounds = lastHandCard.getBoundingClientRect();
    const deltaX = lastHandCardBounds.x - topCardBounds.x;
    const deltaY = lastHandCardBounds.y - topCardBounds.y;

    TweenLite.to(topCardElement, 1, { x: deltaX, y: deltaY });

    setTimeout(() => {
      event.previousIndex = (event.previousContainer.data.length - 1) - event.previousIndex;

      transferArrayItem(event.previousContainer.data, this.playeHand.data, event.previousIndex,
        this.playeHand.data.length);

      setTimeout(() => {
        this.playeHand.data[this.playeHand.data.length - 1].id = this.draggedCardNumber;
        this.draggedCardNumber = 0;
      }, 100);

    }, 1000);
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

  updateGameState(gameState: GameState) {
    this.pile = gameState.mainPile.cards;
    this.gameState = gameState;

    for (const player of gameState.players) {
      if (player.name === this.matchService.userName) {
        this.playerCards = player.cards;
      }
    }
  }

}
