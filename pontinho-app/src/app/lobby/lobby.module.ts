import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LobbyRoutingModule } from './lobby-routing.module';
import { MainComponent } from './main/main.component';


@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    LobbyRoutingModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ]
})
export class LobbyModule { }
