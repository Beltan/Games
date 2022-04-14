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

  allowedGames = [];
  filteredGames = [];
  currentFilter = '';
  filteringByOwned = false;
  columns = [
    { name: 'Name', width: '140', cellClass: 'center-text' },
    { name: 'Ignored', width: '70', cellClass: 'center-text' },
    { name: 'Average', width: '70', cellClass: 'center-text' },
    { name: 'Variance', width: '70', cellClass: 'center-text' },
  ];

  constructor(private router: Router, globals: Globals) {
    this.globals = globals;
  }

  ionViewWillEnter() {
    if (this.globals.games.length === 0) {
      this.router.navigateByUrl('/home');
    }

    this.allowedGames = [];

    for (let i = 0; i < this.globals.games.length; i++) {
      if (!this.globals.maxPlayers[i] || !this.globals.minPlayers[i]) {
        continue;
      }
      if (
        this.globals.maxPlayers[i] < this.globals.players.length ||
        this.globals.minPlayers[i] > this.globals.players.length
      ) {
        continue;
      }

      let maximum = -1;
      let minimum = 11;
      let avg = 0;
      let ignore = 0;

      for (const player of this.globals.players) {
        const playerIndex = this.globals.allPlayers.indexOf(player);

        const currentScore = this.globals.scores[i][playerIndex];

        if (currentScore === -1) {
          ignore++;
          continue;
        }

        avg += currentScore;

        if (currentScore < minimum) {
          minimum = currentScore;
        }
        if (currentScore > maximum) {
          maximum = currentScore;
        }
      }

      if (this.globals.players.length - ignore > 0) {
        avg = avg / (this.globals.players.length - ignore);
      } else {
        avg = -1;
      }

      let sumSquares = 0;
      for (const player of this.globals.players) {
        const playerIndex = this.globals.allPlayers.indexOf(player);

        const currentScore = this.globals.scores[i][playerIndex];

        if (currentScore === -1) {
          continue;
        }

        const diff = avg - currentScore;
        sumSquares += diff * diff;
      }

      let variance = -1;
      if (this.globals.players.length - ignore > 0) {
        variance = sumSquares / (this.globals.players.length - ignore);
      }

      const game = {
        name: this.globals.games[i],
        average: avg !== -1 ? avg.toFixed(2) : '-',
        max: maximum,
        min: minimum,
        variance: variance !== -1 ? variance.toFixed(2) : '-',
        ignored: ignore,
        owners: this.globals.owners[i],
      };
      this.allowedGames.push(game);
    }

    this.allowedGames.sort(this.compare);
    this.filteredGames = this.allowedGames;
  }

  compare(a, b) {
    if (b.avg === a.avg) {
      return a.var - b.var;
    }
    return b.avg - a.avg;
  }

  filterDatatable(event) {
    const filter = event.target.value.toLowerCase();
    this.searchFilter(filter);
    this.currentFilter = filter;
  }

  searchFilter(filter) {
    if (filter === '') {
      this.filteredGames = this.allowedGames;
    }
    else {
      this.filteredGames = [];

      for (const game of this.allowedGames) {
        if (game.name.toLowerCase().indexOf(filter) !== -1) {
          this.filteredGames.push(game);
        }
      }
    }

    if (this.filteringByOwned) {
      this.filterByOwned();
    }
  }

  toggle() {
    this.filteringByOwned = !this.filteringByOwned;
    this.filterByOwned();
  }

  filterByOwned() {
    if (this.filteringByOwned) {
      this.filteredGames = this.filteredGames.filter((game) => {
        if (
          game.owners[0] === 'All' ||
          this.globals.players.filter((value) => game.owners.includes(value))
            .length !== 0
        ) {
          return game;
        }
      });
    } else {
      this.searchFilter(this.currentFilter);
    }
  }
}
