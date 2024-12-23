const app = require('express');
const httpCodes = require('http-status-codes');
const { InMemoryDB } = require('../services/DB/inMemoryDB');
const { UserPreferencesController } = require('../controllers/userPreferencesController');
const { NotificationsController } = require('../controllers/notificationsController');
const { logger } = require('../utils/logger');
const axios = require('axios');
const axiosRetry = require('axios-retry').default;

const usersDB = new InMemoryDB();
const userPreferencesController = new UserPreferencesController(usersDB);
const notificationsController = new NotificationsController(usersDB);

const router = app.Router();

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => {
    logger.info(`retry attempt: ${retryCount}`);
    return axiosRetry.exponentialDelay
},
  retryCondition: (error) => {
      return error.response.status === httpCodes.StatusCodes.TOO_MANY_REQUESTS;
  },
});

router.get(`/health-check`, (req, res) => {
  res.sendStatus(httpCodes.StatusCodes.OK);
});

router.post('/send-notifications', notificationsController.sendNotifications);
router.post('/user-preference', userPreferencesController.createUserPreferences);
router.put('/user-preference', userPreferencesController.updateUserPreferences);
router.get('/user-preference', userPreferencesController.getUserPreferences);

module.exports = router;
