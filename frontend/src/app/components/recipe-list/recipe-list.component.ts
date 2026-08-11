import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Recipe } from '../../models/recipe';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  loading = false;
  error = '';
  editingRecipeId: string | null = null;
  editName = '';
  editIngredientInput = '';
  editIngredients: string[] = [];
  updateError = '';
  updateSuccess = '';
  updating = false;

  constructor(private readonly recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.loading = true;
    this.error = '';
    this.recipeService.getAll().subscribe({
      next: (data) => {
        this.recipes = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load recipes. Is the backend running?';
        this.loading = false;
      }
    });
  }

  startEdit(recipe: Recipe): void {
    this.editingRecipeId = recipe.id;
    this.editName = recipe.name;
    this.editIngredients = [...recipe.ingredients];
    this.editIngredientInput = '';
    this.updateError = '';
    this.updateSuccess = '';
  }

  cancelEdit(clearMessages = false): void {
    this.editingRecipeId = null;
    this.editName = '';
    this.editIngredientInput = '';
    this.editIngredients = [];
    this.updating = false;

    if (clearMessages) {
      this.updateError = '';
      this.updateSuccess = '';
    }
  }

  addEditIngredient(): void {
    const trimmed = this.editIngredientInput.trim();
    if (trimmed && !this.editIngredients.includes(trimmed)) {
      this.editIngredients.push(trimmed);
    }
    this.editIngredientInput = '';
  }

  removeEditIngredient(index: number): void {
    this.editIngredients.splice(index, 1);
  }

  onEditIngredientKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addEditIngredient();
    }
  }

  saveEdit(recipe: Recipe): void {
    this.updateError = '';
    this.updateSuccess = '';

    const trimmedName = this.editName.trim();
    if (!trimmedName || this.editIngredients.length === 0) {
      this.updateError = 'Please provide a recipe name and at least one ingredient.';
      return;
    }

    this.updating = true;
    this.recipeService.update(recipe.id, trimmedName, this.editIngredients).subscribe({
      next: (updatedRecipe) => {
        this.recipes = this.recipes.map((item) =>
          item.id === updatedRecipe.id ? updatedRecipe : item
        );
        this.updating = false;
        this.updateSuccess = 'Recipe updated successfully.';
        this.cancelEdit(false);
      },
      error: (err: HttpErrorResponse) => {
        this.updating = false;
        this.updateError = this.mapUpdateError(err);

        if (err.status === 404) {
          this.cancelEdit(false);
          this.loadRecipes();
        }
      }
    });
  }

  isEditing(recipeId: string): boolean {
    return this.editingRecipeId === recipeId;
  }

  private mapUpdateError(err: HttpErrorResponse): string {
    if (err.status === 400) {
      return err?.error?.error ?? 'Invalid recipe data. Please review your changes.';
    }

    if (err.status === 404) {
      return 'This recipe was not found. The list has been refreshed.';
    }

    if (err.status === 500) {
      return 'Server error while updating recipe. Please try again.';
    }

    return err?.error?.error ?? 'Failed to update recipe. Is the backend running?';
  }
}
