import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { MatchRoutingModule } from './match-routing.module';
import { CardComponent } from './card/card.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [TableComponent, CardComponent],
  imports: [
    CommonModule,
    DragDropModule,
    MatchRoutingModule
  ]
})
export class MatchModule { }
