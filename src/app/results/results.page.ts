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
      let max = 0;
      let min = 10;
      let avg = 0;
      let sum_squares = 0;

      for (let player of this.globals.players) {

        let player_index = this.globals.all_players.indexOf(player);

        let current_score = this.globals.scores[player_index][i];

        avg += current_score;
        sum_squares += current_score * current_score;

        if (current_score < min) min = current_score;
        if (current_score > max) max = current_score;
      }

      avg = avg / this.globals.players.length;

      this.avg_score.push(avg);
      this.max_score.push(max);
      this.min_score.push(min);
      this.variance.push(sum_squares / (this.globals.players.length - 1));
    }

  }
}
