const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

// Define a custom log format
const logFormat = printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create a logger with specified transports 
const logger = createLogger({
  level: 'info', // Set the log level
  format: combine(timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }), logFormat), // Include UTC timestamp
  transports: [
    //new transports.Console(), // Log to the console
    //new transports.File({ filename: 'webapp.log' }) // Log to a file 
    new transports.File({ filename: '/var/log/webapp.log' })
  ],
});

module.exports = logger;
