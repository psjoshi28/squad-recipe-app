import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css']
})
export class AddRecipeComponent {
  @Output() recipeAdded = new EventEmitter<void>();

  recipeName = '';
  ingredientInput = '';
  ingredients: string[] = [];
  submitting = false;
  error = '';
  success = '';

  constructor(private readonly recipeService: RecipeService) {}

  addIngredient(): void {
    const trimmed = this.ingredientInput.trim();
    if (trimmed && !this.ingredients.includes(trimmed)) {
      this.ingredients.push(trimmed);
    }
    this.ingredientInput = '';
  }

  removeIngredient(index: number): void {
    this.ingredients.splice(index, 1);
  }

  onIngredientKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addIngredient();
    }
  }

  onSubmit(form: NgForm): void {
    this.error = '';
    this.success = '';

    if (!form.valid || this.ingredients.length === 0) {
      this.error = 'Please provide a recipe name and at least one ingredient.';
      return;
    }

    this.submitting = true;
    this.recipeService.create(this.recipeName, this.ingredients).subscribe({
      next: () => {
        this.submitting = false;
        this.success = 'Recipe added successfully!';
        form.resetForm();
        this.ingredients = [];
        this.recipeAdded.emit();
        setTimeout(() => (this.success = ''), 3000);
      },
      error: (err) => {
        this.submitting = false;
        this.error = err?.error?.error ?? 'Failed to add recipe.';
      }
    });
  }
}
