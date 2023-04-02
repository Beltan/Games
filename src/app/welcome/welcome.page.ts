import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Globals } from '../globals';
import { StorageService } from '../storage';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage {
  globals: Globals;
  id: string;
  errorDisplay = 'none';
  errorMessage = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storage: StorageService,
    globals: Globals
  ) {
    this.globals = globals;
  }

  ionViewWillEnter() {
    this.route.queryParams.subscribe(async (params) => {
      const id = params.id;
      const error = params.error;

      if (id) {
        await this.storage.set('id', id);
      }

      const savedId = await this.storage.get('id');

      if (savedId) {
        this.router.navigateByUrl('/home');
      }

      if (error) {
        this.errorMessage = 'ID not found';
        this.showError();

        this.router.navigate([], {
          queryParams: {
            error: null,
          },
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  process() {
    if (!this.id) {
      this.errorMessage = 'Enter an ID';
      this.showError();
      return;
    }

    this.globals.setId(this.id);
    this.router.navigateByUrl('/home');
  }

  showError() {
    this.errorDisplay = 'block';
  }

  hideError() {
    this.errorDisplay = 'none';
  }
}
