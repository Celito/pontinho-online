import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragStart, CdkDropList } from '@angular/cdk/drag-drop';
import { Card } from 'src/app/interfaces/Card';
import { MatchService } from 'src/app/services/match/match.service';
import { GameState } from 'src/app/interfaces/GameState';
import { TweenLite } from 'gsap';

const playersDistributionConfig = [
  [0, 1, 0], [1, 0, 1], [1, 1, 1], [1, 2, 1], [2, 1, 2], [2, 2, 2], [2, 3, 2], [3, 2, 3], [3, 3, 3]
]

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
  playerName: string;
  draggedCardNumber: number = 0;
  draggedCard: Card;

  playersOnTheRight = []
  playersOnTheTop = []
  playersOnTheLeft = []

  @ViewChild('playerHand') playeHand: CdkDropList;
  @ViewChild('mainPile') mainPile: CdkDropList;

  constructor(
    private matchService: MatchService
  ) { }

  ngOnInit() {
    this.matchService.gameState$.subscribe(
      gs => {
        console.log('game state received in the table', gs)
        if (gs) {
          this.updateGameState(gs);
        }
      }
    );
  }

  drawFromMainPile(_event: CdkDragStart, _drawnCard: Card) {
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
    console.log(gameState)
    console.log(this.matchService.userName);
    this.playerName = this.matchService.userName;
    this.pile = gameState.mainPile.cards;
    this.gameState = gameState;

    const otherPlayers = []

    for (let index = 0; index < gameState.players.length; index++) {
      const player = gameState.players[index]
      if (player._id === this.matchService.userId) {
        this.playerCards = player.cards;
        if (gameState.players.length > 1) {
          otherPlayers.push(...gameState.players.slice(index + 1))
          otherPlayers.push(...gameState.players.slice(0, index))
          const distribution = playersDistributionConfig[otherPlayers.length - 1]
          this.playersOnTheRight = otherPlayers.splice(0, distribution[0]).map(p => p.name)
          this.playersOnTheTop = otherPlayers.splice(0, distribution[1]).map(p => p.name)
          this.playersOnTheLeft = otherPlayers.splice(0, distribution[2]).map(p => p.name)
        }
      }
    }
  }

}
