import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  allPlayers = [];
  games = [];
  scores = [];
  maxPlayers = [];
  minPlayers = [];
  playingTime = [];
  owners = [];
  players = [];
  totalPlayers = 0;

  constructor() {}

  setPlayers(players) {
    this.players = players;
  }

  setTotalPlayers(extraPlayers) {
    this.totalPlayers = parseInt(extraPlayers, 10) + this.players.length;
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

  addOwnedBy(owners) {
    const ownersArray = owners
      ? owners.split(',').map((item) => item.trim())
      : [];
    this.owners.push(ownersArray);
  }

  setAllPlayers(players) {
    this.allPlayers = players;
  }
}
