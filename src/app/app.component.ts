import { Component } from '@angular/core';
import { hero } from './model/hero';
import { villain } from './model/villain';
import { GameService } from './services/game.service';
import { games } from './model/games';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  NO_ATTACKS_PLAYED = 'No attacks played';
  winner: string = '';
  gameplay: string[] = [this.NO_ATTACKS_PLAYED];
  selectedHero: number = -1; //holds the index id of the hero that gets clicked on
  selectedHeroName: string = ''; //to allow the game to display name on the screen
  selectedVillain: number = -1;
  selectedVillainName: string = '';
  selectedVillainHealth: string = '';
  heroStyle: any[] = []; //is an array of styles to align with the array of heroes
  villainStyle: any[] = [];//is an array of styles to align with the array of heroes
  heroList: hero[] = [];
  villainList: villain[] = [];

  rolledNumber: number = 0;

  //phase 2
  gamesPlayed: games[] = [];

  title = 'heroes-and-villains';

  constructor(
    private gameService: GameService,
    private datePipe: DatePipe) {}

  ngOnInit(): void {
  }

  start() {

    this.winner = '';
    this.gameplay[0] = this.NO_ATTACKS_PLAYED;

    // get the heroes
    this.gameService.getHeroes(2).subscribe((data) => {
      this.heroList = data;
      console.log(this.heroList);
      for (let i = 0; i < this.heroList.length; i++) {
        this.heroStyle[i] = 'heroStyle'; //sets the appearance layout of a hero
      }
    });

    // get the villains
    this.gameService.getVillains(3).subscribe((data) => {
      this.villainList = data;
      console.log(this.villainList);
      for (let i = 0; i < this.villainList.length; i++) {
        this.villainStyle[i] = 'villainStyle'; //sets the appearance layout of a villain
      }
    });

    this.loadGameResults();

  }

      clickHero(heroId: number) {
      //blocks hero from selection once use cases are 0
      if (this.heroList[heroId].initialUses < 1) {
         return;
      }

    if (this.selectedHero != -1) {
      this.setHeroBackground(this.selectedHero); //allows just 1 hero to be in play
    }

    this.selectedHero = heroId; //sets selectedHero to the heroID that was passed in. selectedHero holds the id of the hero that gets clicked on
    this.selectedHeroName = this.heroList[this.selectedHero].heroName; //displays hero name on screen

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
    if (this.heroStyle[heroId] == 'heroStyleSelected') { //colour is green when the hero is selected.
      this.heroStyle[heroId] = 'heroStyle';
    }
    else {
      this.heroStyle[heroId] = 'heroStyleSelected'; //allows hero to turn green when clicked, otherwise colour doesn't change
    }
  }

  setVillainBackground(villainId: number) {
    if (this.villainStyle[villainId] == 'villainStyleDisabled') { //.villainStyleDisabled colour is gray
      return;
    }
    if (this.villainStyle[villainId] == 'villainStyleSelected') {//red
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

      // log attack on screen along with random dice roll number

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


        /*if gameover now includes a push for winner and date*/
      if (this.isGameOver()) {
          this.gameplay[0] =  (this.winner + ' win!').toUpperCase();
        let date:Date = new Date();

        this.gamesPlayed.push({ created: date, winnerName: this.winner });
        this.addGameResults(date, this.winner);

    }
  }
}
        //phase 2 functions
        addGameResults(created: Date, winnerName: string) {
        var gameResults = new games();
        gameResults.created = created;
        gameResults.winnerName = winnerName;
        this.gameService.addGameResults(gameResults).subscribe();
        }

        loadGameResults() {
          // get the games played, these are laoded at the start of game
          this.gameService.getGames().subscribe((data) => { //listening for the get results of games played.
            this.gamesPlayed = data; //gets data of the games played from the database
            console.log(this.gamesPlayed);
          });
        }

  randomInt(min: number, max: number) {
    /* https://www.codegrepper.com/code-examples/javascript/angular+random+number+between+1+and+10 */
    const randomNumber =  Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  }

  isGameOver() {
    {
      let result = false;
      let villainsLive = false;
      let heroesLive = false;

      // if all villains are defeated - game over - heroes won
      // > loop through all villains and see if any of them have any health left
      this.villainList.forEach(villain => {
        if (villain.villainHealth > 0) {
          villainsLive = true;
        }
      });

      // if all heroes have uses = 0 but there are villains alive - villains won
      // > loops through to and finds any that have uses left.
      this.heroList.forEach(hero => {
        if (hero.initialUses > 0) {
          heroesLive = true;
        }
      });
      // Both Villain and Hero active, game not over
      if (villainsLive && heroesLive) {
        result = false;
      }
      // Hero is still alive, they win.
      else if (heroesLive) {
        this.winner = 'Heroes';
        result = true; // game is over
      }
      //Villain alive, they win
      else {
        this.winner = 'Villains';
        result = true; // game is over
      }
      return result;

    }


  }
}



