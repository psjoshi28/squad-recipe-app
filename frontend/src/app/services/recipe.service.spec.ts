import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RecipeService } from './recipe.service';
import { Recipe } from '../models/recipe';

describe('RecipeService', () => {
  let service: RecipeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(RecipeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return recipes when the API responds with data', () => {
    const expected: Recipe[] = [{ id: '1', name: 'Pasta', ingredients: ['Noodles'] }];

    service.getAll().subscribe((recipes) => {
      expect(recipes).toEqual(expected);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/recipes');
    expect(req.request.method).toBe('GET');
    req.flush(expected);
  });

  it('should post a new recipe when create is called', () => {
    const response: Recipe = { id: '1', name: 'Soup', ingredients: ['Water'] };

    service.create('Soup', ['Water']).subscribe((recipe) => {
      expect(recipe).toEqual(response);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/recipes');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Soup', ingredients: ['Water'] });
    req.flush(response);
  });

  it('should put the recipe payload when update is called', () => {
    const response: Recipe = { id: '42', name: 'Salad', ingredients: ['Lettuce'] };

    service.update('42', 'Salad', ['Lettuce']).subscribe((recipe) => {
      expect(recipe).toEqual(response);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/recipes/42');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ name: 'Salad', ingredients: ['Lettuce'] });
    req.flush(response);
  });

  it('should retry the request when the API returns 500', fakeAsync(() => {
    let result: Recipe[] | undefined;

    service.getAll().subscribe((recipes) => {
      result = recipes;
    });

    const first = httpMock.expectOne('http://localhost:3000/api/recipes');
    first.flush({ error: 'boom' }, { status: 500, statusText: 'Server Error' });

    tick(250);

    const second = httpMock.expectOne('http://localhost:3000/api/recipes');
    second.flush([{ id: '2', name: 'Rice', ingredients: ['Rice'] }]);

    expect(result).toEqual([{ id: '2', name: 'Rice', ingredients: ['Rice'] }]);
  }));

  it('should return the error when the API returns a non-500 status', () => {
    let capturedError: HttpErrorResponse | undefined;

    service.getAll().subscribe({
      next: () => {
        fail('Expected error path');
      },
      error: (err: HttpErrorResponse) => {
        capturedError = err;
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/api/recipes');
    req.flush({ error: 'bad request' }, { status: 400, statusText: 'Bad Request' });

    expect(capturedError?.status).toBe(400);
    expect(httpMock.match('http://localhost:3000/api/recipes').length).toBe(0);
  });
});
