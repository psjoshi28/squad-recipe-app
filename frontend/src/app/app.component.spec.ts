import { AppComponent } from './app.component';

describe('AppComponent', () => {
  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should initialize with the view tab active when the component is created', () => {
    const component = new AppComponent();

    expect(component.activeTab).toBe('view');
  });

  it('should switch to the view tab and refresh recipes when a recipe is added', () => {
    jasmine.clock().install();

    const component = new AppComponent();
    component.activeTab = 'add';

    const loadRecipes = jasmine.createSpy('loadRecipes');
    (component as any).recipeList = { loadRecipes };

    component.onRecipeAdded();

    expect(component.activeTab).toBe('view');
    expect(loadRecipes).not.toHaveBeenCalled();

    jasmine.clock().tick(50);
    expect(loadRecipes).toHaveBeenCalled();
  });
});
