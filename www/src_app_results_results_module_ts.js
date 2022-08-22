"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_results_results_module_ts"],{

/***/ 4528:
/*!***************************************************!*\
  !*** ./src/app/results/results-routing.module.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ResultsPageRoutingModule": () => (/* binding */ ResultsPageRoutingModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 8806);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 4001);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 3252);
/* harmony import */ var _results_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./results.page */ 2435);




const routes = [
    {
        path: '',
        component: _results_page__WEBPACK_IMPORTED_MODULE_0__.ResultsPage
    }
];
let ResultsPageRoutingModule = class ResultsPageRoutingModule {
};
ResultsPageRoutingModule = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule)({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule],
    })
], ResultsPageRoutingModule);



/***/ }),

/***/ 5442:
/*!*******************************************!*\
  !*** ./src/app/results/results.module.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ResultsPageModule": () => (/* binding */ ResultsPageModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 8806);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 4001);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 8267);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 8346);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 8099);
/* harmony import */ var _results_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./results-routing.module */ 4528);
/* harmony import */ var _results_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./results.page */ 2435);







let ResultsPageModule = class ResultsPageModule {
};
ResultsPageModule = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.NgModule)({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormsModule,
            _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonicModule,
            _results_routing_module__WEBPACK_IMPORTED_MODULE_0__.ResultsPageRoutingModule
        ],
        declarations: [_results_page__WEBPACK_IMPORTED_MODULE_1__.ResultsPage]
    })
], ResultsPageModule);



/***/ }),

/***/ 2435:
/*!*****************************************!*\
  !*** ./src/app/results/results.page.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ResultsPage": () => (/* binding */ ResultsPage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! tslib */ 8806);
/* harmony import */ var _home_alpha_Projects_games_node_modules_ngtools_webpack_src_loaders_direct_resource_js_results_page_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !./node_modules/@ngtools/webpack/src/loaders/direct-resource.js!./results.page.html */ 7377);
/* harmony import */ var _results_page_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./results.page.scss */ 4509);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 4001);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 3252);
/* harmony import */ var _globals__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../globals */ 7130);






let ResultsPage = class ResultsPage {
    constructor(router, globals) {
        this.router = router;
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
        for (let i = 0; i < this.globals.games.length; i++) {
            if (!this.globals.maxPlayers[i] || !this.globals.minPlayers[i]) {
                continue;
            }
            if (this.globals.maxPlayers[i] < this.globals.players.length ||
                this.globals.minPlayers[i] > this.globals.players.length) {
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
            }
            else {
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
                ignored: ignore.toFixed(0),
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
        }
        else if (this.sortDirection === 1) {
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
                if (game.owners[0] === 'All' ||
                    this.globals.players.filter((value) => game.owners.includes(value))
                        .length !== 0) {
                    return game;
                }
            });
        }
        else {
            this.searchFilter(this.currentFilter);
        }
    }
};
ResultsPage.ctorParameters = () => [
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__.Router },
    { type: _globals__WEBPACK_IMPORTED_MODULE_2__.Globals }
];
ResultsPage = (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.Component)({
        selector: 'app-results',
        template: _home_alpha_Projects_games_node_modules_ngtools_webpack_src_loaders_direct_resource_js_results_page_html__WEBPACK_IMPORTED_MODULE_0__["default"],
        styles: [_results_page_scss__WEBPACK_IMPORTED_MODULE_1__]
    })
], ResultsPage);



/***/ }),

/***/ 7377:
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@ngtools/webpack/src/loaders/direct-resource.js!./src/app/results/results.page.html ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<ion-content>\n  <div class=\"container\">\n    <div id=\"inputs\">\n      <input\n        type=\"text\"\n        placeholder=\"Search...\"\n        (keyup)=\"filterDatatable($event)\"\n      />\n      <ion-item lines=\"none\">\n        <ion-label>Owned</ion-label>\n        <ion-checkbox (ionChange)=\"toggleOwned()\" slot=\"start\"></ion-checkbox>\n      </ion-item>\n    </div>\n  </div>\n\n  <ion-row class=\"header-row\">\n    <ion-col size=\"4\" class=\"center-text\" (click)=\"sortBy('name')\">\n      <ion-item lines=\"none\" class=\"ion-text-center\">\n        <ion-label>Name</ion-label>\n        <ion-icon\n          name=\"arrow-down\"\n          *ngIf=\"sortDirection === 0 && sortKey === 'name'\"\n        ></ion-icon>\n        <ion-icon\n          name=\"arrow-up\"\n          *ngIf=\"sortDirection === 1 && sortKey === 'name'\"\n        ></ion-icon>\n      </ion-item>\n    </ion-col>\n    <ion-col size=\"2\" class=\"center-text\" (click)=\"sortBy('ignored')\">\n      <ion-item lines=\"none\" class=\"ion-text-center\">\n        <ion-label>Ign</ion-label>\n        <ion-icon\n          name=\"arrow-down\"\n          *ngIf=\"sortDirection === 0 && sortKey === 'ignored'\"\n        ></ion-icon>\n        <ion-icon\n          name=\"arrow-up\"\n          *ngIf=\"sortDirection === 1 && sortKey === 'ignored'\"\n        ></ion-icon>\n      </ion-item>\n    </ion-col>\n    <ion-col size=\"3\" class=\"center-text\" (click)=\"sortBy('average')\">\n      <ion-item lines=\"none\" class=\"ion-text-center\">\n        <ion-label>Avg</ion-label>\n        <ion-icon\n          name=\"arrow-down\"\n          *ngIf=\"sortDirection === 0 && sortKey === 'average'\"\n        ></ion-icon>\n        <ion-icon\n          name=\"arrow-up\"\n          *ngIf=\"sortDirection === 1 && sortKey === 'average'\"\n        ></ion-icon>\n      </ion-item>\n    </ion-col>\n    <ion-col size=\"3\" class=\"center-text\" (click)=\"sortBy('variance')\">\n      <ion-item lines=\"none\" class=\"ion-text-center\">\n        <ion-label>Var</ion-label>\n        <ion-icon\n          name=\"arrow-down\"\n          *ngIf=\"sortDirection === 0 && sortKey === 'variance'\"\n        ></ion-icon>\n        <ion-icon\n          name=\"arrow-up\"\n          *ngIf=\"sortDirection === 1 && sortKey === 'variance'\"\n        ></ion-icon>\n      </ion-item>\n    </ion-col>\n  </ion-row>\n  <ion-row *ngFor=\"let row of filteredGames; let i = index;\" class=\"data-row\">\n    <ion-col size=\"4\"> {{ row.name }} </ion-col>\n    <ion-col size=\"2\" class=\"center-text\"> {{ row.ignored }} </ion-col>\n    <ion-col size=\"3\" class=\"center-text\"> {{ row.average }} </ion-col>\n    <ion-col size=\"3\" class=\"center-text\"> {{ row.variance }} </ion-col>\n  </ion-row>\n</ion-content>\n");

