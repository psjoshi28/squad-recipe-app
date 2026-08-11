import { Component, ViewChild } from '@angular/core';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  activeTab: 'view' | 'add' = 'view';

  @ViewChild(RecipeListComponent)
  private recipeList!: RecipeListComponent;

  onRecipeAdded(): void {
    this.activeTab = 'view';
    // allow Angular to render the list tab before refreshing
    setTimeout(() => this.recipeList?.loadRecipes(), 50);
  }
}
