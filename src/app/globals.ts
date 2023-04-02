import { Injectable } from '@angular/core';
import { StorageService } from './storage';

@Injectable()
export class Globals {
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

  constructor(private storage: StorageService) {}

  public async setId(id) {
    await this.storage.set('id', id);
  }

  public async unsetId() {
    await this.storage.remove('id');
  }

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