/***/ }),

/***/ 4509:
/*!*******************************************!*\
  !*** ./src/app/results/results.page.scss ***!
  \*******************************************/
/***/ ((module) => {

module.exports = ".container {\n  width: 100%;\n  background-color: #9DC6C6;\n}\n\n#inputs {\n  display: flex;\n  justify-content: space-between;\n  padding: 10px 5px;\n}\n\nion-checkbox {\n  margin: 0px 5px;\n}\n\nion-label {\n  margin: 0px;\n}\n\nion-item {\n  --min-height: 30px;\n  --inner-padding-end: 0px;\n  --color: #fff;\n  --ion-item-background: $results-background-color;\n  font-weight: bold;\n}\n\n.header-row {\n  background-color: #9DC6C6;\n}\n\n.data-row {\n  border-top: 1px solid #ddd;\n  border-bottom: 1px solid #ddd;\n}\n\n.data-row:nth-child(even) {\n  background-color: #f2f2f2;\n}\n\n.center-text {\n  text-align: center;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc3VsdHMucGFnZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQ0UsV0FBQTtFQUNBLHlCQUp5QjtBQUczQjs7QUFJQTtFQUNFLGFBQUE7RUFDQSw4QkFBQTtFQUNBLGlCQUFBO0FBREY7O0FBSUE7RUFDRSxlQUFBO0FBREY7O0FBSUE7RUFDRSxXQUFBO0FBREY7O0FBSUE7RUFDRSxrQkFBQTtFQUNBLHdCQUFBO0VBQ0EsYUFBQTtFQUNBLGdEQUFBO0VBRUEsaUJBQUE7QUFGRjs7QUFLQTtFQUNFLHlCQS9CeUI7QUE2QjNCOztBQUtBO0VBQ0UsMEJBQUE7RUFDQSw2QkFBQTtBQUZGOztBQUtBO0VBQ0UseUJBQUE7QUFGRjs7QUFLQTtFQUNFLGtCQUFBO0FBRkYiLCJmaWxlIjoicmVzdWx0cy5wYWdlLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIkcmVzdWx0cy1iYWNrZ3JvdW5kLWNvbG9yOiAjOURDNkM2O1xuXG4uY29udGFpbmVyIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGJhY2tncm91bmQtY29sb3I6ICRyZXN1bHRzLWJhY2tncm91bmQtY29sb3I7XG59XG5cbiNpbnB1dHMge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIHBhZGRpbmc6IDEwcHggNXB4O1xufVxuXG5pb24tY2hlY2tib3gge1xuICBtYXJnaW46IDBweCA1cHg7XG59XG5cbmlvbi1sYWJlbCB7XG4gIG1hcmdpbjogMHB4O1xufVxuXG5pb24taXRlbSB7XG4gIC0tbWluLWhlaWdodDogMzBweDtcbiAgLS1pbm5lci1wYWRkaW5nLWVuZDogMHB4O1xuICAtLWNvbG9yOiAjZmZmO1xuICAtLWlvbi1pdGVtLWJhY2tncm91bmQ6ICRyZXN1bHRzLWJhY2tncm91bmQtY29sb3I7XG5cbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG59XG5cbi5oZWFkZXItcm93IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHJlc3VsdHMtYmFja2dyb3VuZC1jb2xvcjtcbn1cblxuLmRhdGEtcm93IHtcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNkZGQ7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZGRkO1xufVxuXG4uZGF0YS1yb3c6bnRoLWNoaWxkKGV2ZW4pIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2YyZjJmMjtcbn1cblxuLmNlbnRlci10ZXh0IHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufSJdfQ== */";

/***/ })

}]);
//# sourceMappingURL=src_app_results_results_module_ts.js.map