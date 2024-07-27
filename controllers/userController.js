const BaseController = require('./baseController');
const StoreUtil = require("../lib/storeUtil");
const {has} = require("lodash/object");
const { decrypt, encrypt } = require('../lib/crypt');
const sessionManager = require("../services/sessionManager");

class UserController extends BaseController{
    constructor(request, response) {
        super(request, response);
        this.payload = request.body;
        this.init();
    }

    init() {
        this.email = this.utils.isEmpty(this.payload.email) ? "" : this.payload.email;
        this.firstname = this.utils.isEmpty(this.payload.firstname) ? "" : this.payload.firstname;
        this.lastname = this.utils.isEmpty(this.payload.lastname) ? "" : this.payload.lastname;
        this.password = this.utils.isEmpty(this.payload.password) ? "" : this.payload.password;
        this.action = this.utils.isEmpty(this.payload.action) ? "" : this.payload.action;
    }
    
    async validateUser () {
        const filters = {
            email: this.email
        }
        const response = await this.store.select(this.getTableName(), filters);
        if(response !== null && Array.isArray(response) && response.length > 0) {
            const user = response[0];
            if(user.email !== '' && user.key !== '') {
                return this.response.success('Valid User');
            }
        }
        return this.response.error('Not a valid user');
    }

    async login () {
        const result = await this.store.select(this.getTableName(), { email: this.email });
        if(result !== null && Array.isArray(result) && result.length > 0) {
            const user = result[0];
            if(decrypt(user.key) === this.password) {
                const sid = await sessionManager.create().setSession(this.email);
                return this.response.success({
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    token: sid
                });
            } else {
                return this.response.error("Invalid email or password");
            }
        }
        return this.response.error("Invalid email or password");
    }

    async createAccount(){
        const user = await this.store.select(this.getTableName(), { email: this.email });
        if(user && user.some(item => item.email === this.email)) {
            return this.response.error("Cannot create account. User with same email already exist");
        }
        // Ensure the password is converted to a string before encryption
        const passwordString = this.utils.toString(this.password);
        const encryptedPassword = encrypt(passwordString);
        const params = {
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            key: encryptedPassword
        }
        console.log(params);
        const result = await this.store.insert(this.getTableName(), params);
        return this.response.success(result);
    }

    async createOrDrop () {
        let result = "";
        if (this.action === 'create') {
            result = await this.store.create(this.getTableName());
        }
        if (this.action === 'drop') {
            result = await this.store.drop(this.getTableName());
        }
        return this.response.success(result);
    }
}


module.exports = UserController;
