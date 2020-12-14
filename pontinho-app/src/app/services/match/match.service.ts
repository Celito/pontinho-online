import { Injectable } from '@angular/core';
import { GameState } from '../../interfaces/GameState';
import { Card } from '../../interfaces/Card';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  static MATCH_ID_TOKEN = 'match_id';
  static PLAYER_ID_TOKEN = 'player_id';

  private _gameState: GameState;
  private _matchSocket: WebSocket;

  userName: string;

  constructor(private http: HttpClient) { }

  setGameState(gameState: GameState, newUserName: string): void {
    sessionStorage.setItem(MatchService.MATCH_ID_TOKEN, gameState._id);

    this._gameState = gameState;

    if (!this._matchSocket || this._matchSocket.readyState === WebSocket.CLOSED) {
      this._matchSocket = new WebSocket('ws://localhost:3000');
      this._matchSocket.addEventListener('message', this.receiveMatchMessage);
    }

    const sessionPlayerId = sessionStorage.getItem(MatchService.PLAYER_ID_TOKEN);

    if (newUserName) {
      const player = gameState.players.find(p => p.name === newUserName);
      if (player) {
        sessionStorage.setItem(
          MatchService.PLAYER_ID_TOKEN,
          player._id
        );
        this.userName = newUserName;
      }
    } else if (!this.userName && sessionPlayerId) {
      this.userName = gameState.players.find(p => p._id === sessionPlayerId)?.name;
    }
  }

  getGameState(): Observable<GameState> {
    let gameState: GameState = this._gameState;
    const sMatchId = sessionStorage.getItem(MatchService.MATCH_ID_TOKEN);
    const sPlayerId = sessionStorage.getItem(MatchService.PLAYER_ID_TOKEN);
    if (gameState) {
      this._gameState = null;
      return of(gameState);
    } else if (sMatchId && sPlayerId) {
      return this.http.get<GameState>(
        `/api/match/${sMatchId}/${sPlayerId}`
      ).pipe(
        map((retreivedGameState: GameState) => {
          this.setGameState(retreivedGameState, undefined);
          return this._gameState;
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            // match not found, cleaning up the session
            sessionStorage.removeItem(MatchService.MATCH_ID_TOKEN);
            sessionStorage.removeItem(MatchService.PLAYER_ID_TOKEN);
          }

          return throwError(error.message)
        })
      );
    } else {
      return of();
    }
  }

  receiveMatchMessage(event: MessageEvent): any {
    console.log('Received message through the socket: ', event);
  }

  drawFromMainPile(): Observable<Card> {
    return of({ id: 1 });
  }
}
