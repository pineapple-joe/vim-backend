class Preferences {
  constructor(preferences) {
      this.email = preferences.email;
      this.sms = preferences.sms;
    }
}

class User {
  constructor(email, phone, preferences) {
      this.telephone = phone;
      this.email = email;
      this.preferences = preferences;
    }
}

class Response {
  constructor(succeeded, message, type) {
    this.succeeded = succeeded;
    this.message = message;
    this.messageType = type
  }
}

module.exports = {
  Preferences,
  User,
  Response
}