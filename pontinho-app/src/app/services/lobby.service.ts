import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { GameState } from '../interfaces/GameState';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LobbyService {

  constructor(private http: HttpClient) { }

  createMatch(playerName: string): Observable<GameState> {
    return this.http.post<GameState>('/api/game-state/create', { players: [playerName] });
  }
}
