import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Platform } from 'ionic-angular';
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/v4";

import { DataProvider } from '../data/data';
import { Subject } from 'rxjs';
import { SERVER_URL } from '@app/config';

@Injectable()
export class FcmProvider {

  public eventListener: Subject<any>;

  constructor(
    private platform: Platform,
    public dataProvider: DataProvider,
    public http: HttpClient,
    private fcm: FCM
  ) {
    this.eventListener = new Subject<any>();

    this.platform.ready().then(() => {
      this.fcm.onNotification().subscribe((data) => {
        this.eventListener.next(data);
      });
      this.fcm.requestPushPermission();
    });
  }

  public getToken() {
    this.fcm.getToken().then((token: string) => {
      this.http.post(`${SERVER_URL}/store`, {
        metadata: token, user: this.dataProvider.getUserName()
      }).subscribe(data => {}, error => {});
    });
  }

}