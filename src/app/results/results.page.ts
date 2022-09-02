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

  allowedGames;
  filteredGames;
  currentFilter;
  sortDirection;
  sortKey;
  filteringByOwned;
  filteringByIgnored;
  extraPlayers;

  constructor(private router: Router, globals: Globals) {
    this.globals = globals;
  }

  ionViewWillEnter() {
    if (this.globals.games.length === 0) {
      this.router.navigateByUrl('/home');
    }

    this.allowedGames = [];
    this.filteredGames = [];
    this.currentFilter = '';
    this.sortDirection = 1;
    this.filteringByOwned = false;
    this.filteringByIgnored = false;
    this.extraPlayers = this.globals.totalPlayers - this.globals.players.length;

    for (let i = 0; i < this.globals.games.length; i++) {
      if (!this.globals.maxPlayers[i] || !this.globals.minPlayers[i]) {
        continue;
      }
      if (
        this.globals.maxPlayers[i] < this.globals.totalPlayers ||
        this.globals.minPlayers[i] > this.globals.totalPlayers
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
        ignored: (ignore + this.extraPlayers).toFixed(0),
        owners: this.globals.owners[i],
      };
      this.allowedGames.push(game);
    }

    this.filteredGames = this.allowedGames;
    this.sortBy('average');
  }

  filterDatatable(event) {
    const filter = event.target.value.toLowerCase();
    this.searchFilter(filter);
    this.currentFilter = filter;
  }

  searchFilter(filter) {
    if (filter === '') {
      this.filteredGames = this.allowedGames;
    } else {
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

  toggleOwned() {
    this.filteringByOwned = !this.filteringByOwned;
    this.filterByOwned();
  }

  sortBy(key) {
    this.sortKey = key;
    this.sort();
  }

  sort() {
    if (this.sortDirection === 0) {
      this.filteredGames = this.filteredGames.sort((a, b) => {
        const valA = a[this.sortKey];
        const valB = b[this.sortKey];
        return valA.localeCompare(valB, 'en', { numeric: true });
      });
      this.sortDirection++;
    } else if (this.sortDirection === 1) {
      this.filteredGames = this.filteredGames.sort((a, b) => {
        const valA = a[this.sortKey];
        const valB = b[this.sortKey];
        return valB.localeCompare(valA, 'en', { numeric: true });
      });
      this.sortDirection--;
    }
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
