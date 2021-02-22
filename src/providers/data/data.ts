import { Injectable } from '@angular/core';

import { UserModel as User } from "@models/user-model";
import { CompanyModel as Company } from "@models/company-model";

import { BankModel as Bank } from "@models/bank-model";
import { SettingsModel as Settings } from "@models/settings-model";

@Injectable()
export class DataProvider {

  private user: User;
  private banks: Array<Bank> = [];
  private company: Company;

  private currency: string = "VEF";

  setUser(user: any): void {
    let date = user.birthday.slice(0, 10).split("-");
    user.birthday = date[2]+"/"+date[1]+"/"+date[0];
    this.user = new User(
      user.id,
      user.firstname,
      user.lastname,
      user.nationality,
      user.document,
      user.birthday,
      user.address,
      user.phone_a,
      user.phone_b,
      user.country,
      user.state,
      user.zip,
      user.active,
      user.username,
      user.image,
      user.email,
      user.deletedAt,
      user.deletedReason,
      user.createdAt,
      user.updatedAt
    );
    this.setSettings(new Settings(
      user.settings ? !!user.settings.noti_payment_pending: false,
      user.settings ? !!user.settings.noti_payment_received: false,
      user.settings ? !!user.settings.check_transaction_pin: false,
      user.settings ? !!user.settings.check_user_device: false
    ));
	}

  setCompany(company: Company): void {
    this.company = new Company(
      company.id,
      company.name,
      company.rif,
      company.address,
      company.phone,
      company.email,
      company.country,
      company.state,
      company.zip,
      company.alias,
      company.image,
      company.createdAt,
      company.updatedAt
    );
  }

  setBanks(values: any): void {
    this.banks.length = 0;
    for(let bank of values) {
      this.banks.push(new Bank(bank.id, bank.code, bank.name, bank.alias, bank.color));
    }
  }

  setSettings(settings: Settings): void {
    this.user.settings = settings;
  }

  getBank(id: number): Bank {
    for (let bank of this.banks) {
      if(bank.id == id) {
        return bank;
      }
    } return null;
  }

  getBanks(): Bank[] {
    return this.banks;
  }

  getPercent(): number {
    return 1.00;
  }

  getSettings(): Settings {
    return this.user.settings;
  }

  getUserId(): number {
    return this.user.id;
  }

  getUserDocument(): string {
    return this.user ? this.user.nationality + '-'+ this.user.document : "V-12345678";
  }

  getUserName(): string {
    return this.user ? this.user.username : null;
  }

  getUserRealName(): string {
    return this.user.firstname + " " + this.user.lastname;
  }

  getUserShortName(): string {
    return this.user.firstname.split(" ")[0] + " " + this.user.lastname.split(" ")[0].charAt(0) + ".";
  }

  getUserFirstname(): string {
    return this.user.firstname;
  }

  getUserLastname(): string {
    return this.user.lastname;
  }

  getUserPhoneA(): string {
    return this.user.phoneA;
  }

  getUserPhoneB(): string {
    return this.user.phoneB;
  }

  getUserAddress(): string {
    return this.user.address;
  }

  getUserEmail(): string {
    return this.user.email;
  }

  getUserImage(): string {
    return `${this.user.image}.jpeg`;
  }

  getUserBirthday(): string {
    return this.user.birthday.slice(0, 19).replace('T', ' ');
  }

  getCompanyId(): number {
    return this.company ? this.company.id : null;
  }

  getCompanyName(): string {
    return this.company.name;
  }

  getCompanyRif(): string {
    return this.company ? this.company.rif : null;
  }

  getCompanyPhone(): string {
    return this.company.phone
  }

  getCompanyAddress(): string {
    return this.company.address
  }

  getCompanyEmail(): string {
    return this.company.email;
  }

  getCompanyAlias(): string {
    return this.company.alias;
  }

  getCompanyImage(): string {
    return `${this.company.image}.jpeg`;
  }

  /* MONEY */

  getCurrency(): string {
    return this.currency;
  }

  getCurrencySymbol(): string {
    switch (this.currency) {
      case 'VEF': default: return "BS";
      case 'USD': return "USD";
    }
  }

  setCurrency(currency: string): void {
    this.currency = currency;
  }

  getType(value: string, type?: string) {
    switch (type) {
      default:
        if (value == "S") return this.currency == 'USD' ? 'Saving' : 'Ahorro';
        else return this.currency == 'USD' ? 'Checking' : 'Corriente';
      case "card":
        if (value == "C") return this.currency == 'USD' ? 'Credit' : 'Crédito';
        else return this.currency == 'USD' ? 'Debit' : 'Débito';
    }
  }

}
