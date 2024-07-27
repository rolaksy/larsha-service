const Store = require('../lib/store');
const _ = require("lodash");
const { decrypt, encrypt } = require('../lib/crypt');
const moment = require('moment-timezone');

class SessionManager {

    constructor() {
        this.store = new Store();
        this.timezone = 'Pacific/Auckland';
        this.object = 'ks-sessions';
    }

    static create() {
        return new SessionManager();
    }

    async setSession(email) {
        if(_.isEmpty(email))
            return false;

        const _objSession = {
            email: email,
            sid: encrypt(email),
            expiry: moment().tz(this.timezone).add(10, 'minutes').toISOString()
        }

        const filter = {email: email};
        return await this.store.update('ks-sessions', _objSession, filter);
    }

    async isSessionValid(sid) {
        const session = await this.store.select('ks-sessions', { sid: sid });
        if (!session) {
            return false;
        }

        const now = moment().tz(this.timezone);
        const expiry = moment(session.expiry).tz(this.timezone);
        return now.isBefore(expiry);
    }
}

module.exports = SessionManager;