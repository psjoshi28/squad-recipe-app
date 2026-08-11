import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AddRecipeComponent } from './add-recipe.component';
import { RecipeService } from '../../services/recipe.service';

describe('AddRecipeComponent', () => {
  let fixture: ComponentFixture<AddRecipeComponent>;
  let component: AddRecipeComponent;
  let recipeServiceSpy: jasmine.SpyObj<RecipeService>;

  beforeEach(async () => {
    recipeServiceSpy = jasmine.createSpyObj<RecipeService>('RecipeService', ['create']);

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [AddRecipeComponent],
      providers: [{ provide: RecipeService, useValue: recipeServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should add the trimmed ingredient when a new ingredient is entered', () => {
    component.ingredientInput = '  basil  ';

    component.addIngredient();

    expect(component.ingredients).toEqual(['basil']);
    expect(component.ingredientInput).toBe('');
  });

  it('should not add a duplicate ingredient when the same value already exists', () => {
    component.ingredients = ['salt'];
    component.ingredientInput = 'salt';

    component.addIngredient();

    expect(component.ingredients).toEqual(['salt']);
  });

  it('should set an error when the form is invalid or ingredients are missing', () => {
    const form = { valid: false } as NgForm;

    component.onSubmit(form);

    expect(component.error).toBe('Please provide a recipe name and at least one ingredient.');
    expect(recipeServiceSpy.create).not.toHaveBeenCalled();
  });

  it('should submit and emit when the form is valid and ingredients are present', fakeAsync(() => {
    const form = {
      valid: true,
      resetForm: jasmine.createSpy('resetForm')
    } as unknown as NgForm;

    component.recipeName = 'Soup';
    component.ingredients = ['Water'];
    recipeServiceSpy.create.and.returnValue(of({ id: '1', name: 'Soup', ingredients: ['Water'] }));
    spyOn(component.recipeAdded, 'emit');

    component.onSubmit(form);

    expect(component.submitting).toBe(false);
    expect(component.success).toBe('Recipe added successfully!');
    expect(recipeServiceSpy.create).toHaveBeenCalledWith('Soup', ['Water']);
    expect(form.resetForm).toHaveBeenCalled();
    expect(component.ingredients).toEqual([]);
    expect(component.recipeAdded.emit).toHaveBeenCalled();

    tick(3000);
    expect(component.success).toBe('');
  }));

  it('should show API error when create fails', () => {
    const form = { valid: true } as NgForm;

    component.recipeName = 'Soup';
    component.ingredients = ['Water'];
    recipeServiceSpy.create.and.returnValue(
      throwError(() => ({ error: { error: 'Backend rejected input.' } }))
    );

    component.onSubmit(form);

    expect(component.submitting).toBe(false);
    expect(component.error).toBe('Backend rejected input.');
  });
});
