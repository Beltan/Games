import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  allPlayers = [];
  games = [];
  scores = [];
  maxPlayers = [];
  minPlayers = [];
  playingTime = [];

  players = [];

  constructor() {}

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
    this.maxPlayers.push(max);
  }

  addMinPlayers(min) {
    this.minPlayers.push(min);
  }

  addPlayingTime(time) {
    this.playingTime.push(time);
  }

  setAllPlayers(players) {
    this.allPlayers = players;
  }
}
