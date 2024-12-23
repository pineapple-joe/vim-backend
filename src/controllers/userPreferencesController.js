const { User, Preferences } = require('../types/types');
const { NotificationServiceFactory } = require('../services/Notifications/NotificationServiceFactory');
const httpCodes = require('http-status-codes');
const { logger } = require('../utils/logger');

class UserPreferencesController {
    constructor(db) {
        this.db = db
    }
    validatePreferences = (preferences) => {
        const validTypes = NotificationServiceFactory.getValidNotificationTypes();
        return Object.keys(preferences).every(preference => validTypes.includes(preference));
    }

    createUserPreferences = (req, res) => {
        try {
            const {email, telephone, preferences} = req.body;

            const userPreferences = this.db.getUserPreferences(email);
            if (userPreferences) {
                return res.status(httpCodes.StatusCodes.BAD_REQUEST).send("User already exists");
            }
            
            if(!this.validatePreferences(preferences)) {
                return res.status(httpCodes.StatusCodes.BAD_REQUEST).send("Invalid preference type");
            }

            const preference = new Preferences(preferences);
            const user = new User(email, telephone, preference);
            this.db.createUserPreferences(user);
            logger.info("User preferences created successfully");
            return res.send("User preferences created successfully");
        }
        catch (error) {
            logger.error('Error creating user preferences:', error);
            return res.status(500).send(error.message);
        }
    };

    updateUserPreferences = (req, res) => {
        try {
            const {email, preferences} = req.body;
            const user = this.db.getUserPreferences(email);
            if (!user) {
                return res.status(httpCodes.StatusCodes.NOT_FOUND).send("User not found");
            }

            if(!this.validatePreferences(preferences)) {
                return res.status(httpCodes.StatusCodes.BAD_REQUEST).send("Invalid preference type");
            }

            user.preferences = preferences;
            this.db.updateUserPreferences(user);
            logger.info("User preferences updated successfully");
            return res.send("User preferences updated successfully");
        }
        catch (error) {
            logger.error(error, 'Error updating user preferences:');
            return res.status(500).send(error.message);
        }
        
    };

    getUserPreferences = (req, res) => {
        try {
            const {email} = req.query;
            const userPreferences = this.db.getUserPreferences(email);
            if (!userPreferences) {
                return res.status(httpCodes.StatusCodes.NOT_FOUND).send("User not found");
            }
            return res.send(userPreferences);
        }
        catch (error) {
            logger.error(error, 'Error getting user preferences');
            return res.status(500).send(error.message);
        }
        
    }
}

module.exports = {
    UserPreferencesController
}
