import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  all_players = ['Esteve', 'Iñigo', 'Marc Asenjo', 'Maria'];
  games = ['Secret Hitler', 'One Night Ultimate Werewolf', 'Resistencia'];
  scores = [
    [6, 6, 7],
    [3, 5, 3],
    [10, 2, 4],
    [1, 7, 6],
  ];

  players = [];

  setPlayers(players) {
    this.players = players;
  }

  constructor() {}
}
