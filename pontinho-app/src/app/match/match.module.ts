import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { MatchRoutingModule } from './match-routing.module';
import { CardComponent } from './card/card.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PlayerAreaComponent } from './player-area/player-area.component';

@NgModule({
  declarations: [
    TableComponent,
    CardComponent,
    PlayerAreaComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    MatchRoutingModule
  ]
})
export class MatchModule { }
