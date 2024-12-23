const httpCodes = require('http-status-codes');
const { NotificationServiceFactory } = require('../services/Notifications/NotificationServiceFactory');
const { logger } = require('../utils/logger');

class NotificationsController {
    constructor(db) {
        this.db = db;
    }
    
    sendNotifications = async (req, res) => {
        try {
            const {userId, message} = req.body;
            const userPreferences = this.db.getUserPreferences(userId);
            if (!userPreferences) {
                return res.status(httpCodes.StatusCodes.NOT_FOUND).send("User not found");
            }
            
            const promises = Object.keys(userPreferences.preferences).map(preference => {
                if (userPreferences.preferences[preference]) {
                    const notificationService = NotificationServiceFactory.getNotificationService(preference);
                    return notificationService.send(userPreferences, message);
                }
            }).filter(promise => promise !== undefined);

            const sendStatuses = await Promise.all(promises);
            const response = sendStatuses.reduce((all, response) => {
                all[response.messageType] = response.message;
                return all;
            }, {});
            return res.status(httpCodes.StatusCodes.OK).send(response);
        }
        catch (error) {
            logger.error(error, 'Error sending notifications:');
            return res.status(httpCodes.StatusCodes.INTERNAL_SERVER_ERROR).send('Error sending notifications');
        }
        
    };
}

module.exports = {
    NotificationsController
}
