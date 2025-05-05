import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo App REST API',
      version: '1.0.0',
      description: 'A RESTful API for managing todos and users',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Todo: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated id of the todo',
            },
            title: {
              type: 'string',
              description: 'The title of the todo',
            },
            description: {
              type: 'string',
              description: 'The description of the todo',
            },
            completed: {
              type: 'boolean',
              description: 'The completion status of the todo',
              default: false,
            },
            isEditing: {
              type: 'boolean',
              description: 'Whether the todo is being edited',
              default: false,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The creation timestamp of the todo',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The last update timestamp of the todo',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated id of the user',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'The email address of the user',
            },
            firstName: {
              type: 'string',
              description: 'The first name of the user',
            },
            lastName: {
              type: 'string',
              description: 'The last name of the user',
            },
            profilePic: {
              type: 'string',
              description: 'URL to the user\'s profile picture',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The creation timestamp of the user',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The last update timestamp of the user',
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }],
    paths: {
      '/api/todos': {
        get: {
          summary: 'Get all todos',
          description: 'Retrieves a list of all todos',
          responses: {
            '200': {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Todo',
                    },
                  },
                },
              },
            },
            '500': {
              description: 'Server error',
            },
          },
        },
        post: {
          summary: 'Create a new todo',
          description: 'Creates a new todo item',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'description'],
                  properties: {
                    title: {
                      type: 'string',
                    },
                    description: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Todo created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Todo',
                  },
                },
              },
            },
            '400': {
              description: 'Invalid input',
            },
          },
        },
      },
      '/api/todos/{id}': {
        get: {
          summary: 'Get todo by ID',
          description: 'Retrieves a specific todo by its ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
              description: 'ID of the todo to retrieve',
            },
          ],
          responses: {
            '200': {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Todo',
                  },
                },
              },
            },
            '404': {
              description: 'Todo not found',
            },
            '500': {
              description: 'Server error',
            },
          },
        },
        patch: {
          summary: 'Update a todo',
          description: 'Updates an existing todo. Supports partial updates.',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
              description: 'ID of the todo to update',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: {
                      type: 'string',
                    },
                    description: {
                      type: 'string',
                    },
                    completed: {
                      type: 'boolean',
                    },
                    isEditing: {
                      type: 'boolean',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Todo updated successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Todo',
                  },
                },
              },
            },
            '400': {
              description: 'Invalid input',
            },
            '404': {
              description: 'Todo not found',
            },
          },
        },
        delete: {
          summary: 'Delete a todo',
          description: 'Deletes a specific todo',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
              description: 'ID of the todo to delete',
            },
          ],
          responses: {
            '200': {
              description: 'Todo deleted successfully',
            },
            '400': {
              description: 'Invalid ID',
            },
            '404': {
              description: 'Todo not found',
            },
          },
        },
      },
      '/api/users': {
        get: {
          summary: 'Get all users',
          description: 'Retrieves a list of all users',
          responses: {
            '200': {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/User',
                    },
                  },
                },
              },
            },
            '500': {
              description: 'Server error',
            },
          },
        },
        post: {
          summary: 'Create a new user',
          description: 'Creates a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'firstName', 'lastName'],
                  properties: {
                    email: {
                      type: 'string',
                      format: 'email',
                    },
                    firstName: {
                      type: 'string',
                    },
                    lastName: {
                      type: 'string',
                    },
                    profilePic: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'User created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User',
                  },
                },
              },
            },
            '400': {
              description: 'Invalid input or user already exists',
            },
            '500': {
              description: 'Server error',
            },
          },
        },
      },
      '/api/users/signup': {
        post: {
          summary: 'Create a new user account',
          description: 'Register a new user with email and password',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password', 'firstName', 'lastName'],
                  properties: {
                    email: {
                      type: 'string',
                      format: 'email'
                    },
                    password: {
                      type: 'string',
                      format: 'password'
                    },
                    firstName: {
                      type: 'string'
                    },
                    lastName: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'User created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: {
                        $ref: '#/components/schemas/User'
                      },
                      token: {
                        type: 'string'
                      },
                      message: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Invalid input or user already exists'
            }
          }
        }
      },
      '/api/users/login': {
        post: {
          summary: 'Login user',
          description: 'Authenticate user with email and password',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: {
                      type: 'string',
                      format: 'email'
                    },
                    password: {
                      type: 'string',
                      format: 'password'
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: {
                        $ref: '#/components/schemas/User'
                      },
                      token: {
                        type: 'string'
                      },
                      message: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Invalid credentials'
            }
          }
        }
      },
      '/api/users/logout': {
        post: {
          summary: 'Logout user',
          description: 'Invalidate current user token',
          responses: {
            '200': {
              description: 'Logout successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Unauthorized'
            }
          }
        }
      },
      '/api/users/profile': {
        get: {
          summary: 'Get user profile',
          description: 'Get current user profile information',
          responses: {
            '200': {
              description: 'Profile retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            },
            '401': {
              description: 'Unauthorized'
            }
          }
        },
        patch: {
          summary: 'Update user profile',
          description: 'Update current user profile information. Supports partial updates.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    firstName: {
                      type: 'string'
                    },
                    lastName: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Profile updated successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            },
            '401': {
              description: 'Unauthorized'
            }
          }
        }
      },
      '/api/users/profile/upload': {
        post: {
          summary: 'Upload profile picture',
          description: 'Upload and update user profile picture',
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    profilePicture: {
                      type: 'string',
                      format: 'binary'
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Profile picture uploaded successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string'
                      },
                      profilePicture: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Invalid file format or size'
            },
            '401': {
              description: 'Unauthorized'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

export default specs;