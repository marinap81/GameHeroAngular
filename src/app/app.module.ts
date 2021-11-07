import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {enableProdMode} from '@angular/core';
import { AppComponent } from './app.component';
import { HeroesComponent } from './heroes/heroes.component';
import { VillainsComponent } from './villains/villains.component';


import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    VillainsComponent,
      ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
