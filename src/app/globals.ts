import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  all_players = [];
  games = [];
  scores = [];

  players = [];

  setPlayers(players) {
    this.players = players;
  }

  addGame(game) {
    this.games.push(game);
  }

  addScore(score) {
    this.scores.push(score);
  }

  setAllPlayers(players) {
    this.all_players = players;
  }

  constructor() {}
}
