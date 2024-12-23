const axios = require('axios');
const config = require('config');
const { Response } = require('../../types/types');
const  { HttpNotificationService } = require('./NotificationsService');
const { SMS } = require('../../utils/constants');
const { logger } = require('../../utils/logger');

class SmsService extends HttpNotificationService {
    constructor() {
        super();
        this.messageType = SMS;
    }

    send = async (userPreferences, message) => {
        try {
            const url = this.getUrl();
            const response = await axios.post(`${url}/send-sms`, {
                telephone: userPreferences.telephone,
                message: message
            });
            logger.info(response.data, 'Sms sent successfully');
            return new Response(true, `Sms sent successfully`, this.messageType);
        } catch (error) {
            if (error.response) {
                return this.handleError(error)
            } else {
                logger.error(error, 'Error sending sms');
                return new Response(false, `Error sending sms:, ${error.message}`, this.messageType);
            }
        }
    }
}

module.exports = {
    SmsService
}
