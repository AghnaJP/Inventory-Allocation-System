# Conventions

## Branch naming conventions

- Main branch: `master`
- Epic branches: `epic/TICKET-ID_short-description, eg. epic/FOOM-345_menu`
- Feature branches: `feature/TICKET-ID_short-description, eg. feature/FOOM-125_drop-down-list`
- Bugfix/hotfix branches: `bug/TICKET-ID_short-description or hotfix/TICKET-ID_short-description, eg. bug/FOOM-135_stock-not-visible`
- Release branches: `release/MAJOR.MINOR, eg. release/1.1`

## Commit message convention

We follow the \[conventional commits specification\](https://www.conventionalcommits.org/en) for our commit messages:

- `fix`: bug fixes, e.g. fix crash due to deprecated method.
- `feat`: new features, e.g. add new method to the module.
- `refactor`: code refactor, e.g. migrate from class components to hooks.
- `docs`: changes into documentation, e.g. add usage example for the module..
- `test`: adding or updating tests, e.g. add integration tests using detox.
- `chore`: tooling changes, e.g. change CI config.

## Project structure

- `"src"`

  - contains all source code.
  - all resources should be placed within the `"src"` folder.
  - all resources should be named singular, "kebab-case".
  - each "resource" folder **should** contain the following files:

    - `"[resource].routes.ts` -> definition of routes - only for non-automatically generated routes. Use tsoa routes for automatically generated routes.
    - `"[resource].controller.ts"` -> definition of point of entries.
    - `"[resource].service.ts"` -> definition of service transformation layer.
    - `"[resource].controller.test.ts"` -> tests for controller.

  - Examples:

    - `"src/warehouse/warehouse.controller.ts"`
    - `"src/product/product.service.ts"`
    - `"src/stock/stock.transform.ts"`

  > Separation of concerns: controllers do NOT make http calls directly, instead it's done thru an adapter.

## Controller structure

- all service definitions must:

  - have a "`@Route`" tag/annotation
  - have a `"@Tags`" tag/annotation
  - have a `"SuccessResponse"` tag/annotation
  - have the selling channel as part of the query:

    ```
    @Query() sellingChannel = SellingChannelNames.WEBOA,
    ```

  - return its own transformed response (mapping from DB)

  > **Tsoa** documentation - [Refer to this link](https://tsoa-community.github.io/docs/)

- example/template:

  ```javascript
  @Route('version/resource') // route path
  @Tags('resource name') // tags for the Swagger (for sorting and grouping)
  export class ResourceController extends Controller {
      /**
       * Meaningful description for service
       * @isInt id
       * @minimum id 1 number must be > 0
       */
      @Response<Type>(HTTP_STATUS_CODE, 'Description') // definition of responses
      @SuccessResponse('200', 'OK')
      @Security('BearerAuth') // if endpoint is to be secured
      @Get('{id}') // define HTTP method and params
      async get(
          @Path() id: string, // params from path
          @Query() param = false, // params from query
          @Res() responseHandler: TsoaResponse<HTTP_STATUS_CODE, Type>,  // custom response handlers
      ): Promise<ResourceResponse> { // define interface for your response
          // extra validation if needed

          // convert request to DB Request model
          const pgSqlRequest = transformRequest(param)

          // call DB - adapter -
          const mongoDbResponse = await makeHttpCall(pgSqlRequest)

          // check for errors & return errors

          // work with context
          this.setHeader('header-name', 'value');

          // transform response and return
          return transformResponse(mongoDbResponse);
      }
  }
  ```

## Response Structure

### Success Response

- If a service returns pages, response structure should have the following format (example):

  ```
  {
      pagination: {
          totalElements: 1,
          totalPages: 1,
          pageNumber: 0,
          pageSize: 10,
          isLastPage: true,
      },
      data: [{...}],
  }
  ```

### Error Response

- error responses should return an object w/ the following structure:

  ```javascript
  {
      type: EErrorType.INTERNAL,
      code: EErrorCode.GENERIC,
      message: EErrorMessage.GENERIC
  }
  ```

  > `type`: indicates whether the error generated is internal o external to mongo/ai.

  > `code`: indicates the error generated.

  > `message`: provides additional information about the error (code) generated.

#### Validation Error Response

- 400 response is returned if validation fails.
- leverage `tsoa` to do simple validation.
- to be done before any other process (mapping, http call to external service, etc.).

## Naming

### JSON fields

- use American English
- use camelCase
  - good example: `productInformation` vs bad example `ProductInformation`
- do NOT use underscore or any other separators
  - good example: `warehouseInformation` vs bad example `warehouse_information`
- do NOT use abbreviations
  - good example: `warehouseInformation` vs bad example `whInfo`

#### Enums

- use SNAKE_CASE
  - good example: `PRODUCT_CREATED` vs bad example `PRODUCT-CREATED`
  - good example: `PRODUCT` vs bad example `product`
  - good example: `PUBLISHED` vs bad example `Published`

### Types

- RQ/RS domain services should be named: `[SERVICE]DB[TYPE]`
  - > Example: LocationWarehouseDBRequest & LocationWarehouseDBResponse
  - > Example: CreateProductDBRequest & CreateProductDBResponse

> `[TYPE]` to be either "Request" or "Response"
