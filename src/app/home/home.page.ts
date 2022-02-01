import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../globals';
import * as XLSX from 'xlsx';
import { element } from 'protractor';

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
  }

  ionViewWillEnter() {
    this.readExcel();
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

  readExcel() {
    let oReq = new XMLHttpRequest();
    oReq.open('GET', './assets/Board Games Ratings.xlsx', true);
    oReq.responseType = 'arraybuffer';
    let that = this;
    oReq.onload = function (e) {
      let arraybuffer = oReq.response;
      let data = new Uint8Array(arraybuffer);
      let arr = new Array();
      for (let i = 0; i != data.length; i++) {
        arr[i] = String.fromCharCode(data[i]);
      }
      let workbook = XLSX.read(arr.join(''), { type: 'binary' });

      workbook.SheetNames.forEach(function (sheetName) {
        var XL_row_object = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheetName]
        );

        if (sheetName == 'User Ratings') {
          let players = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            header: 1,
          })[0];

          that.globals.setAllPlayers(players);
          that.globals.all_players.shift();
          that.all_players = that.globals.all_players;

          XL_row_object.forEach((element) => {
            if (!element['Name']) return;
            that.globals.addGame(element['Name']);

            for (let i = 0; i < that.all_players.length; i++) {
              let score = [];
              if (element[that.all_players[i]]) {
                if (typeof element[that.all_players[i]] == 'number') {
                  score.push(element[that.all_players[i]]);
                } else {
                  score.push('-1');
                }
              } else {
                score.push('-1');
              }

              that.globals.addScore(score);
            }
          });
        }
      });
    };
    oReq.send();
  }
}
