import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';

import { SERVER_URL } from '@app/config';
import { DataProvider } from '../data/data';

@Injectable()
export class FcmProvider {

  constructor(
  	private platform: Platform,
  	public dataProvider: DataProvider,
	  public firebaseNative:Firebase,
    public http: HttpClient
  ) {}

  async getToken() {
    let token;

    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken()
    }

    if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    }

    this.http.post(`${SERVER_URL}/store`, {
    	metadata: token, user: this.dataProvider.getUserName()
    }).subscribe(data => {}, error => {});
  }

  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen()
  }
}