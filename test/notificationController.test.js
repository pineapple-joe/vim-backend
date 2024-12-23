const { NotificationsController } = require('../src/controllers/notificationsController');
const httpCodes = require('http-status-codes');
const { NotificationServiceFactory } = require('../src/services/Notifications/NotificationServiceFactory');

describe('Notification Controller', () => {
    let dbMock;
    let notificationServiceMock;
    let notificationServicesFactoryMock;
    let notificationsController;
    let req;
    let res;

    beforeEach(() => {
        const mockUser = {
            preferences: {
                email: true
            },
            email: 'example@gmail.com'
        };

        dbMock = {
            getUserPreferences: jest.fn().mockReturnValue(mockUser),
        };

        const mockResponse = {
            success: true,
            messageType: 'email',
            message: 'Email sent successfully'
        }

        notificationServiceMock = {
            send: jest.fn().mockReturnValue(mockResponse),
        };

        NotificationServiceFactory.getNotificationService = jest.fn().mockReturnValue(notificationServiceMock);

        notificationsController = new NotificationsController(dbMock);
        notificationsController.notificationServicesFactory = notificationServicesFactoryMock;

        req = {
            body: {
                userId: 'user123',
                message: 'Test message',
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    test('should send notifications via all active preferences', async () => {
        dbMock.getUserPreferences.mockReturnValue({
            preferences: {
                email: true,
                sms: false
            }
        });

        notificationServiceMock.send.mockImplementation((userPreferences, message) => {
            return Promise.resolve({
                messageType: userPreferences.preferences.email ? 'email' : 'sms',
                message: 'Notification sent successfully',
            });
        });

        await notificationsController.sendNotifications(req, res);

        expect(dbMock.getUserPreferences).toHaveBeenCalledWith('user123');
        expect(NotificationServiceFactory.getNotificationService).toHaveBeenCalledWith('email');
        expect(NotificationServiceFactory.getNotificationService).not.toHaveBeenCalledWith('sms');
        expect(notificationServiceMock.send).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(httpCodes.StatusCodes.OK);
        expect(res.send).toHaveBeenCalledWith({
            email: 'Notification sent successfully'
        });
    });

    test('should return 404 if user is not found', async () => {
        dbMock.getUserPreferences.mockReturnValue(null);

        await notificationsController.sendNotifications(req, res);

        expect(res.status).toHaveBeenCalledWith(httpCodes.StatusCodes.NOT_FOUND);
        expect(res.send).toHaveBeenCalledWith('User not found');
    });

    test('should return 500 on error', async () => {
        dbMock.getUserPreferences.mockImplementation(() => {
            throw new Error('Database error');
        });

        await notificationsController.sendNotifications(req, res);

        expect(res.status).toHaveBeenCalledWith(httpCodes.StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res.send).toHaveBeenCalledWith('Error sending notifications');
    });
});