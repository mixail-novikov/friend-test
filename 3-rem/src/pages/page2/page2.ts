import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html'
})
export class Page2 {
  plugins: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    const pluginsRow = [{
      icon: 'google-calendar',
      name: 'Google Calendar'
    }, {
      icon: 'weather',
      name: 'Weather'
    }, {
      icon: 'morning-exercises',
      name: 'Morning Exercises'
    }];

    this.plugins = Array.from({length: 5}).map(() => pluginsRow.slice());
  }
}
