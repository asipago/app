import { Component } from '@angular/core';
import { IonicPage, Platform, ViewController, NavController, NavParams } from 'ionic-angular';

import { Storage } from "@ionic/storage";

import { Contacts, Contact } from '@ionic-native/contacts';
import { SocialSharing } from '@ionic-native/social-sharing';

import { DataProvider } from "@providers/data/data";
import { RestProvider } from "@providers/rest/rest";

import { CONTACT_LIST_ASIPAGO, HOSTING_URL } from "@app/config";

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

  //public avatarUrl: string;
  //public timestamp: number;

  private filterCarrier: string;
  private selectedCarrier: string;

  public alreadySync: boolean;

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

    this.isLoading = true;
    this.loadingText = "Cargando";

    this.alreadySync = true;
    this.preloadContacts();
  }

  private async preloadContacts() {
    if (this.showOnlyRegistered) {
      const contactList = await this.storage.get(CONTACT_LIST_ASIPAGO);
      if (contactList) {
        this.contactList = JSON.parse(contactList);
        this.alreadySync = true;
      } this.isLoading = false;
    } else {
      this.loadContacts();
    }
  }

  private async loadContacts() {
    const self = this;
    
    this.loadingText = "Cargando...";
    this.contactList.length = 0;

    setTimeout(() => {
      self.loadingText = "Recuerda que la primera carga puede demorar un poco mas de lo esperado, por favor se paciente..."
    }, 5000);

    this.contacts.find(["displayName", "name", "phoneNumbers"], {
      multiple: true, hasPhoneNumber: true
    }).then(async (contacts: Contact[]) => {
      for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].phoneNumbers == null || contacts[i].phoneNumbers == undefined || contacts[i].phoneNumbers.length == 0 ||
          contacts[i].name == undefined || contacts[i].name.formatted == undefined || contacts[i].name.formatted == null || contacts[i].name.formatted == '') {
          //Do nothing
        } else {
          for (let number of contacts[i].phoneNumbers) {
            let contact: any = {};

            contact["name"] = contacts[i].name.formatted;
            //contact["name"] = contacts[i].displayName == "" ? contacts[i].name.formatted : contacts[i].displayName;
            //contact["phone"] = number.value;
            contact["phone"] = this.formatNumber(number.value, false);
            contact["number"] = this.formatNumber(number.value, true);

            contact["image"] = await this.storage.get("user_image_" + contact.number);

            if (!contact["image"] || typeof contact["image"] == 'undefined') {
              contact["image"] = await this.restProvider.getUserProfileUrl(contact["number"]);
              await this.storage.set("user_image_" + contact.number, contact["image"]);
            }

            this.contactList.push(contact);
          }
        }
      }

      if (this.filterCarrier) {
        let filterList = [];
        for (const contact of this.contactList) {
          if (this.filterSelectedCarrier(`${contact.number}`))
            filterList.push(contact);
        }
        this.contactList = filterList;
      }

      this.isLoading = this.showOnlyRegistered;
    });
  }

  private filterSelectedCarrier(number: string) {
    if (number.match(/^(\+58)?[\D]?\(?0?(412|414|424|416|426)/)) {
      switch (this.selectedCarrier) {
        case 'movistar': return number.match(/^(\+58)?[\D]?\(?0?(414|424)/);
        case 'digitel': return number.match(/^(\+58)?[\D]?\(?0?(412)/);
        case 'movilnet': return number.match(/^(\+58)?[\D]?\(?0?(416|426)/);
      }
    } else if (number.match(/^(412|414|424|416|426)/)) {
      switch (this.selectedCarrier) {
        case 'movistar': return number.match(/^(414|424)/);
        case 'digitel': return number.match(/^(412)/);
        case 'movilnet': return number.match(/^(416|426)/);
      }
    }
  }

  private formatNumber(phone: string, onlyNumbers: boolean) {
    phone = phone.replace(/^(\+58)?[\D]?\(?0?/, '');
    phone = phone.replace(/\D/g, '');
    phone = phone.replace(/^0+/, '');
    return onlyNumbers ? phone : phone.replace(/^(\d{3})(\d{3})(\d{4}).*/, '($1) $2-$3');
  }

  async refresh() {    
    this.loadContacts();
    if (this.showOnlyRegistered) {
      const self = this;
      this.loadingText = "Sincronizando";

      setTimeout(() => self.loadingText = "Finalizando", 5000);
 
      let values = this.contactList.map(a => a.number);
  
      this.restProvider
        .filterContacts(values)
        .subscribe((users: any) => {
          let contactList = []; 

          this.contactList.forEach((contact, index) => {
            for (let i = 0; i < users.length; i++) {
              const user = users[i];
              if (user.phone.indexOf(contact.number) > -1) {
                contact.image = user.image;
                contactList.push(contact);
              }
            }
          });
  
          this.isLoading = false;
          this.alreadySync = true;
  
          this.contactList.length = 0;
          //this.contactList = contactList;
          this.contactList = contactList.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);

          this.storage.set(CONTACT_LIST_ASIPAGO, JSON.stringify(contactList));
  
        }, err => this.isLoading = false);
    }
  }

  shareLink() {
    let link = HOSTING_URL;

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

}
