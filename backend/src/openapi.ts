export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Recipe API',
    version: '1.0.0',
    description: 'OpenAPI documentation for recipe endpoints.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server'
    }
  ],
  tags: [
    {
      name: 'Recipes',
      description: 'Recipe CRUD endpoints'
    }
  ],
  paths: {
    '/api/recipes': {
      get: {
        tags: ['Recipes'],
        summary: 'List recipes',
        responses: {
          '200': {
            description: 'Recipe list',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Recipe' }
                }
              }
            }
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      post: {
        tags: ['Recipes'],
        summary: 'Create recipe',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateRecipeRequest' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Recipe created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Recipe' }
              }
            }
          },
          '400': {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/recipes/{id}': {
      put: {
        tags: ['Recipes'],
        summary: 'Update recipe',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateRecipeRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Recipe updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Recipe' }
              }
            }
          },
          '400': {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          '404': {
            description: 'Recipe not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Recipe: {
        type: 'object',
        required: ['id', 'name', 'ingredients'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          ingredients: {
            type: 'array',
            items: { type: 'string' }
          }
        }
      },
      CreateRecipeRequest: {
        type: 'object',
        required: ['name', 'ingredients'],
        properties: {
          name: { type: 'string' },
          ingredients: {
            type: 'array',
            items: { type: 'string' }
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        required: ['error'],
        properties: {
          error: { type: 'string' }
        }
      }
    }
  }
} as const;
