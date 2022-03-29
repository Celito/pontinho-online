import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConnectionStore } from './connection.store';

@Injectable({ providedIn: 'root' })
export class ConnectionService {

  private _socket: WebSocket;

  constructor(
    private connectionStore: ConnectionStore,
    private http: HttpClient
  ) {}


}
