import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Recipe } from '../models/recipe';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly apiUrl = 'http://localhost:3000/api/recipes';

  constructor(private readonly http: HttpClient) {}

  private retryOnInternalServerError<T>(source: Observable<T>): Observable<T> {
    return source.pipe(
      retry({
        count: 3,
        delay: (error: HttpErrorResponse) => {
          if (error.status === 500) {
            return timer(250);
          }
          throw error;
        }
      })
    );
  }

  getAll(): Observable<Recipe[]> {
    return this.retryOnInternalServerError(this.http.get<Recipe[]>(this.apiUrl));
  }

  create(name: string, ingredients: string[]): Observable<Recipe> {
    return this.retryOnInternalServerError(this.http.post<Recipe>(this.apiUrl, { name, ingredients }));
  }

  update(id: string, name: string, ingredients: string[]): Observable<Recipe> {
    return this.retryOnInternalServerError(this.http.put<Recipe>(`${this.apiUrl}/${id}`, { name, ingredients }));
  }
}
