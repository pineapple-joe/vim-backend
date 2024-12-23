const config = require('config');
const { Response } = require('../../types/types');
const httpCodes = require('http-status-codes');
const { logger } = require('../../utils/logger');

class NotificationService {
    send() {}
}

class HttpNotificationService extends NotificationService {
    handleError = (error) => {
        const errorMessage = error.response.data.error
        if (error.response.status === httpCodes.StatusCodes.TOO_MANY_REQUESTS) {
            logger.error(error, 'Rate limit error');
            return new Response(false, `Rate limit error: ${errorMessage}`, this.messageType);
        } else {
            logger.error(error, 'Server error:');
            return new Response(false, `Server error: ${errorMessage}`, this.messageType);
        }
    }

    getUrl = () => {
        const hostname = process.env.NOTIFICATION_SERVICE_HOST || config.get("notificationService.host");
            const port = process.env.NOTIFICATION_SERVICE_PORT || config.get("notificationService.port");
            const url = `http://${hostname}:${port}`;
            return url;
    }
}

module.exports = {
    NotificationService,
    HttpNotificationService
}