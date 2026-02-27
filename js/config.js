/**
 * Application Configuration
 * Central place for app-wide settings
 */
(function() {
  'use strict';

  window.AppConfig = {
    // Application version - update this single value when releasing new versions
    VERSION: '3.6.0',

    // Application name
    APP_NAME: 'Common Agent Desktop',

    // User email (for display)
    USER_EMAIL: 'BrinksSSO@brinkshome.com',

    // Customer type flag - set when a customer is selected from search results
    // Values: 'AlarmDotCom' | 'NonAlarm' | 'Cancelled'
    customerType: 'AlarmDotCom'
  };
})();
