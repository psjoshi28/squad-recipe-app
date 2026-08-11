import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import { Recipe, CreateRecipeRequest } from '../models/recipe';

const DATA_DIR = join(__dirname, '../../data');
const DATA_FILE = join(DATA_DIR, 'recipes.json');

export class RecipeRepository {
  private async ensureDataFile(): Promise<void> {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DATA_FILE).catch(async () => {
      await fs.writeFile(DATA_FILE, JSON.stringify([]), 'utf-8');
    });
  }

  private async readAll(): Promise<Recipe[]> {
    await this.ensureDataFile();
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('Data file is corrupted: expected an array');
    return parsed as Recipe[];
  }

  private async writeAll(recipes: Recipe[]): Promise<void> {
    await this.ensureDataFile();
    await fs.writeFile(DATA_FILE, JSON.stringify(recipes, null, 2), 'utf-8');
  }

  async getAll(): Promise<Recipe[]> {
    return this.readAll();
  }

  async create(request: CreateRecipeRequest): Promise<Recipe> {
    const recipes = await this.readAll();
    const newRecipe: Recipe = {
      id: uuidv4(),
      name: request.name,
      ingredients: request.ingredients
    };
    recipes.push(newRecipe);
    await this.writeAll(recipes);
    return newRecipe;
  }

  async update(id: string, request: CreateRecipeRequest): Promise<Recipe | null> {
    const recipes = await this.readAll();
    const recipeIndex = recipes.findIndex((recipe) => recipe.id === id);

    if (recipeIndex === -1) {
      return null;
    }

    const updatedRecipe: Recipe = {
      ...recipes[recipeIndex],
      name: request.name,
      ingredients: request.ingredients
    };

    recipes[recipeIndex] = updatedRecipe;
    await this.writeAll(recipes);
    return updatedRecipe;
  }
}
