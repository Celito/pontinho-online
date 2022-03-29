import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export type ConnectionStatus = 'uninitialize' | 'connected' | 'disconnected';

export interface ConnectionState {
  status: ConnectionStatus
}

export function createInitialState(): ConnectionState {
  return {
    status: 'uninitialize'
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'connection' })
export class ConnectionStore extends Store<ConnectionState> {

  constructor() {
    super(createInitialState());
  }

}
