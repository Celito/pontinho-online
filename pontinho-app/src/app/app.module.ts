import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatchModule } from './match/match.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from '../environments/environment';
import { ConnectionIconComponent } from './shared/connection-icon/connection-icon.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnectionIconComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    MatchModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    environment.production ? [] : AkitaNgDevtools.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
