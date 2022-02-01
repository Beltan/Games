import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../globals';
import * as XLSX from 'xlsx';

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

  show_error() {
    this.readExcel();
  }

  readExcel() {
    let oReq = new XMLHttpRequest();
    oReq.open('GET', './assets/Board Games Ratings.xlsx', true);
    oReq.responseType = 'arraybuffer';
    oReq.onload = function (e) {
      let arraybuffer = oReq.response;
      let data = new Uint8Array(arraybuffer);
      let arr = new Array();
      for (let i = 0; i != data.length; i++) {
        arr[i] = String.fromCharCode(data[i]);
      }
      let workbook = XLSX.read(arr.join(''), { type: 'binary' });

      workbook.SheetNames.forEach(function (sheetName) {
        // Here is your object
        var XL_row_object = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheetName]
        );
        var json_object = JSON.stringify(XL_row_object);
        console.log(json_object);
      });
    };
    oReq.send();
  }
}
