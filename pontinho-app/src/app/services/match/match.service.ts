import { Injectable } from '@angular/core';
import { GameState } from '../../interfaces/GameState';
import { Card } from '../../interfaces/Card';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
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

  private _gameStateSub: BehaviorSubject<GameState> = new BehaviorSubject(undefined);

  gameState$: Observable<GameState> = this._gameStateSub.asObservable()

  userName: string;
  userId: string;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    const matchId = sessionStorage.getItem(MatchService.MATCH_ID_TOKEN);
    const playerId = sessionStorage.getItem(MatchService.PLAYER_ID_TOKEN);

    console.log(`match service constructor, matchId: "${matchId}" and playerId: "${playerId}"`)
    if (matchId && playerId) {
      this.connectWS(matchId, playerId)
    }
  }

  private connectWS(matchId: string, playerId: string): void {
    console.log(`starting connection to websocket with matchId: "${matchId}" and playerId: "${playerId}"`)
    this._matchSocket = new WebSocket('ws://localhost:3000');
    this._matchSocket.addEventListener('message', ev => this.receiveMatchMessage(ev));
    this._matchSocket.addEventListener('open', ev => {
      console.log('socket connection opened', ev)
      this._matchSocket.send(
        JSON.stringify({
          type: 'join',
          data: {
            matchId,
            playerId
          }
        })
      );
    });
    this._matchSocket.addEventListener('close', ev => {
      console.log('socket connection closed', ev)
    });
    this._matchSocket.addEventListener('error', ev => {
      console.log('socket connection errored', ev)
    });
    console.log('all match socket events subscribed')
  }

  setGameState(gameState: GameState, newUserName?: string): void {
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
        if (!this._matchSocket) {
          this.connectWS(gameState._id, player._id)
        }
      }
    } else if (!this.userName && sessionPlayerId) {
      this.userName = gameState.players.find(p => p._id === sessionPlayerId)?.name;
      this.userId = sessionPlayerId;
    }
    console.log('about to call next', this._gameState)
    this._gameStateSub.next(this._gameState);
  }

  fetchGameState(): Observable<GameState> {
    const matchId = sessionStorage.getItem(MatchService.MATCH_ID_TOKEN);
    const playerId = sessionStorage.getItem(MatchService.PLAYER_ID_TOKEN);
    return this.http.get<GameState>(
      `/api/match/${matchId}/${playerId}`
    ).pipe(
      map((retreivedGameState: GameState) => {
        console.log('received game state');
        return retreivedGameState;
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
  }

  receiveMatchMessage(event: MessageEvent): any {
    const data: Message = JSON.parse(event.data);
    console.log('Received message through the socket: ', event);
    this.setGameState(data.state)
    if (data.type === 'joined') {
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
