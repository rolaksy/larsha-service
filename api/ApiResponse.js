const Util = require('../lib/storeUtil');

class ApiResponse {
    constructor(response) {
        this.response = response;
    }

    success(dataOrMessage) {
        const responseData = this.getFormattedData(dataOrMessage);
        return this.response.status(200).json(responseData);
    }

    error(dataOrMessage) {
        const responseData = this.getFormattedData(dataOrMessage, false);
        return this.response.status(200).json(responseData);
    }

    getFormattedData(dataOrMessage, status = true, message = 'Success') {
        let data = {};
        if (typeof dataOrMessage === 'string') {
            message = dataOrMessage;
        } else {
            data = dataOrMessage;
        }

        const responseObject = {
            success: status,
            data: status ? data : {},
            errors: !status && !Util.isEmptyObjectArray(data) ? data : [],
            message: message || 'Success'
        };
        return responseObject;
    }
}

module.exports = ApiResponse;
