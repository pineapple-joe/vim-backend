const axios = require('axios');
const config = require('config');
const { Response } = require('../../types/types');
const  { HttpNotificationService } = require('./NotificationsService');
const { EMAIL } = require('../../utils/constants');
const { logger } = require('../../utils/logger');

class EmailService extends HttpNotificationService {
    constructor() {
        super();
        this.messageType = EMAIL;
    }

    send = async (userPreferences, message) => {
        try {
            const url = this.getUrl();
            const response = await axios.post(`${url}/send-email`, {
                email: userPreferences.email,
                message: message
            });
            logger.info(response.data, 'Email sent successfully');
            return new Response(true, `Email sent successfully`, this.messageType);
        } catch (error) {
            if (error.response) {
                return this.handleError(error)
            } else {
                logger.error(error, 'Error sending email');
                return new Response(false, `Error sending email:, ${error.message}`);
            }
        }
    }
}

module.exports = {
    EmailService
}
