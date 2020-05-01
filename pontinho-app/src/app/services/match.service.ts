import { Injectable } from '@angular/core';
import { GameState } from '../interfaces/GameState';
import { Card } from '../interfaces/Card';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  constructor() { }

  getGameState(): Observable<GameState> {
    let mainPile: Card[] = [];
    for (let i = 0; i < 104; i++) {
      mainPile.push({ id: 0 });
    }
    let gameState: GameState = {
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
    }

    return of(gameState);
  }
}
