import { CdkDropList } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayerState, PlayerStatus } from 'src/app/interfaces/PlayerState';
import { MatchService } from 'src/app/services/match/match.service';

type PlayerAreaPosition = 'top' | 'bottom' | 'right' | 'left'

@Component({
  selector: 'player-area',
  templateUrl: './player-area.component.html',
  styleUrl: './player-area.component.scss'
})
export class PlayerAreaComponent implements OnInit {
  @Input() position: PlayerAreaPosition;
  @Input() player: PlayerState;

  @Output() playerHand: EventEmitter<CdkDropList> = new EventEmitter<CdkDropList>();

  @ViewChild('playerHand') _playeHand: CdkDropList;

  playerCards = [];

  status$ = new Observable<PlayerStatus>()

  constructor(
    private matchService: MatchService
  ) { }

  ngOnInit() {
    console.log('creating player area with id', this.player._id || this.matchService.userId)
    this.status$ = this.matchService.playersStatus$[this.player._id || this.matchService.userId]
  }

  getPlayerStatus(): Observable<string> {
    if (this.status$) {
      return this.status$.pipe(map(status => status === 'Online' ? 'circle' : 'motion_photos_off_outline'))
    }
    return of('help')
  }
}
