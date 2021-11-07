import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { games } from '../model/games';
import { hero } from '../model/hero';
import { villain } from '../model/villain';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  private apiURL = "http://localhost:5000/"

  constructor(
    private http: HttpClient
  ) { }

  getHeroes(heroCount: number): Observable<hero[]> {
    return this.http.get<hero[]>(`${this.apiURL}Hero/AllHeroes`);
  }

  getVillains(villainCount: number): Observable<villain[]> {
    return this.http.get<villain[]>(`${this.apiURL}Villain/AllVillains`);
  }

  getGames(): Observable<games[]> {
    return this.http.get<games[]>(`${this.apiURL}Game/AllGameResults`);
  }

  addGameResults(gameResults: games) {
  return this.http.post(`${this.apiURL}Game/AddGameResults`, gameResults);
  }


}
