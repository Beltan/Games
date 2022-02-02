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

  avg_score = [];
  max_score = [];
  min_score = [];
  variance = [];

  constructor(private router: Router, globals: Globals) {
    this.globals = globals;
  }

  ionViewWillEnter() {
    for (let i = 0; i < this.globals.games.length; i++) {
      let max = -1;
      let min = 11;
      let avg = 0;
      let sum_squares = 0;
      let ignore = 0;

      for (let player of this.globals.players) {
        let player_index = this.globals.all_players.indexOf(player);

        let current_score = this.globals.scores[i][player_index];

        if (current_score == -1) {
          ignore++;
          continue;
        }

        avg += current_score;
        sum_squares += current_score * current_score;

        if (current_score < min) min = current_score;
        if (current_score > max) max = current_score;
      }

      if (this.globals.players.length - ignore > 0) {
        avg = avg / (this.globals.players.length - ignore);
      } else {
        avg = -1;
      }

      this.avg_score.push(avg.toFixed(2));
      this.max_score.push(max);
      this.min_score.push(min);

      let variance = -1;
      if (this.globals.players.length - ignore - 1) variance = sum_squares / (this.globals.players.length - 1);
      this.variance.push(variance.toFixed(2));
    }
  }
}
