import { Router, Request, Response } from 'express';
import { RecipeService, RecipeValidationError, RecipeNotFoundError } from '../services/recipe-service';
import { CreateRecipeRequest } from '../models/recipe';

export class RecipeController {
  readonly router: Router;

  constructor(private readonly recipeService: RecipeService) {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.router.get('/recipes', async (req: Request, res: Response) => {
      try {
        const recipes = await this.recipeService.getAll();
        res.json(recipes);
      } catch (err) {
        console.error('Failed to retrieve recipes:', err);
        res.status(500).json({ error: 'Failed to retrieve recipes' });
      }
    });

    this.router.post('/recipes', async (req: Request, res: Response) => {
      try {
        const body = req.body as CreateRecipeRequest;
        const recipe = await this.recipeService.create(body);
        res.status(201).json(recipe);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create recipe';
        res.status(400).json({ error: message });
      }
    });

    this.router.put('/recipes/:id', async (req: Request, res: Response) => {
      try {
        const body = req.body as CreateRecipeRequest;
        const updated = await this.recipeService.update(req.params.id, body);
        res.status(200).json(updated);
      } catch (err) {
        if (err instanceof RecipeValidationError) {
          res.status(400).json({ error: err.message });
          return;
        }
        if (err instanceof RecipeNotFoundError) {
          res.status(404).json({ error: err.message });
          return;
        }
        res.status(500).json({ error: 'Failed to update recipe' });
      }
    });
  }
}
