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
  baseScores;

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
    this.baseScores = true;

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

      let baseMax = -1;
      let relativeMax = -1;
      let baseMin = 11;
      let relativeMin = 99999999;
      let baseAvg = 0;
      let relativeAvg = 0;
      let ignore = 0;

      for (const player of this.globals.players) {
        const playerIndex = this.globals.allPlayers.indexOf(player);

        const currentBaseScore = this.globals.baseScores[i][playerIndex];
        const currentRelativeScore =
          this.globals.relativeScores[i][playerIndex];

        if (currentBaseScore === -1) {
          ignore++;
          continue;
        }

        baseAvg += currentBaseScore;
        relativeAvg += currentRelativeScore;

        if (currentBaseScore < baseMin) {
          baseMin = currentBaseScore;
        }
        if (currentBaseScore > baseMax) {
          baseMax = currentBaseScore;
        }

        if (currentRelativeScore < relativeMin) {
          relativeMin = currentRelativeScore;
        }
        if (currentRelativeScore > relativeMax) {
          relativeMax = currentRelativeScore;
        }
      }

      const knownPlayers = this.globals.players.length - ignore;
      if (knownPlayers > 0) {
        baseAvg = baseAvg / knownPlayers;
        relativeAvg = relativeAvg / knownPlayers;
      } else {
        baseAvg = -1;
        relativeAvg = -1;
      }

      let baseSumSquares = 0;
      let relativeSumSquares = 0;
      for (const player of this.globals.players) {
        const playerIndex = this.globals.allPlayers.indexOf(player);

        const currentBaseScore = this.globals.baseScores[i][playerIndex];
        const currentRelativeScore =
          this.globals.relativeScores[i][playerIndex];

        if (currentBaseScore === -1) {
          continue;
        }

        const baseDiff = baseAvg - currentBaseScore;
        baseSumSquares += baseDiff * baseDiff;

        const relativeDiff = relativeAvg - currentRelativeScore;
        relativeSumSquares += relativeDiff * relativeDiff;
      }

      let baseVariance = -1;
      let relativeVariance = -1;
      if (knownPlayers > 0) {
        baseVariance = baseSumSquares / knownPlayers;
        relativeVariance = relativeSumSquares / knownPlayers;
      }

      const game = {
        name: this.globals.games[i],
        baseAverage: baseAvg !== -1 ? baseAvg.toFixed(2) : '-',
        relativeAverage: relativeAvg !== -1 ? relativeAvg.toFixed(2) : '-',
        baseMaximum: baseMax,
        relativeMaximum: relativeMax,
        baseMinimum: baseMin,
        relativeMinimum: relativeMin,
        baseVariance: baseVariance !== -1 ? baseVariance.toFixed(2) : '-',
        relativeVariance:
          relativeVariance !== -1 ? relativeVariance.toFixed(2) : '-',
        ignored: (ignore + this.extraPlayers).toFixed(0),
        owners: this.globals.owners[i],
      };
      this.allowedGames.push(game);
    }

    this.filteredGames = this.allowedGames;
    this.sortBy('baseAverage');
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

  toggleScores() {
    this.baseScores = !this.baseScores;
    this.reverseSortDirection();

    switch (this.sortKey) {
      case 'baseAverage':
        this.sortBy('relativeAverage');
        break;
      case 'baseVariance':
        this.sortBy('relativeVariance');
        break;
      case 'relativeAverage':
        this.sortBy('baseAverage');
        break;
      case 'relativeVariance':
        this.sortBy('baseVariance');
        break;
      default:
        this.reverseSortDirection();
        break;
    }
  }

  reverseSortDirection() {
    if (this.sortDirection === 0) {
      this.sortDirection++;
    } else if (this.sortDirection === 1) {
      this.sortDirection--;
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
