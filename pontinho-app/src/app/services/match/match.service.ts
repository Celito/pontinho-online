import { Injectable } from '@angular/core';
import { GameState } from '../../interfaces/GameState';
import { Card } from '../../interfaces/Card';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Message } from 'src/app/interfaces/Message';
import { ToastrService } from 'ngx-toastr';
import { PlayerState } from 'src/app/interfaces/PlayerState';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  static MATCH_ID_TOKEN = 'match_id';
  static PLAYER_ID_TOKEN = 'player_id';

  private _gameState: GameState;
  private _matchSocket: WebSocket;

  userName: string;
  userId: string;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  setGameState(gameState: GameState, newUserName: string): void {
    sessionStorage.setItem(MatchService.MATCH_ID_TOKEN, gameState._id);

    this._gameState = gameState;

    const sessionPlayerId = sessionStorage.getItem(MatchService.PLAYER_ID_TOKEN);

    if (newUserName) {
      const player = gameState.players.find(p => p.name === newUserName);
      if (player) {
        this.userId = player._id;
        sessionStorage.setItem(
          MatchService.PLAYER_ID_TOKEN,
          player._id
        );
        this.userName = newUserName;
      }
    } else if (!this.userName && sessionPlayerId) {
      this.userName = gameState.players.find(p => p._id === sessionPlayerId)?.name;
      this.userId = sessionPlayerId;
    }

    if (!this._matchSocket || this._matchSocket.readyState === WebSocket.CLOSED) {
      this._matchSocket = new WebSocket('ws://localhost:3000');
      this._matchSocket.addEventListener('open', ev => {
        this._matchSocket.send(
          JSON.stringify({
            type: 'join',
            data: {
              matchId: gameState._id,
              playerId: this.userId
            }
          })
        );
      })
      this._matchSocket.addEventListener('message', ev => this.receiveMatchMessage(ev));
    }
  }

  getGameState(): Observable<GameState> {
    let gameState: GameState = this._gameState;
    const matchId = sessionStorage.getItem(MatchService.MATCH_ID_TOKEN);
    const playerId = sessionStorage.getItem(MatchService.PLAYER_ID_TOKEN);
    if (gameState) {
      this._gameState = null;
      return of(gameState);
    } else if (matchId && playerId) {
      return this.http.get<GameState>(
        `/api/match/${matchId}/${playerId}`
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
      return of(undefined);
    }
  }

  receiveMatchMessage(event: MessageEvent): any {
    const data:Message = JSON.parse(event.data);
    console.log('Received message through the socket: ', event);
    this._gameState = data.state;
    if(data.type === 'joined') {
      this._gameState.players
      this.toastr.info(`${this.getPlayer(data.params.player_id)?.name} has joined the game`);
    }
  }

  getPlayer(player_id: string): PlayerState {
    return this._gameState.players.find(p => p._id === player_id);
  }

  drawFromMainPile(): Observable<Card> {
    return of({ id: 1 });
  }
}
