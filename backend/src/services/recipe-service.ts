import { Recipe, CreateRecipeRequest } from '../models/recipe';
import { RecipeRepository } from '../repositories/recipe-repository';

export class RecipeValidationError extends Error {}
export class RecipeNotFoundError extends Error {}

export class RecipeService {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  async getAll(): Promise<Recipe[]> {
    return this.recipeRepository.getAll();
  }

  private validateRequest(request: CreateRecipeRequest): CreateRecipeRequest {
    const trimmedName = request.name.trim();
    if (!trimmedName) {
      throw new RecipeValidationError('Recipe name is required');
    }
    if (!Array.isArray(request.ingredients) || request.ingredients.length === 0) {
      throw new RecipeValidationError('At least one ingredient is required');
    }

    const cleanedIngredients = request.ingredients
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    if (cleanedIngredients.length === 0) {
      throw new RecipeValidationError('At least one valid ingredient is required');
    }

    return { name: trimmedName, ingredients: cleanedIngredients };
  }

  async create(request: CreateRecipeRequest): Promise<Recipe> {
    const cleanedRequest = this.validateRequest(request);
    return this.recipeRepository.create(cleanedRequest);
  }

  async update(id: string, request: CreateRecipeRequest): Promise<Recipe> {
    const cleanedRequest = this.validateRequest(request);
    const updatedRecipe = await this.recipeRepository.update(id, cleanedRequest);
    if (!updatedRecipe) {
      throw new RecipeNotFoundError('Recipe not found');
    }
    return updatedRecipe;
  }
}
