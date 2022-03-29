import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Observable } from 'rxjs';
import { ConnectionStore, ConnectionState, ConnectionStatus } from './connection.store';

@Injectable({ providedIn: 'root' })
export class ConnectionQuery extends Query<ConnectionState> {

  constructor(protected store: ConnectionStore) {
    super(store);
  }

  status$: Observable<ConnectionStatus> = this.select('status');

}
