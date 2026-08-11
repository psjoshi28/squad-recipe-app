export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
}

export interface CreateRecipeRequest {
  name: string;
  ingredients: string[];
}
