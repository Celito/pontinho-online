import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragStart, CdkDropList } from '@angular/cdk/drag-drop';
import { Card } from 'src/app/interfaces/Card';
import { MatchService } from 'src/app/services/match/match.service';
import { TweenLite } from 'gsap';
import { GameState, Player } from 'shared-types/types';

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
  userPlayer: Player;
  pile: Card[] = [];
  discard = [];
  draggedCardNumber: number = 0;
  draggedCard: Card;

  playersOnTheRight: Player[] = []
  playersOnTheTop: Player[] = []
  playersOnTheLeft: Player[] = []

  playerHand: CdkDropList;
  @ViewChild('mainPile') mainPile: CdkDropList;
  @ViewChild('discardPile') discardPile: CdkDropList;

  constructor(
    private matchService: MatchService
  ) { }

  ngOnInit() {
    this.matchService.gameState$.subscribe(
      gs => {
        if (gs) {
          this.updateGameState(gs);
        }
      }
    );
  }

  setPlayerHand(playerHand: CdkDropList) {
    this.playerHand = playerHand
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
    const handElement = this.playerHand.element.nativeElement.children[0];
    const lastHandCard = handElement.children[handElement.childElementCount - 1];
    const topCardBounds = topCardElement.getBoundingClientRect();
    const lastHandCardBounds = lastHandCard.getBoundingClientRect();
    const deltaX = lastHandCardBounds.x - topCardBounds.x;
    const deltaY = lastHandCardBounds.y - topCardBounds.y;

    TweenLite.to(topCardElement, 1, { x: deltaX, y: deltaY });

    setTimeout(() => {
      event.previousIndex = (event.previousContainer.data.length - 1) - event.previousIndex;

      transferArrayItem(event.previousContainer.data, this.playerHand.data, event.previousIndex,
        this.playerHand.data.length);

      setTimeout(() => {
        this.playerHand.data[this.playerHand.data.length - 1].id = this.draggedCardNumber;
        this.draggedCardNumber = 0;
      }, 100);

    }, 1000);
  }

  dropToPlayerHand(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.userPlayer?.cards || [], event.previousIndex, event.currentIndex);
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
    this.pile = gameState.mainPile.cards.map(c => ({ id: c }));
    this.gameState = gameState;

    const otherPlayers = []

    for (let index = 0; index < gameState.players.length; index++) {
      const player = gameState.players[index]
      if (player._id === this.matchService.userId) {
        this.userPlayer = player;
        if (gameState.players.length > 1) {
          otherPlayers.push(...gameState.players.slice(index + 1))
          otherPlayers.push(...gameState.players.slice(0, index))
          const distribution = playersDistributionConfig[otherPlayers.length - 1]
          this.playersOnTheRight = otherPlayers.splice(0, distribution[0])
          this.playersOnTheTop = otherPlayers.splice(0, distribution[1])
          this.playersOnTheLeft = otherPlayers.splice(0, distribution[2])
        }
      }
    }
  }

}
