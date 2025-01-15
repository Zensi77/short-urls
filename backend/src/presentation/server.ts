import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Router } from 'express';

import { logger } from '../config/winston';

import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import enforceSsl from 'express-sslify';

interface options {
  port: number;
  routes: Router;
}

export class Server {
  public readonly app = express();
  private readonly port: number;
  private readonly routes: Router;

  constructor(options: options) {
    const { port, routes } = options;
    this.port = port;
    this.routes = routes;
  }

  async start() {
    const corsOptions = {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type,Authorization',
    };

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per
      message: 'Too many requests from this IP, please try again after an hour',
    });

    // Middleware
    this.app.use(bodyParser.json({ strict: true })); // Parse JSON data from the request body
    this.app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data from the request body
    this.app.use(cors(corsOptions)); // Enable CORS

    this.app.use(mongoSanitize()); // Sanitize data against NoSQL Injection Attacks
    this.app.use(limiter); // Limit request from the same IP
    this.app.use(helmet()); // Set security headers
    this.app.use(
      // Set security headers for XSS protection
      helmet.contentSecurityPolicy({
        directives: {
          // Activo el modo de bloqueo de contenido no permitido
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
        },
      })
    );
    if (process.env.NODE_ENV === 'production') {
      //Si estamos en producción
      this.app.use(enforceSsl.HTTPS({ trustProtoHeader: true })); // Enforce SSL connection
    }

    // Routes
    this.app.use(this.routes);

    this.app.listen(this.port, () => {
      logger.info(`Server listening on port ${this.port}`);
    });
  }
}
