const { EmailService } = require('./EmailService');
const { SmsService } = require('./SmsService');
const { EMAIL, SMS } = require('../../utils/constants');

class NotificationServiceFactory {
    getValidNotificationTypes() {
        return [EMAIL, SMS];
    }

    getNotificationService(type) { 
        if (type === EMAIL) { 
            return new EmailService();
        } else if (type === SMS) { 
            return new SmsService();
        } else {
            throw new Error('Notification type not supported.');
            }
        } 
    }

module.exports = {
    NotificationServiceFactory: new NotificationServiceFactory()
}