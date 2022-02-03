import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../globals';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage {
  globals: Globals;

  allowed_games = [];

  constructor(private router: Router, globals: Globals) {
    this.globals = globals;
  }

  ionViewWillEnter() {
    if (this.globals.games.length == 0) this.router.navigateByUrl('/home');

    this.allowed_games = [];

    for (let i = 0; i < this.globals.games.length; i++) {
      if (!this.globals.max_players[i] || !this.globals.min_players[i])
        continue;
      if (
        this.globals.max_players[i] < this.globals.players.length ||
        this.globals.min_players[i] > this.globals.players.length
      )
        continue;

      let max = -1;
      let min = 11;
      let avg = 0;
      let ignore = 0;

      for (let player of this.globals.players) {
        let player_index = this.globals.all_players.indexOf(player);

        let current_score = this.globals.scores[i][player_index];

        if (current_score == -1) {
          ignore++;
          continue;
        }

        avg += current_score;

        if (current_score < min) min = current_score;
        if (current_score > max) max = current_score;
      }

      if (this.globals.players.length - ignore > 0) {
        avg = avg / (this.globals.players.length - ignore);
      } else {
        avg = -1;
      }

      let sum_squares = 0;
      for (let player of this.globals.players) {
        let player_index = this.globals.all_players.indexOf(player);

        let current_score = this.globals.scores[i][player_index];

        if (current_score == -1) {
          continue;
        }

        let diff = avg - current_score;
        sum_squares += diff * diff;
      }

      let variance = -1;
      if (this.globals.players.length - ignore > 0)
        variance = sum_squares / (this.globals.players.length - ignore);

      let game = {
        name: this.globals.games[i],
        avg: avg.toFixed(2),
        max: max,
        min: min,
        var: variance.toFixed(2),
        ign: ignore
      };
      this.allowed_games.push(game);
    }

    this.allowed_games.sort(this.compare);
  }

  compare(a, b) {
    if (b.avg == a.avg) return a.var - b.var;
    return b.avg - a.avg;
  }
}
