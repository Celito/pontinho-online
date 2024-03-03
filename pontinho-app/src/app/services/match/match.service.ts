import { Injectable } from '@angular/core';
import { GameState } from '../../interfaces/GameState';
import { Card } from '../../interfaces/Card';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Message } from 'src/app/interfaces/Message';
import { ToastrService } from 'ngx-toastr';
import { PlayerState, PlayerStatus } from 'src/app/interfaces/PlayerState';
import { JoinMessage, LeaveMessage, MessageResolver } from 'shared-types/messages'


@Injectable({
  providedIn: 'root'
})
export class MatchService {

  static MATCH_ID_TOKEN = 'match_id';
  static PLAYER_ID_TOKEN = 'player_id';

  private _gameState: GameState;
  private _matchSocket: WebSocket;
  private _resolver: MessageResolver;

  private _gameStateSub: BehaviorSubject<GameState> = new BehaviorSubject(undefined);
  private _playersStatusSubs: { [playerId: string]: BehaviorSubject<PlayerStatus> } = {}

  gameState$: Observable<GameState> = this._gameStateSub.asObservable()

  playersStatus$: { [playerId: string]: Observable<PlayerStatus> } = {}

  userName: string;
  userId: string;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    const matchId = sessionStorage.getItem(MatchService.MATCH_ID_TOKEN);
    const playerId = sessionStorage.getItem(MatchService.PLAYER_ID_TOKEN);
    if (matchId && playerId) {
      this.connectWS(matchId, playerId)
    }
    this._resolver = new MessageResolver({
      join: async (ws: any, message: JoinMessage) => { console.log('resolver.join', message) },
      leave: async (ws: any, message: LeaveMessage) => { }
    });
  }

  private connectWS(matchId: string, playerId: string): void {
    console.log(`starting connection to websocket with matchId: "${matchId}" and playerId: "${playerId}"`)
    this._matchSocket = new WebSocket('ws://localhost:3000');
    this._matchSocket.addEventListener('message', ev => this.onReceiveMatchMessage(ev));
    this._matchSocket.addEventListener('open', ev => {
      console.log('socket connection opened', ev, this._matchSocket.readyState)
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
    this._matchSocket.addEventListener('close', ev => this.onMatchSocketClosed(ev));
    this._matchSocket.addEventListener('error', ev => {
      console.log('socket connection errored', ev)
    });
  }

  setGameState(gameState: GameState, newUserName?: string): void {
    sessionStorage.setItem(MatchService.MATCH_ID_TOKEN, gameState._id);

    this._gameState = gameState;

    const sessionPlayerId = sessionStorage.getItem(MatchService.PLAYER_ID_TOKEN);

    for (const player of gameState.players) {
      if (!this._playersStatusSubs[player._id]) {
        this._playersStatusSubs[player._id] = new BehaviorSubject(player.status)
        this.playersStatus$[player._id] = this._playersStatusSubs[player._id].asObservable()
      } else {
        this._playersStatusSubs[player._id].next(player.status)
      }
    }

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
    this._gameStateSub.next(this._gameState);
  }

  setAllPlayerStatus(status: PlayerStatus) {
    for (const state in this._playersStatusSubs) {
      this._playersStatusSubs[state].next(status);
    }
  }

  fetchGameState(): Observable<GameState> {
    const matchId = sessionStorage.getItem(MatchService.MATCH_ID_TOKEN);
    const playerId = sessionStorage.getItem(MatchService.PLAYER_ID_TOKEN);
    return this.http.get<GameState>(
      `/api/match/${matchId}/${playerId}`
    ).pipe(
      map((retreivedGameState: GameState) => {
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

  onReceiveMatchMessage(event: MessageEvent): any {
    this._resolver.resolveMessage(undefined, event.data)
    const data: Message = JSON.parse(event.data.toString());
    this.setGameState(data.state);
    if (data.type === 'joined' && data.params.player_id !== this.userId) {
      this.toastr.info(`${this.getPlayer(data.params.player_id)?.name} has joined the game`);
    }
  }

  onMatchSocketClosed(event: CloseEvent) {
    console.log('socket connection closed', event);
    this.setAllPlayerStatus('Offline');
    this.toastr.error(`Lost connection with the server`);
  }

  getPlayer(player_id: string): PlayerState {
    return this._gameState.players.find(p => p._id === player_id);
  }

  drawFromMainPile(): Observable<Card> {
    return of({ id: 1 });
  }
}
