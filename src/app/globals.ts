import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  all_players = [];
  games = [];
  scores = [];
  max_players = [];
  min_players = [];
  playing_time = [];

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

  addMaxPlayers(max) {
    this.max_players.push(max);
  }

  addMinPlayers(min) {
    this.min_players.push(min);
  }

  addPlayingTime(time) {
    this.playing_time.push(time);
  }

  setAllPlayers(players) {
    this.all_players = players;
  }

  constructor() {}
}
