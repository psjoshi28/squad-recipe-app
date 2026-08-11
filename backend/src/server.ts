import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { RecipeController } from './controllers/recipe-controller';
import { RecipeService } from './services/recipe-service';
import { RecipeRepository } from './repositories/recipe-repository';
import { openApiDocument } from './openapi';
import envConfig from './config/env-config';

export function createServer(): express.Application {
  const app = express();

  app.use(helmet());
  app.use(morgan('dev'));
  app.use(cors({ origin: 'http://localhost:4200' }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/openapi.json', (_req: express.Request, res: express.Response) => {
    res.type('application/json').status(200).json(openApiDocument);
  });

  if(envConfig.enable_swagger) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
  }

  // wire up layers
  const recipeRepository = new RecipeRepository();
  const recipeService = new RecipeService(recipeRepository);
  const recipeController = new RecipeController(recipeService);

  app.use('/api', recipeController.router);

  // global error handler
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(500).json({ error: err.message ?? 'Internal server error' });
  });

  return app;
}
