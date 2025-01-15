import winston from 'winston';

const environment = process.env.NODE_ENV || 'development';
// Configuración de Winston
export const logger = winston.createLogger({
  level: environment === 'production' ? 'error' : 'debug',
  format: winston.format.combine(
    winston.format.colorize(), // Colorea los logs para la consola
    winston.format.timestamp(), // Agrega una marca de tiempo
    winston.format.errors({ stack: true }), // Muestra el stack trace de los errores
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return stack
        ? `[${timestamp}] ${level}: ${message}\n${stack}`
        : `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    // Log en la consola
    new winston.transports.Console(),
    // Log en archivo (opcional, puedes configurarlo para guardar logs persistentes)
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Solo logs de errores
    new winston.transports.File({ filename: 'logs/combined.log' }), // Todos los logs
  ],
});
