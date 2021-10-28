import { Component } from '@angular/core';
import { hero } from './model/hero';
import { villain } from './model/villain';
import { GameService } from './services/game.service';
import {enableProdMode} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  NO_ATTACKS_PLAYED = 'No attacks played';
  winner: string = '';
  gameplay: string[] = [this.NO_ATTACKS_PLAYED];
  selectedHero: number = -1; //holds the id of the hero that gets clicked on
  selectedHeroName: string = ''; //to allow the game to display name on the screen
  selectedVillain: number = -1;
  selectedVillainName: string = '';
  selectedVillainHealth: string = '';
  heroStyle: any[] = [];
  villainStyle: any[] = [];
  heroList: hero[] = [];
  villainList: villain[] = [];

  rolledNumber: number = 0;

  title = 'heroes-and-villains';

  constructor(
    private gameService: GameService) {}

  ngOnInit(): void {
  }

  start() {

    this.winner = '';
    this.gameplay[0] = this.NO_ATTACKS_PLAYED;

    // get the heroes
    this.gameService.getHeroes(2).subscribe((data) => {
      this.heroList = data;
      console.log(this.heroList);
      for (let index = 0; index < this.heroList.length; index++) {
        this.heroStyle[index] = 'heroStyle';
      }
    });

    // get the villains
    this.gameService.getVillains(3).subscribe((data) => {
      this.villainList = data;
      console.log(this.villainList);
      for (let index = 0; index < this.villainList.length; index++) {
        this.villainStyle[index] = 'villainStyle';
      }
    });

  }

      clickHero(heroId: number) {
      //added extra if statement to block hero from selection once use cases are 0
      if (this.heroList[heroId].initialUses < 1) {
        // this character is used up
        return;
      }

    if (this.selectedHero != -1) {
      this.setHeroBackground(this.selectedHero);
    }

    this.selectedHero = heroId;
    this.selectedHeroName = this.heroList[this.selectedHero].heroName;

    // make changes to the hero with this heroId
    console.log('Hero selected ', heroId);
    // set background
    this.setHeroBackground(heroId);

  }

    clickVillain(villainId: number) {
    //added extra statement to block villain from selection once use cases are 0
    if (this.villainList[villainId].villainHealth < 1) {
      // this character is used up and cant be in play any longer
      return;
    }


    if (this.selectedVillain != -1) {
      this.setVillainBackground(this.selectedVillain);
    }

    this.selectedVillain = villainId;
    this.selectedVillainName = this.villainList[this.selectedVillain].villainName;
    this.selectedVillainHealth = this.villainList[this.selectedVillain].villainHealth.toString();

    // make changes to the villain with this villainId
    console.log('Villain selected ', villainId);
    // set background
    this.setVillainBackground(villainId);
  }

  setHeroBackground(heroId: number) {
    if (this.heroStyle[heroId] == 'heroStyleDisabled') {
      return;
    }
    if (this.heroStyle[heroId] == 'heroStyleSelected') {
      this.heroStyle[heroId] = 'heroStyle';
    }
    else {
      this.heroStyle[heroId] = 'heroStyleSelected';
    }
  }

  setVillainBackground(villainId: number) {
    if (this.villainStyle[villainId] == 'villainStyleDisabled') {
      return;
    }
    if (this.villainStyle[villainId] == 'villainStyleSelected') {
      this.villainStyle[villainId] = 'villainStyle';
    }
    else {
      this.villainStyle[villainId] = 'villainStyleSelected';
    }
  }

  roll() {
    if (this.selectedHero != -1 && this.selectedVillain != -1) {

      // hero attacks villain & decrement hero uses left
      this.heroList[this.selectedHero].initialUses -= 1;

      // randomly generate dice roll number between hero min and max values
      this.rolledNumber = this.randomInt(this.heroList[this.selectedHero].minDiceValue,
      this.heroList[this.selectedHero].maxDiceValue);

      // subtract dice roll number from villain health and update
      this.villainList[this.selectedVillain].villainHealth -= this.rolledNumber;
      this.selectedVillainHealth = this.villainList[this.selectedVillain].villainHealth.toString();

      // set health to 0 if rolled attack was more than remaining health
      if (this.villainList[this.selectedVillain].villainHealth < 0) {
        this.villainList[this.selectedVillain].villainHealth = 0;
      }

      // log attack on screen

      this.gameplay[0] = this.heroList[this.selectedHero].heroName + ' rolled ' +
          this.rolledNumber.toString() + ' and attacked ' +
          this.villainList[this.selectedVillain].villainName;


      // if hero uses left = 0, gray out hero
      if (this.heroList[this.selectedHero].initialUses < 1) {this.heroStyle[this.selectedHero] = 'heroStyleDisabled';
        this.selectedHero = -1;
        // clear attacks message
        this.selectedHeroName = '';
      }
      // if villain health < 1, gray out villain
      if (this.villainList[this.selectedVillain].villainHealth < 1) {
        this.villainStyle[this.selectedVillain] = 'villainStyleDisabled';
        this.selectedVillain = -1;
        // clear attacks message
        this.selectedVillainName = '';
        this.selectedVillainHealth = '';
      }

      if (this.isGameOver()) {
         this.gameplay[0] =  (this.winner + ' win!').toUpperCase();
      }

    }
  }

  randomInt(min: number, max: number) {
    /* https://www.codegrepper.com/code-examples/javascript/angular+random+number+between+1+and+10 */
    const randomNumber =  Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  }

  isGameOver() {
    {
      let result = false;
      let villainsLive = false;let heroesLive = false;
      // if all villains are defeated - game over - heroes won
      this.villainList.forEach(villain => {
        if (villain.villainHealth > 0) {
          villainsLive = true;
        }
      });
      // if all heroes have uses = 0 but there are villains alive - villains won
      this.heroList.forEach(hero => {
        if (hero.initialUses > 0) {
          heroesLive = true;
        }
      });
      // now if villainsLive == false - game over - heroes won
      if (!villainsLive) {
        this.winner = 'Heroes';
        result = true; // game is over
      }

      // if villainsLive == true, and heroesLive == true, game is not over
      if (villainsLive && heroesLive) {
        result = false;
      }

      // if villainsLive == true, but heroesLive == false - villains won
      if (villainsLive && !heroesLive) {
        this.winner = 'Villains';
        result = true; // game is over
      }

      return result;
    }

  }


}
