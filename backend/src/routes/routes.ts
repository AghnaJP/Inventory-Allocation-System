/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { WarehouseController } from './../v1/warehouse/controller/warehouse.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { StockController } from './../v1/stock/controller/stock.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PurchaseRequestController } from './../v1/purchase-request/controller/purchase-request.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ProductController } from './../v1/product/controller/product.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { WebhookController } from './../v1/webhook/controller/webhook.controller';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "WarehouseAttributes": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResult_WarehouseAttributes_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"WarehouseAttributes"},"required":true},
            "pagination": {"dataType":"nestedObjectLiteral","nestedProperties":{"totalPages":{"dataType":"double","required":true},"limit":{"dataType":"double","required":true},"page":{"dataType":"double","required":true},"total":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Status": {
        "dataType": "refEnum",
        "enums": ["OK","ERROR","RESOURCE_NOT_FOUND","COMPLETED"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Error": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "stack": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProductAttributes": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "sku": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StockWithRelations": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "warehouse_id": {"dataType":"double","required":true},
            "product_id": {"dataType":"double","required":true},
            "quantity": {"dataType":"double","required":true},
            "product": {"ref":"ProductAttributes","required":true},
            "warehouse": {"ref":"WarehouseAttributes","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResult_StockWithRelations_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"StockWithRelations"},"required":true},
            "pagination": {"dataType":"nestedObjectLiteral","nestedProperties":{"totalPages":{"dataType":"double","required":true},"limit":{"dataType":"double","required":true},"page":{"dataType":"double","required":true},"total":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PurchaseRequestItemResponse": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"product":{"dataType":"nestedObjectLiteral","nestedProperties":{"sku":{"dataType":"string","required":true},"name":{"dataType":"string","required":true},"id":{"dataType":"double","required":true}},"required":true},"quantity":{"dataType":"double","required":true},"product_id":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PurchaseRequestResponse": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"items":{"dataType":"array","array":{"dataType":"refAlias","ref":"PurchaseRequestItemResponse"},"required":true},"status":{"dataType":"string","required":true},"vendor":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"reference":{"dataType":"string","required":true},"id":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResult_PurchaseRequestResponse_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refAlias","ref":"PurchaseRequestResponse"},"required":true},
            "pagination": {"dataType":"nestedObjectLiteral","nestedProperties":{"totalPages":{"dataType":"double","required":true},"limit":{"dataType":"double","required":true},"page":{"dataType":"double","required":true},"total":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PurchaseRequestItemInput": {
        "dataType": "refObject",
        "properties": {
            "product_id": {"dataType":"double","required":true},
            "quantity": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreatePurchaseRequestDTO": {
        "dataType": "refObject",
        "properties": {
            "warehouse_id": {"dataType":"double","required":true},
            "vendor": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "items": {"dataType":"array","array":{"dataType":"refObject","ref":"PurchaseRequestItemInput"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdatePurchaseRequestDTO": {
        "dataType": "refObject",
        "properties": {
            "warehouse_id": {"dataType":"double"},
            "vendor": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["DRAFT"]},{"dataType":"enum","enums":["PENDING"]},{"dataType":"enum","enums":["APPROVED"]},{"dataType":"enum","enums":["REJECTED"]}]},
            "items": {"dataType":"array","array":{"dataType":"refObject","ref":"PurchaseRequestItemInput"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResult_ProductAttributes_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"ProductAttributes"},"required":true},
            "pagination": {"dataType":"nestedObjectLiteral","nestedProperties":{"totalPages":{"dataType":"double","required":true},"limit":{"dataType":"double","required":true},"page":{"dataType":"double","required":true},"total":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TStatusProgression": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["DRAFT"]},{"dataType":"enum","enums":["PENDING"]},{"dataType":"enum","enums":["COMPLETED"]},{"dataType":"enum","enums":["REJECTED"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WebhookResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "reference": {"dataType":"string","required":true},
            "status": {"dataType":"union","subSchemas":[{"ref":"TStatusProgression"},{"dataType":"string"}]},
            "type": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WebhookDetail": {
        "dataType": "refObject",
        "properties": {
            "sku_barcode": {"dataType":"string","required":true},
            "qty": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WebhookPayload": {
        "dataType": "refObject",
        "properties": {
            "reference": {"dataType":"string","required":true},
            "status_request": {"dataType":"string"},
            "type": {"dataType":"string"},
            "event_type": {"dataType":"string"},
            "details": {"dataType":"array","array":{"dataType":"refObject","ref":"WebhookDetail"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsWarehouseController_getAllWarehouses: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
                limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
                search: {"in":"query","name":"search","dataType":"string"},
        };
        app.get('/v1/warehouses',
            ...(fetchMiddlewares<RequestHandler>(WarehouseController)),
            ...(fetchMiddlewares<RequestHandler>(WarehouseController.prototype.getAllWarehouses)),

            async function WarehouseController_getAllWarehouses(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWarehouseController_getAllWarehouses, request, response });

                const controller = new WarehouseController();

              await templateService.apiHandler({
                methodName: 'getAllWarehouses',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsStockController_getAllStocks: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
                limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
                search: {"in":"query","name":"search","dataType":"string"},
        };
        app.get('/v1/stocks',
            ...(fetchMiddlewares<RequestHandler>(StockController)),
            ...(fetchMiddlewares<RequestHandler>(StockController.prototype.getAllStocks)),

            async function StockController_getAllStocks(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsStockController_getAllStocks, request, response });

                const controller = new StockController();

              await templateService.apiHandler({
                methodName: 'getAllStocks',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPurchaseRequestController_getAll: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
                search: {"in":"query","name":"search","dataType":"string"},
        };
        app.get('/v1/purchase-requests',
            ...(fetchMiddlewares<RequestHandler>(PurchaseRequestController)),
            ...(fetchMiddlewares<RequestHandler>(PurchaseRequestController.prototype.getAll)),

            async function PurchaseRequestController_getAll(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPurchaseRequestController_getAll, request, response });

                const controller = new PurchaseRequestController();

              await templateService.apiHandler({
                methodName: 'getAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPurchaseRequestController_getById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/v1/purchase-requests/:id',
            ...(fetchMiddlewares<RequestHandler>(PurchaseRequestController)),
            ...(fetchMiddlewares<RequestHandler>(PurchaseRequestController.prototype.getById)),

            async function PurchaseRequestController_getById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPurchaseRequestController_getById, request, response });

                const controller = new PurchaseRequestController();

              await templateService.apiHandler({
                methodName: 'getById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPurchaseRequestController_create: Record<string, TsoaRoute.ParameterSchema> = {
                dto: {"in":"body","name":"dto","required":true,"ref":"CreatePurchaseRequestDTO"},
        };
        app.post('/v1/purchase-requests',
            ...(fetchMiddlewares<RequestHandler>(PurchaseRequestController)),
            ...(fetchMiddlewares<RequestHandler>(PurchaseRequestController.prototype.create)),

            async function PurchaseRequestController_create(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPurchaseRequestController_create, request, response });

                const controller = new PurchaseRequestController();

              await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPurchaseRequestController_update: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                dto: {"in":"body","name":"dto","required":true,"ref":"UpdatePurchaseRequestDTO"},
        };
        app.put('/v1/purchase-requests/:id',
            ...(fetchMiddlewares<RequestHandler>(PurchaseRequestController)),
            ...(fetchMiddlewares<RequestHandler>(PurchaseRequestController.prototype.update)),

            async function PurchaseRequestController_update(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPurchaseRequestController_update, request, response });

                const controller = new PurchaseRequestController();

              await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPurchaseRequestController_delete: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.delete('/v1/purchase-requests/:id',
            ...(fetchMiddlewares<RequestHandler>(PurchaseRequestController)),
            ...(fetchMiddlewares<RequestHandler>(PurchaseRequestController.prototype.delete)),

            async function PurchaseRequestController_delete(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPurchaseRequestController_delete, request, response });

                const controller = new PurchaseRequestController();

              await templateService.apiHandler({
                methodName: 'delete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsProductController_getAllProducts: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
                limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
                search: {"in":"query","name":"search","dataType":"string"},
        };
        app.get('/v1/products',
            ...(fetchMiddlewares<RequestHandler>(ProductController)),
            ...(fetchMiddlewares<RequestHandler>(ProductController.prototype.getAllProducts)),

            async function ProductController_getAllProducts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProductController_getAllProducts, request, response });

                const controller = new ProductController();

              await templateService.apiHandler({
                methodName: 'getAllProducts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWebhookController_receiveStock: Record<string, TsoaRoute.ParameterSchema> = {
                data: {"in":"body","name":"data","required":true,"ref":"WebhookPayload"},
        };
        app.post('/v1/webhook/receive-stock',
            ...(fetchMiddlewares<RequestHandler>(WebhookController)),
            ...(fetchMiddlewares<RequestHandler>(WebhookController.prototype.receiveStock)),

            async function WebhookController_receiveStock(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWebhookController_receiveStock, request, response });

                const controller = new WebhookController();

              await templateService.apiHandler({
                methodName: 'receiveStock',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
