import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { hero } from '../model/hero';
import { villain } from '../model/villain';

//const httpHeader = new HttpHeaders({'Content-Type': 'application/json'});

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

}
