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
  allPlayers = [];
  extraPlayers = 0;
  errorDisplay = 'none';

  constructor(private router: Router, globals: Globals) {
    this.globals = globals;
  }

  ionViewWillEnter() {
    if (this.globals.games.length === 0) {
      this.readExcel();
    }
  }

  process() {
    if (this.globals.totalPlayers === 0) {
      this.showError();
      return;
    }
    this.router.navigateByUrl('/results');
  }

  onChangeExtraPlayers(e) {
    this.extraPlayers = e.detail.value;
    this.globals.setTotalPlayers(this.extraPlayers);

    this.updateErrorMessage();
  }

  onChange(e) {
    this.players = e.detail.value;
    this.globals.setPlayers(this.players);
    this.globals.setTotalPlayers(this.extraPlayers);

    this.updateErrorMessage();
  }

  updateErrorMessage() {
    if (this.globals.totalPlayers > 0) {
      this.hideError();
    } else {
      this.showError();
    }
  }

  showError() {
    this.errorDisplay = 'block';
  }

  hideError() {
    this.errorDisplay = 'none';
  }

  readExcel() {
    const oReq = new XMLHttpRequest();
    oReq.open(
      'GET',
      'https://docs.google.com/spreadsheets/d/1VlPq-OnGEbIH6K-Azi_igEGTVZ4bI0DSLREn6Q0zR-E/export?format=xlsx&id=1VlPq-OnGEbIH6K-Azi_igEGTVZ4bI0DSLREn6Q0zR-E',
      true
    );
    oReq.responseType = 'arraybuffer';
    const that = this;
    oReq.onload = () => {
      const arraybuffer = oReq.response;
      const data = new Uint8Array(arraybuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; i++) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const workbook = XLSX.read(arr.join(''), { type: 'binary' });

      workbook.SheetNames.forEach((sheetName) => {
        const rowObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (sheetName === 'User Ratings') {
          const players = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            header: 1,
          })[0];

          that.globals.setAllPlayers(players);
          that.globals.allPlayers.shift();
          that.allPlayers = that.globals.allPlayers;

          rowObject.forEach((element: any) => {
            if (!element.Name) {
              return;
            }
            that.globals.addGame(element.Name);

            const score = [];
            for (const [index, player] of that.allPlayers.entries()) {
              if (element[that.allPlayers[index]] !== '') {
                if (typeof element[that.allPlayers[index]] === 'number') {
                  score.push(element[that.allPlayers[index]]);
                } else {
                  score.push(-1);
                }
              } else {
                score.push(-1);
              }
            }
            that.globals.addScore(score);
          });
        }

        if (sheetName === 'Board Games') {
          rowObject.forEach((element: any) => {
            if (!element.Name) {
              return;
            }

            that.globals.addMaxPlayers(element['Max players']);
            that.globals.addMinPlayers(element['Min players']);
            that.globals.addPlayingTime(element['Playing time']);
            that.globals.addOwnedBy(element['Owned by']);
          });
        }
      });
    };
    oReq.send();
  }
}
