const Store = require('../lib/store');
const Util = require("../lib/storeUtil");
const ApiResponse = require("../api/ApiResponse");
const _ = require("lodash");

class BaseController {
    constructor(request, response) {
        this.store = new Store();
        this.request = request;
        this.response = new ApiResponse(response);
        this.utils = _;
    }

    getTableName() {
        if (!_.isEmpty(this.request.params)) {
            if (_.has(this.request, 'params.table')) {
                return _.trim(this.request.params.table);
            }
        }
        console.log('ERROR: cannot find table name');
        return '';
    }
}

module.exports = BaseController;