const { Database } = require('./DB');
const { logger } = require('../../utils/logger')

class InMemoryDB extends Database {
    constructor() {
        super();
        this.userPreferences = {};
    }
    createUserPreferences(userPreference) {
        try {
            this.userPreferences[userPreference.email] = userPreference;
        } catch (error) {
            logger.error(error, 'Error creating user preferences');
        }
    }

    updateUserPreferences(userPreference) {
        try {
            this.userPreferences[userPreference.email] = userPreference;
        } catch (error) {
            logger.error(error, 'Error updating user preferences');
        }
    }

    getUserPreferences(email) {
        try {
            return this.userPreferences[email];
        } catch (error) {
            logger.error(error, 'Error getting user preferences');
            return {};
        }
    }
}

module.exports = {
    InMemoryDB
}