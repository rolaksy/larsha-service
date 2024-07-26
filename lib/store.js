const Gitrows = require("./gitrows");
class Store {
    constructor(token) {
        this.gitrowsOptions = {
            author: {
                name: 'rolaksy',
                email: '9laksy@gmail.com'
            },
            owner: 'rolaksy',
            user: 'rolaksy',
            token: token,
            branch: 'master',
            csv: { delimiter: ',' },
            cacheTTL: 1000, // You can tweak this value to have a custom cache validity time (3s here)
            type: 'json' //yaml, csv, json
        };
        this.gitrows = new Gitrows(this.gitrowsOptions);
    }
    getPath(object) {
        return `@github/${this.gitrowsOptions.owner}/larsha-store/${object}/o.json`;
    }
    async select(object, filters = {}) {
        console.log('token: ', this.gitrows.options.token);
        return await this.gitrows.get(
            this.getPath(object),
            filters
        ).then((res) => {
            return res;
        }).catch((error) => {
            return error;
        });
    }
    async create(object) {
        return await this.gitrows.create(
            this.getPath(object),
            []
        ).then((res) => {
            return res;
        }).catch((err) => {
            return err;
        });
    }
    async update(object, data, filter) {
        return await this.gitrows.update(
            this.getPath(object),
            data,
            filter
        ).then((res) => {
            return res;
        }).catch((err) => {
            return err;
        });
    }
    async remove(object, filter) {
        return await this.gitrows.delete(
            this.getPath(object),
            filter
        ).then((res) => {
            return res;
        }).catch((err) => {
            return err;
        });
    }
    async insert(object, data) {
        return await this.gitrows.put(
            this.getPath(object),
            data
        ).then((res) => {
            return res;
        }).catch((err) => {
            return err;
        });
    }
    async drop(object) {
        return await this.gitrows.drop(
            this.getPath(object)
        ).then((res) => {
            return res;
        }).catch((err) => {
            return err;
        });
    }
}

module.exports = Store;