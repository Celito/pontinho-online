import { Injectable } from '@angular/core';
import { GameState } from '../interfaces/GameState';
import { Card } from '../interfaces/Card';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  gameState: GameState;

  constructor() { }

  getGameState(): Observable<GameState> {
    let gameState: GameState = this.gameState;
    if (gameState) {
      this.gameState = null;
      console.log(gameState);
      return of(gameState);
    } else {
      let mainPile: Card[] = [];
      for (let i = 0; i < 104; i++) {
        mainPile.push({ id: 0 });
      }
      let tempGameState: GameState = {
        _id: undefined,
        mainPile: {
          cards: mainPile
        },
        discard: {
          cards: []
        },
        players: [
          {
            name: "Celito",
            cards: [],
            alreadyDraw: false,
            yourTurn: false
          }
        ]
      };
      return of(tempGameState);
    }

  }

  drawFromMainPile(): Observable<Card> {
    return of({ id: 1 });
  }
}
