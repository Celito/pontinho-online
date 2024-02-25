import { CdkDropList } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayerState } from 'src/app/interfaces/PlayerState';
import { MatchService } from 'src/app/services/match/match.service';

type PlayerAreaPosition = 'top' | 'bottom' | 'right' | 'left'

@Component({
  selector: 'player-area',
  templateUrl: './player-area.component.html',
  styleUrl: './player-area.component.scss'
})
export class PlayerAreaComponent {
  @Input() position: PlayerAreaPosition;
  @Input() player: PlayerState;

  @Output() playerHand: EventEmitter<CdkDropList> = new EventEmitter<CdkDropList>();

  @ViewChild('playerHand') _playeHand: CdkDropList;

  playerCards = [];

  constructor(
    private matchService: MatchService
  ) { }

  getPlayerStatus(playerId?: string): Observable<string> {
    const statusObs = this.matchService.playersStatus$[playerId || this.matchService.userId]
    if (statusObs) {
      return statusObs.pipe(map(status => status === 'Online' ? 'C' : 'D'))
    }
    return of('U')
  }
}
