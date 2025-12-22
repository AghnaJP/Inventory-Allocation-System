import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Inventory Allocation System API',
      version: '1.0.0',
      description:
        'API documentation for the Inventory Allocation System with purchase request workflow and webhook integration',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server',
      },
      {
        url: 'https://api.production.com',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Products',
        description: 'Product management',
      },
      {
        name: 'Stocks',
        description: 'Stock level management',
      },
      {
        name: 'Warehouses',
        description: 'Warehouse management',
      },
      {
        name: 'Purchase Requests',
        description: 'Purchase request workflow',
      },
      {
        name: 'Webhooks',
        description: 'Webhook endpoints for supplier integration',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Icy Mint' },
            sku: { type: 'string', example: 'ICYMINT' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Warehouse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Main Warehouse' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Stock: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            warehouse_id: { type: 'integer', example: 1 },
            product_id: { type: 'integer', example: 1 },
            quantity: { type: 'integer', example: 100 },
            warehouse: { $ref: '#/components/schemas/Warehouse' },
            product: { $ref: '#/components/schemas/Product' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        PurchaseRequestItem: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            purchase_request_id: { type: 'integer', example: 1 },
            product_id: { type: 'integer', example: 1 },
            quantity: { type: 'integer', example: 50 },
            product: { $ref: '#/components/schemas/Product' },
          },
        },
        PurchaseRequest: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            reference: { type: 'string', example: 'PR00001' },
            warehouse_id: { type: 'integer', example: 1 },
            status: {
              type: 'string',
              enum: ['DRAFT', 'PENDING', 'COMPLETED', 'REJECTED'],
              example: 'DRAFT',
            },
            vendor: { type: 'string', example: 'PT FOOM LAB GLOBAL' },
            warehouse: { $ref: '#/components/schemas/Warehouse' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/PurchaseRequestItem' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreatePurchaseRequest: {
          type: 'object',
          required: ['warehouse_id', 'items'],
          properties: {
            warehouse_id: { type: 'integer', example: 1 },
            vendor: { type: 'string', example: 'PT FOOM LAB GLOBAL' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['product_id', 'quantity'],
                properties: {
                  product_id: { type: 'integer', example: 1 },
                  quantity: { type: 'integer', example: 100 },
                },
              },
            },
          },
        },
        UpdatePurchaseRequest: {
          type: 'object',
          properties: {
            warehouse_id: { type: 'integer', example: 2 },
            vendor: { type: 'string', example: 'PT FOOM LAB GLOBAL' },
            status: {
              type: 'string',
              enum: ['DRAFT', 'PENDING', 'COMPLETED', 'REJECTED'],
              example: 'PENDING',
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product_id: { type: 'integer', example: 1 },
                  quantity: { type: 'integer', example: 150 },
                },
              },
            },
          },
        },
        WebhookPayload: {
          type: 'object',
          required: ['vendor', 'reference', 'qty_total', 'details'],
          properties: {
            vendor: { type: 'string', example: 'PT FOOM LAB GLOBAL' },
            reference: { type: 'string', example: 'PR00001' },
            qty_total: { type: 'integer', example: 25 },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product_name: { type: 'string', example: 'Icy Mint' },
                  sku_barcode: { type: 'string', example: 'ICYMINT' },
                  qty: { type: 'integer', example: 25 },
                },
              },
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            total: { type: 'integer', example: 50 },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            totalPages: { type: 'integer', example: 5 },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Error message' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
