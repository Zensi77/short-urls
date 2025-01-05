import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Router } from 'express';

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

    // Middleware
    this.app.use(bodyParser.json()); // Parse JSON from the request body
    this.app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data from the request body
    this.app.use(cors(corsOptions)); // Enable CORS

    // Routes
    this.app.use(this.routes);

    this.app.listen(this.port, () => {
      console.log(`[ RUN ] Server running at http://localhost:${this.port}`);
    });
  }
}
