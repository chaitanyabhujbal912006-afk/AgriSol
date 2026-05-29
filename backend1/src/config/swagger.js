/**
 * Swagger / OpenAPI Configuration
 */

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🌱 AgriSol API',
      version: '1.0.0',
      description: `
# AgriSol - Smart Agriculture Platform API

Complete backend API for AgriSol, the AI-powered agriculture assistance platform for Indian farmers.

## Features
- 🔐 JWT + OTP Authentication
- 🌾 Crop & Farm Management
- 🔬 AI Disease Detection
- 🌤️ Weather Intelligence
- 📈 Market Price Tracking
- 🏛️ Government Schemes
- 💬 Community & Expert Support
- 🔔 Push Notifications
- 📊 Analytics & Reporting

## Authentication
Use Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <your_access_token>
\`\`\`
      `,
      contact: {
        name: 'AgriSol Team',
        email: 'dev@agrisol.in',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api/v1`,
        description: 'Development server',
      },
      {
        url: 'https://api.agrisol.in/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64f1a2b3c4d5e6f7g8h9i0j1' },
            name: { type: 'string', example: 'Ramesh Kumar' },
            mobile: { type: 'string', example: '9876543210' },
            email: { type: 'string', example: 'ramesh@example.com' },
            role: { type: 'string', enum: ['farmer', 'expert', 'admin'] },
            village: { type: 'string', example: 'Dhule' },
            district: { type: 'string', example: 'Nashik' },
            state: { type: 'string', example: 'Maharashtra' },
            preferredLanguage: { type: 'string', enum: ['en', 'hi', 'mr'] },
            cropsGrown: { type: 'array', items: { type: 'string' } },
            isVerified: { type: 'boolean' },
          },
        },
        Farm: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', example: 'North Field' },
            totalArea: {
              type: 'object',
              properties: {
                value: { type: 'number', example: 5.5 },
                unit: { type: 'string', enum: ['acres', 'hectares', 'bigha'] },
              },
            },
            soilType: { type: 'string', enum: ['clay', 'loam', 'sandy', 'black', 'red'] },
          },
        },
        DiseaseReport: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            cropName: { type: 'string', example: 'Wheat' },
            status: { type: 'string', enum: ['submitted', 'analyzing', 'completed', 'reviewed'] },
            aiAnalysis: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                detections: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      diseaseName: { type: 'string' },
                      confidence: { type: 'number' },
                      severity: { type: 'string' },
                      remedies: { type: 'array', items: { type: 'string' } },
                    },
                  },
                },
              },
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error description' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        ValidationError: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    './src/routes/v1/*.routes.js',
    './src/controllers/**/*.js',
  ],
};

module.exports = swaggerJsdoc(options);
