/*
 * Copyright (c) 2016-2018  Moddable Tech, Inc.
 *
 *   This file is part of the Moddable SDK.
 * 
 *   This work is licensed under the
 *       Creative Commons Attribution 4.0 International License.
 *   To view a copy of this license, visit
 *       <http://creativecommons.org/licenses/by/4.0>.
 *   or send a letter to Creative Commons, PO Box 1866,
 *   Mountain View, CA 94042, USA.
 *
 */
 /*
	https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.service.health_thermometer.xml
	https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.characteristic.temperature_measurement.xml
 */

import BLEServer from "bleserver";
import {uuid} from "btutils";
import {IOCapability} from "sm";
import Timer from "timer";

const DEVICE_NAME = "LINE Things Trial M5Stack"
// User service UUID: Change this to your generated service UUID
const USER_SERVICE_UUID = "91E4E176-D0B9-464D-9FE4-52EE3E9F1552"
// User service characteristics
const WRITE_CHARACTERISTIC_UUID = "E9062E71-9E62-4BC6-B0D3-35CDCD9B027B"
const NOTIFY_CHARACTERISTIC_UUID = "62FBD229-6EDD-4D1A-B554-5C4E1BB29169"

// PSDI Service UUID: Fixed value for Developer Trial
const PSDI_SERVICE_UUID = "E625601E-9E55-4597-A598-76018A0D293D"
const PSDI_CHARACTERISTIC_UUID = "26E2B12B-85F0-4F3F-9FDD-91D114270E6E"

class SecureHealthThermometerServer extends BLEServer {
	onReady() {
		this.deviceName = DEVICE_NAME;
		this.securityParameters = { mitm:false, ioCapability:IOCapability.NoInputOutput };
		// this.securityParameters = { mitm:true, ioCapability:IOCapability.DisplayOnly };
		//this.securityParameters = { mitm:true, ioCapability:IOCapability.KeyboardDisplay };
		//this.securityParameters = { mitm:true, ioCapability:IOCapability.KeyboardOnly };
		//this.securityParameters = { mitm:true, ioCapability:IOCapability.NoInputNoOutput };
		//this.securityParameters = { ioCapability:IOCapability.NoInputNoOutput };
		this.onDisconnected();
		this.deploy();
	}
	onAuthenticated() {
		this.authenticated = true;
		if (this.characteristic)
			this.startMeasurements();
	}
	onConnected() {
		this.connected = true;
		this.stopAdvertising();
	}
	onDisconnected() {
		this.connected = false;
		this.stopMeasurements();
		this.startAdvertising({
			advertisingData: {flags: 6, completeName: this.deviceName, completeUUID16List: [uuid`1809`, uuid`180F`]}
		});
	}
	onCharacteristicNotifyEnabled(characteristic) {
		this.characteristic = characteristic;
		if (this.authenticated)
			this.startMeasurements();
	}
	onCharacteristicNotifyDisabled(characteristic) {
		this.stopMeasurements();
	}
	onPasskeyConfirm(params) {
		let passkey = this.passkeyToString(params.passkey);
		trace(`server confirm passkey: ${passkey}\n`);
		this.passkeyReply(params.address, true);
	}
	onPasskeyDisplay(params) {
		let passkey = this.passkeyToString(params.passkey);
		trace(`server display passkey: ${passkey}\n`);
	}
	onPasskeyRequested(params) {
		let passkey = Math.round(Math.random() * 999999);
		trace(`server requested passkey: ${this.passkeyToString(passkey)}\n`);
		return passkey;
	}
	get temperature() {
		if (98.5 > this.temp)
			this.temp += 0.1;
		let flags = 0x01;		// fahrenheit
		let exponent = 0xFD;	// -1
		let mantissa = Math.round(this.temp * 1000);
		let temp = (exponent << 24) | mantissa;		// IEEE-11073 32-bit float
		let result = [flags, temp & 0xFF, (temp >> 8) & 0xFF, (temp >> 16) & 0xFF, (temp >> 24) & 0xFF];
		return result;
	}
	startMeasurements() {
		this.timer = Timer.repeat(id => {
			if (this.characteristic)
				this.notifyValue(this.characteristic, this.temperature);
		}, 250);
	}
	stopMeasurements() {
		if (this.timer) {
			Timer.clear(this.timer);
			delete this.timer;
		}
		delete this.characteristic;
		this.temp = 95.0;
		this.authenticated = false;
	}
	passkeyToString(passkey) {
		return passkey.toString().padStart(6, "0");
	}
}

let htm = new SecureHealthThermometerServer;
