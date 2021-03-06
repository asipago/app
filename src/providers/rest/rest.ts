import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SERVER_URL } from "@app/config";

export interface walletFunds {
	funds: number;
	withheld: number;
}

@Injectable()
export class RestProvider {

	constructor(private readonly httpClient: HttpClient) { }

	async getFunds() {
		return await this.httpClient.get<walletFunds>(`${SERVER_URL}/wallets/funds`).toPromise();
	}

	async getSessionData() {
		return this.httpClient.get<any>(`${SERVER_URL}/auth/session`).toPromise();
	}

	async getWallets() {
		return this.httpClient.get<any>(`${SERVER_URL}/wallets/related`).toPromise();
	}

	async getUserPic(url: string) {
		return this.httpClient.get<any>(url).toPromise();
	}

	setPreferences(values: any) {
		return this.httpClient.post(`${SERVER_URL}/users/updateSettings`, values);
	}

	setFaio(value: boolean, device: any) {
		return this.httpClient.post(`${SERVER_URL}/users/updateFingerprint`, {
			allow: value, device: device
		});
	}

	/*setFingerprint(fingerprintBase64: string) {
		return this.httpClient.post(`${SERVER_URL}/users/updateFingerprint`, {
			fingerprint: fingerprintBase64
		});
	}*/

	setPictureProfile(imageBase64: string) {
		return this.httpClient.post(`${SERVER_URL}/avatar`, {
			image: imageBase64
		});
	}

	setUserProfile(phone_a: string, phone_b: string, email: string, address: string) {
		return this.httpClient.post(`${SERVER_URL}/users/update`, {
			phone_a: phone_a,
			phone_b: phone_b,
			email: email,
			address: address
		});
	}

	generateCode(username: string, smstype: string) {
		return this.httpClient.post(`${SERVER_URL}/auth/sendSms`, {
			user: username, type: smstype
		}, { responseType: 'json' });
	}

	/* SECURITY */

	setUserPassword(oldPassword: string, newPassword: string, conPassword: string) {
		return this.httpClient.post(`${SERVER_URL}/users/updatePassword`, {
			old_password: oldPassword,
			new_password: newPassword,
			con_password: conPassword
		});
	}

	/*setUserFingerPrint(oldFingerprint: string, newFingerprint: string, option: string) {
		return this.httpClient.post(`${SERVER_URL}/users/updateFingerprint`, {
		  old_fingerprint: oldFingerprint,
		  new_fingerprint: newFingerprint,
		  option: option
		});
	}*/

	checkUserPIN(pin: string) {
		return this.httpClient.post(`${SERVER_URL}/users/checkPin`, {
			pin_code: pin
		});
	}

	setUserPIN(oldPin: string, newPin: string, option: string) {
		return this.httpClient.post(`${SERVER_URL}/users/updatePin`, {
			old_pin: oldPin, new_pin: newPin, option: option
		});
	}

	/* BANKS */

	getBanks() {
		return this.httpClient.get(`${SERVER_URL}/banks/list`);
	}

	getBanksInfo() {
		return this.httpClient.get(`${SERVER_URL}/banks/info`);
	}

	getBankAccounts() {
		return this.httpClient.get(`${SERVER_URL}/banks/accounts`);
	}

	registerBankAccount(bank: number, account: string, code: string, type: string, email: string) {
		return this.httpClient.post(`${SERVER_URL}/banks/account`, {
			code: code,
			bank: bank,
			account: account,
			type: type,
			email: email
		});
	}

	removeBankAccount(code: string) {
		return this.httpClient.post(`${SERVER_URL}/banks/remove`, {
			account: code
		});
	}

	/* TRANSACTIONS */

	registerTransactionDeposit(bank: number, reference: string) {
		return this.httpClient.post(`${SERVER_URL}/transactions/deposit`, {
			reference: reference,
			channel: "APP",
			bank: bank
		});
	}

	registerTransactionWithdraw(bank: number, amount: number, account: number) {
		return this.httpClient.post(`${SERVER_URL}/transactions/Withdraw`, {
			account: account,
			amount: amount,
			channel: "APP",
			bank: bank
		});
	}

	reloadMobileBalance(carrier: string, number: string, value: number, geolocation?: string) {
		return this.httpClient.post(`${SERVER_URL}/numbers/balance`, {
			location: geolocation,
			carrier: carrier,
			phone: number,
			amount: value,
			channel: "APP"
		});
	}

