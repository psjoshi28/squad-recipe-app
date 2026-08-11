import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Recipe } from '../../models/recipe';
import { RecipeService } from '../../services/recipe.service';
import { RecipeListComponent } from './recipe-list.component';

describe('RecipeListComponent', () => {
  let fixture: ComponentFixture<RecipeListComponent>;
  let component: RecipeListComponent;
  let recipeServiceSpy: jasmine.SpyObj<RecipeService>;

  const sampleRecipes: Recipe[] = [
    { id: '1', name: 'Pasta', ingredients: ['Noodles', 'Salt'] },
    { id: '2', name: 'Soup', ingredients: ['Water'] }
  ];

  beforeEach(async () => {
    recipeServiceSpy = jasmine.createSpyObj<RecipeService>('RecipeService', ['getAll', 'update']);
    recipeServiceSpy.getAll.and.returnValue(of(sampleRecipes));

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [RecipeListComponent],
      providers: [{ provide: RecipeService, useValue: recipeServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeListComponent);
    component = fixture.componentInstance;
  });

  it('should load recipes when the component initializes', () => {
    component.ngOnInit();

    expect(recipeServiceSpy.getAll).toHaveBeenCalled();
    expect(component.recipes).toEqual(sampleRecipes);
    expect(component.loading).toBe(false);
  });

  it('should set an error when loading recipes fails', () => {
    recipeServiceSpy.getAll.and.returnValue(throwError(() => new Error('down')));

    component.loadRecipes();

    expect(component.error).toBe('Failed to load recipes. Is the backend running?');
    expect(component.loading).toBe(false);
  });

  it('should start edit mode when a recipe is selected', () => {
    component.startEdit(sampleRecipes[0]);

    expect(component.editingRecipeId).toBe('1');
    expect(component.editName).toBe('Pasta');
    expect(component.editIngredients).toEqual(['Noodles', 'Salt']);
  });

  it('should add a trimmed edit ingredient when the value is not duplicated', () => {
    component.editIngredients = ['pepper'];
    component.editIngredientInput = '  oregano  ';

    component.addEditIngredient();

    expect(component.editIngredients).toEqual(['pepper', 'oregano']);
    expect(component.editIngredientInput).toBe('');
  });

  it('should set validation error when save is attempted with invalid edit data', () => {
    component.editName = '   ';
    component.editIngredients = [];

    component.saveEdit(sampleRecipes[0]);

    expect(component.updateError).toBe('Please provide a recipe name and at least one ingredient.');
    expect(recipeServiceSpy.update).not.toHaveBeenCalled();
  });

  it('should update the recipe when save succeeds', () => {
    const updatedRecipe: Recipe = {
      id: '1',
      name: 'Updated Pasta',
      ingredients: ['Noodles', 'Cheese']
    };

    component.recipes = [...sampleRecipes];
    component.startEdit(sampleRecipes[0]);
    component.editName = '  Updated Pasta  ';
    component.editIngredients = ['Noodles', 'Cheese'];
    recipeServiceSpy.update.and.returnValue(of(updatedRecipe));

    component.saveEdit(sampleRecipes[0]);

    expect(recipeServiceSpy.update).toHaveBeenCalledWith('1', 'Updated Pasta', ['Noodles', 'Cheese']);
    expect(component.recipes[0]).toEqual(updatedRecipe);
    expect(component.updateSuccess).toBe('Recipe updated successfully.');
    expect(component.editingRecipeId).toBeNull();
    expect(component.updating).toBe(false);
  });

  it('should refresh the list when save fails with 404', () => {
    component.recipes = [...sampleRecipes];
    component.startEdit(sampleRecipes[0]);
    component.editName = 'Updated';
    component.editIngredients = ['Noodles'];
    recipeServiceSpy.update.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 404,
            statusText: 'Not Found',
            error: { error: 'not found' }
          })
      )
    );

    component.saveEdit(sampleRecipes[0]);

    expect(component.updateError).toBe('This recipe was not found. The list has been refreshed.');
    expect(recipeServiceSpy.getAll).toHaveBeenCalled();
    expect(component.editingRecipeId).toBeNull();
    expect(component.updating).toBe(false);
  });

  it('should map server error status when save fails with 500', () => {
    component.startEdit(sampleRecipes[0]);
    component.editName = 'Updated';
    component.editIngredients = ['Noodles'];
    recipeServiceSpy.update.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 500,
            statusText: 'Server Error',
            error: { error: 'server exploded' }
          })
      )
    );

    component.saveEdit(sampleRecipes[0]);

    expect(component.updateError).toBe('Server error while updating recipe. Please try again.');
    expect(component.updating).toBe(false);
  });
});
