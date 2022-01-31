import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../globals';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  globals: Globals;

  players = [];
  all_players = [];

  constructor(private router: Router, globals: Globals) {
    this.globals = globals;
    this.all_players = globals.all_players;
  }

  process() {
    if (this.players.length == 0) {
      this.show_error();
      return;
    }

    this.router.navigateByUrl('/results');
  }

  onChange(e) {
    this.players = e.detail.value;
    this.globals.setPlayers(this.players);
  }

  show_error() {}
}
