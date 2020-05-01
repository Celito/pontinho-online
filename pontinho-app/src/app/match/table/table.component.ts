import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Card } from 'src/app/interfaces/Card';
import { MatchService } from 'src/app/services/match.service';
import { GameState } from 'src/app/interfaces/GameState';

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

  constructor(private matchService: MatchService) { }

  ngOnInit() {
    this.matchService.getGameState().subscribe(gameState => {
      this.pile = gameState.mainPile.cards;
      this.gameState = gameState;
    });
  }

  dropToPlayerHand(event: CdkDragDrop<Card[]>) {
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

  dropToDiscard(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(event.previousContainer.data, event.container.data,
        event.previousIndex, event.container.data.length)
    }
  }

}