	/* COUNTS */

	/* LINKS */

	getLink(code: string) {
		return this.httpClient.get(`${SERVER_URL}/links/search`, {
			params: {
				code: code
			}
		});
	}

	getLinksCount() {
		return this.httpClient.get(`${SERVER_URL}/links/count`);
	}

	getLinksPendingSend() {
		return this.httpClient.get(`${SERVER_URL}/links/list`, {
			params: {
				filter: "GEN",
				enabled: "true",
				type: "OUT"
			}
		});
	}

	getLinksPendingReceive() {
		return this.httpClient.get(`${SERVER_URL}/links/list`, {
			params: {
				filter: "GEN",
				enabled: "true",
				type: "IN"
			}
		});
	}

	getLinksPendingPayment() {
		return this.httpClient.get(`${SERVER_URL}/links/list`, {
			params: {
				filter: "REC",
				enabled: "true",
				type: "IN"
			}
		});
	}

	generateSendLink(amount: number, secure: boolean, concept: string, pin: string) {
		return this.httpClient.post(`${SERVER_URL}/links`, {
			type: "OUT",
			amount: amount,
			concept: concept,
			secure: secure,
			pin: pin
		});
	}

	generateReceiveLink(amount: number, secure: boolean, concept?: string, user?: string) {
		return this.httpClient.post(`${SERVER_URL}/links`, {
			type: "IN",
			amount: amount,
			concept: concept,
			secure: secure,
			user_to: user || null
		});
	}

	processLink(code: string, pin: string, location: string, qr?: boolean) {
		return this.httpClient.post(`${SERVER_URL}/links/process`, {
			channel: "APP", code: code, pin: pin, qr: qr, location: location
		});
	}

	removeLink(code: string) {
		return this.httpClient.post(`${SERVER_URL}/links/remove`, {
			code: code
		});
	}

	/* MOVEMENTS */

	getMovements(from?: string, to?: string) {
		const filterDate = typeof from !== 'undefined' && typeof to !== 'undefined';
		return this.httpClient.get(`${SERVER_URL}/movements/details`, {
			params: filterDate ? {
				from: from,
				to: to
			} : {}
		});
	}

	getMovementsAverage(days?: number) {
		return this.httpClient.get(`${SERVER_URL}/movements/average`, {
			params: {
				days: days.toString()
			}
		});
	}

	generateSendMovement(amount: number, type: string, document: string, concept: string, geolocation: string, pin: string, fromQR?: boolean) {
		return this.httpClient.post(`${SERVER_URL}/wallets/send`, {
			amount: amount,
			concept: concept,
			type: type,
			doc: document,
			location: geolocation,
			channel: "APP",
			rel: fromQR,
			pin: pin
		});
	}

	/* SEARCH */

	findCompanyByDocument(document: string) {
		return this.httpClient.get(`${SERVER_URL}/companies/findByRif`, {
			params: {
				rif: document
			}
		});
	}

	findUserByEmail(email: string) {
		return this.httpClient.get(`${SERVER_URL}/users/findByEmail`, {
			params: {
				email: email
			}
		});
	}

	findUserByDocument(type: string, document: string) {
		return this.httpClient.get(`${SERVER_URL}/users/findByDocument`, {
			params: {
				type: type, document: document
			}
		});
	}

	findUserByPhoneNumber(number: string) {
		return this.httpClient.get(`${SERVER_URL}/users/findByNumber`, {
			params: {
				phone: number
			}
		});
	}

	findUserByNickname(nickname: string) {
		return this.httpClient.post(`${SERVER_URL}/users/findByUsername`, {
			username: nickname
		})
	}

	findTransactionMovement(bank: number, reference: string) {
		return this.httpClient.post(`${SERVER_URL}/transactions/reference`, {
			reference: reference,
			bank: bank
		})
	}

	filterContacts(values: string[]) {
		return this.httpClient.post(`${SERVER_URL}/users/filterNumbers`, {
			list: values.join(",")
		});
	}

	/* SETTINGS */

	async getRate(value: string) {
		return this.httpClient.post(`${SERVER_URL}/settings/rate`, {
			currency: value
		}).toPromise();
	}
}