import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { GameState } from '../../interfaces/GameState';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LobbyService {

  constructor(private http: HttpClient) { }

  createMatch(playerName: string): Observable<GameState> {
    return this.http.post<GameState>('/api/match/create', { name: playerName });
  }

  joinMatch(match_id: string, playerName: string): Observable<GameState> {
    return this.http.post<GameState>('/api/match/join', { match_id, name: playerName });
  }

  getMatches(): Observable<{ _id: string, host: string }[]> {
    return this.http.get<{ _id: string, host: string }[]>('/api/match');
  }
}
