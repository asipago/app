import { Component } from '@angular/core';
import { IonicPage, Platform, ViewController, NavController, NavParams } from 'ionic-angular';

import { Storage } from "@ionic/storage";

import { Contacts, Contact } from '@ionic-native/contacts';
import { SocialSharing } from '@ionic-native/social-sharing';

import { DataProvider } from "@providers/data/data";
import { RestProvider } from "@providers/rest/rest";

import { SERVER_URL, CONTACT_LIST, CONTACT_FLIST } from "@app/config";

@IonicPage()
@Component({
  selector: 'page-view-contacts',
  templateUrl: 'view-contacts.html'
})
export class ViewContactsPage {

  public contactList = [];
  public showOnlyRegistered: boolean;

  public isLoading: boolean;
  public loadingText: string;

  public avatarUrl: string;
  public timestamp: number;

  private filterCarrier: string;
  private selectedCarrier: string;

  constructor(
    public storage: Storage,
    public platform: Platform,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private readonly contacts: Contacts,
    public readonly restProvider: RestProvider,
    private socialSharing: SocialSharing,
    public readonly dataProvider: DataProvider
  ) {
    this.selectedCarrier = navParams.get('carrier');
    this.filterCarrier = navParams.get('filterCarrier');
    this.showOnlyRegistered = navParams.get('filterContacts');

    this.avatarUrl = `${SERVER_URL}/avatar/p_`;
    this.timestamp = new Date().getTime();

    this.isLoading = true;
    this.loadingText = "Cargando";

    this.loadContacts();
  }

  private async loadContacts() {
    const contactList = await this.storage.get(CONTACT_LIST);
    if (contactList) {
      this.contactList = JSON.parse(contactList);
      if (this.filterCarrier) this.filterCarrierList();
      this.isLoading = this.showOnlyRegistered;
      if (this.showOnlyRegistered) {
        const contactListF = await this.storage.get(CONTACT_FLIST);
        if (contactListF) {
          this.contactList = JSON.parse(contactListF);
          this.isLoading = false;
        } else {
          this.filterContacts();
        }
      }
    } else {
      this.refresh();
    }
  }

  private filterSelectedCarrier(contact: any) {
    if (contact.number.match(/^(\+58)?[\D]?\(?0?(412|414|424|416|426)/)) {
      switch (this.selectedCarrier) {
        case 'movistar': return contact.number.match(/^(\+58)?[\D]?\(?0?(414|424)/);
        case 'digitel': return contact.number.match(/^(\+58)?[\D]?\(?0?(412)/);
        case 'movilnet': return contact.number.match(/^(\+58)?[\D]?\(?0?(416|426)/);
      }
    } else if (contact.number.match(/^(412|414|424|416|426)/)) {
      switch (this.selectedCarrier) {
        case 'movistar': return contact.number.match(/^(414|424)/);
        case 'digitel': return contact.number.match(/^(412)/);
        case 'movilnet': return contact.number.match(/^(416|426)/);
      }
    }
  }

  private filterContacts() {
    this.loadingText = "Sincronizando"

    //let values: any[] = [];
    let newContactList = [];
    
    /*for (let contact of this.contactList) {
      values.push(contact["number"]);
    }*/

    let values = this.contactList.map(a => a.number);

    this.restProvider
      .filterContacts(values)
      .subscribe((phones: any) => {
        this.contactList.forEach((contact, index) => {
          if (phones.indexOf(contact.number) > -1)
            newContactList.push(contact);
        });
        
        this.isLoading = false
        //this.contactList = newContactList;
    
        this.contactList = newContactList.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
        this.storage.set(CONTACT_FLIST, JSON.stringify(this.contactList));

      }, err => this.isLoading = false);
  }

  private formatNumber(phone: string, onlyNumbers: boolean) {
    phone = phone.replace(/^(\+58)?[\D]?\(?0?/, '');
    phone = phone.replace(/\D/g, '');
    return onlyNumbers ? phone : phone.replace(/^(\d{3})(\d{3})(\d{4}).*/, '($1) $2-$3');
  }

  private filterCarrierList() {
    let filterList = [];
    this.contactList.forEach(contact => {
      if(this.filterSelectedCarrier(contact)) {
        filterList.push(contact);
      }
    });
    this.contactList = filterList;
  }

  refresh() {
    this.loadingText = "Cargando...";
    this.contactList.length = 0;
    
    this.contacts.find(["displayName", "name", "phoneNumbers"], {
      multiple: true, hasPhoneNumber: true
    }).then(async (contacts: Contact[]) => {
      for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].phoneNumbers == null || contacts[i].phoneNumbers == undefined || contacts[i].phoneNumbers.length == 0) {
          //Do nothing
        } else if (contacts[i].name == undefined || contacts[i].name.formatted == undefined || contacts[i].name.formatted == null || contacts[i].name.formatted == '') {
          //Do nothing
        } else {
          for (let number of contacts[i].phoneNumbers) {
            let contact: any = {};

            contact["name"] = contacts[i].name.formatted;
            //contact["name"] = contacts[i].displayName == "" ? contacts[i].name.formatted : contacts[i].displayName;
            //contact["phone"] = number.value;
            contact["phone"] = this.formatNumber(number.value, false);
            contact["number"] = this.formatNumber(number.value, true);

            const imageUrl = this.avatarUrl + contact.number + "?" + this.timestamp;
            const image = await this.storage.get("user_image_" + contact.number);

            contact["image"] = !image ? imageUrl : image;

            this.toDataUrl(imageUrl, "user_image_" + contact.number);
            
            this.contactList.push(contact);
          }

          this.storage.set(CONTACT_LIST, JSON.stringify(this.contactList));
        }
      }

      if (this.filterCarrier)
        this.filterCarrierList();

      this.isLoading = this.showOnlyRegistered;
      if (this.showOnlyRegistered) {
        this.filterContacts();
      }
    });
  }

  selectContact(item) {
    this.viewCtrl.dismiss(item);
  }

  shareLink() {
    let link = "app.asipago.com";

    if (this.platform.is('android')) {
      link = "https://play.google.com/store/apps/details?id=com.asipago.app";
    } else if (this.platform.is('ios')) {
      link = "https://www.asipago.com/";
    } else if (this.platform.is('windows')) {
      link = "https://www.asipago.com/";
    }

    const username = this.dataProvider.getUserName();
    this.socialSharing.share(`${username} te ha invitado a utilizar asipago. Recibe, procesa y envía dinero, ¡donde y cuando quieras!`, null, null, link);
  }

  private async toDataUrl(url: string, key: string) {
    const response = await this.restProvider.getUserPic(url);

    const toDownload: Blob = new Blob(
      [ response.arrayBuffer() ],
      { type: 'image/png' }
    );

    //return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        //const dataUrl: any = reader.result;
        //resolve(dataUrl.split(',')[1]);
        this.storage.set(key, reader.result);
      };
      reader.readAsDataURL(toDownload)
    //});
  }
}
