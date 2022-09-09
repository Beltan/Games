import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  id = '1VlPq-OnGEbIH6K-Azi_igEGTVZ4bI0DSLREn6Q0zR-E';
  url = `https://docs.google.com/spreadsheets/d/${this.id}/export?format=xlsx&id=${this.id}`;

  allPlayers = [];
  games = [];
  baseScores = [];
  relativeScores = [];
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

  addBaseScore(score) {
    this.baseScores.push(score);
  }

  addRelativeScore(score) {
    this.relativeScores.push(score);
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
