const Util = require('../lib/storeUtil');
class ApiResponse {
    constructor(response) {
        this.response = response;
    }

    success (dataOrMessage) {
        return this.response.status(200).json(this.getFormattedData(dataOrMessage));
    }

    error (dataOrMessage) {
        return this.response.status(200).json(this.getFormattedData(dataOrMessage, false));
    }

    getFormattedData (dataOrMessage, status = true, message = 'Success') {
        let data = {};
        // Check if the first argument is a string, if so, it's the message and no data is provided
        if (typeof dataOrMessage === 'string') {
            message = dataOrMessage;
        } else {
            data = dataOrMessage;
        }
        return {
            success: status,
            data: status ? data : {},
            errors: !status && !Util.isEmptyObjectArray(data) ? data : [],
            message: message || 'Success'
        }
    }
}

module.exports = ApiResponse;