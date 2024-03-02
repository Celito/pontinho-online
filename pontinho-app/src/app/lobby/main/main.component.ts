import { Component, OnInit } from '@angular/core';
import { LobbyService } from 'src/app/services/lobby/lobby.service';
import { Router } from '@angular/router';
import { MatchService } from 'src/app/services/match/match.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  name = new FormControl('', [Validators.required, Validators.minLength(3),
  Validators.maxLength(15), Validators.pattern('^[A-Za-z0-9çÇâãáñÑêéíôóúÁÉÍÓÚ]+$')]);
  matches: { _id: string, host: string }[];

  constructor(
    private lobbyService: LobbyService,
    private matchService: MatchService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.matchService.fetchGameState().subscribe(
      gameState => {
        if (gameState) {
          this.router.navigate(['match']);
        }
      }
    );
    this.lobbyService.getMatches().subscribe(matches => {
      this.matches = matches;
    });
  }

  createMatch() {
    if (this.name.valid) {
      this.lobbyService.createMatch(this.name.value).subscribe(
        gameState => {
          this.matchService.setGameState(gameState, this.name.value);
          this.router.navigate(['match']);
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  joinMatch(match_id: string) {
    if (this.name.valid) {
      this.lobbyService.joinMatch(match_id, this.name.value).subscribe(
        gameState => {
          this.matchService.setGameState(gameState, this.name.value);
          this.router.navigate(['match']);
        },
        error => {
          console.log(error);
          if (error.status === 409) {
            this.name.setErrors({ conflict: true });
          }
        }
      );
    }
  }

  getErrorMessage(): string {
    if (this.name.hasError('required')) {
      return "Escolha um nome válido";
    } else if (this.name.hasError('minlength')) {
      return `Nome deve ter no mínimo ${this.name.errors['minlength'].requiredLength} letras`;
    } else if (this.name.hasError('maxlength')) {
      return `Nome não pode ter mais de ${this.name.errors['maxlength'].requiredLength} letras`;
    } else if (this.name.hasError('pattern')) {
      return "Nome pode apenas conter letras e números, sem espaços";
    } else if (this.name.hasError('conflict')) {
      return "Esse nome já esta em uso";
    }
    return "Nome inválido";
  }
}
