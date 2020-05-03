import { Component, OnInit } from '@angular/core';
import { LobbyService } from 'src/app/services/lobby.service';
import { Router } from '@angular/router';
import { MatchService } from 'src/app/services/match.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  matches: { _id: string, host: string }[];

  constructor(
    private lobbyService: LobbyService,
    private matchService: MatchService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.lobbyService.getMatches().subscribe(matches => {
      this.matches = matches;
    });
  }

  createMatch() {
    if (this.name.valid) {
      this.lobbyService.createMatch(this.name.value).subscribe(gameState => {
        this.matchService.gameState = gameState;

        this.router.navigate(['match']);
      });
    }
  }

  joinMatch(match_id: string) {
    if (this.name.valid) {
      console.log(`Entrando na partida de id ${match_id} com o nome ${this.name.value}`);
      this.lobbyService.joinMatch(match_id, this.name.value).subscribe(gameState => {
        this.matchService.gameState = gameState;

        this.router.navigate(['match']);
      });
    }
  }
}
