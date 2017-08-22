Manager Online Products
=====================

[![Build Status](https://travis-ci.org/Harekam/manager_online_products.svg?branch=master)](https://travis-ci.org/Harekam/manager_online_products)

----------
### The server is implemented using only core libraries without any framework.

Access link (deployed on heroku) : https://manager-online-products.herokuapp.com

 - For authentication JWT tokens are used.
 - Auth Token Pattern(without quotes) : "bearer access_token"

#### [Click here for DB Schema](https://manager-online-products.herokuapp.com/dbSchema)
 
> **Tools/Services Used:**

> - Travis for Continuous Integration(CI)
> - Mocha (Testing)
> - Chai (Testing)
> - Heroku (PaaS)
> - Mongo Atlas (DBaaS)

#### Deployment Steps Followed:
 - After pushing code on github, travis validate it.
 - On Success heroku will deploy it implicitly.


> **Prerequisite for running the code locally:**

> - Node.js >= 6.10.x
> - Mongodb >= 3.4.X


#### Command for installing the dependencies

    npm install

#### Command for running the test cases

    npm test

#### Command for running the server

    npm start

#### Use-Case Diagram of System

![](Images/system_use_case.png?raw=true)

#### Flow Chart of System

![](Images/system_flow_chart.png?raw=true)


#### Following are character constraints on some fields in the APIs
 - password
   - min : 6
   - max : 100
 - phone
   - min : 10
   - max : 10
 - name
   - min : 2
   - max : 140
 - description
   - min : 10
   - max : 10000
 - email
   - min : 4
   - max : 254
 - searchText
   - min : 1
   - max : 50

### Important Notes:
 - Standard response is given irrespective of success or error.

        {
          "message": "string",
          "statusCode": 0,
          "data": {}
        }


 - Access Token is required to be send in headers under **authorization** key

        "authorization":"bearer access_token"


#### Standard Http codes are used:
 - Http Code: 200 (on Success)
 - Http Code: 201 (on Success/Creation of new entity)
 - Http Code: 400 (on Bad Request)
 - Http Code: 401 (on Unauthorized)
 - Http Code: 404 (on Not Found)
 - Http Code: 409 (on Already exists)
 - Http Code: 500 (on Internal server error)

### List of APIs:

**Base Path: https://manager-online-products.herokuapp.com/**


#### Login Admin
  - Path : **api/v1/admin/login**
  - Method: **POST**
  - Auth not required
  - Sample JSON object required:


          {
            "loginId": "email or phone",
            "password": "pass"
          }


  - Response JSON:
 
 
          {
            "message": "Logged in successfully.",
            "statusCode": 0,
            "data": {
              "accessToken": "jwt_token"
            }
          }
     
#### Create Product
  - Path : **api/v1/product**
  - Method: **POST**
  - Auth Required
  - Scope: Super Admin or Admin
  - Sample JSON object required:


          {
            "productName": "string",
            "description": "string description dummy", <- optional
            "totalStock": 30,
            "totalSold": 20, <- optional
            "price": 30,
            "discount": 40, <- optional
            "salePrice": 20, <- optional
            "brand": "string",
            "isAvailable": true <- optional
          }


  - Response JSON:
 
 
          {
          "message": "Successfully added.",
          "statusCode": 0,
          "data": {
             "_id": "599b2d3d84f06ffb8c13491f"
            }
          }
     

#### Get/Search Product(s)
  - Path : **api/v1/product**
  - Method: **GET**
  - Auth Required
  - Scope: Super Admin or Admin
  - Query Parameters Allowed:
    - productId: string (optional)
    - searchText: string (optional) (search on product name)
    - orderBy: enum = [DESC (default), ASC] (optional)
    - includeDeleted: boolean (default: false) (optional)
    - limit: number (default: 100) (optional)
    - skip: number (default: 0) (optional)
     
Response Object on Success: 
          

    {
      "message": "string",
      "statusCode": 0,
      "data": {
        "totalCount": 0,
        "products": [
          {
            "_id": "string",
            "updatedAt": "2017-08-21",
            "createdAt": "2017-08-21",
            "productName": "string",
            "description": "string",
            "totalStock": 0,
            "price": 0,
            "discount": 0,
            "salePrice": 0,
            "brand": "string",
            "isDeleted": true,
            "isAvailable": true,
            "totalUsersRated": 0,
            "totalRating": 0,
            "totalSold": 0
          }
        ]
      }
    }

Example:

Request Path: **/api/v1/product?searchText=dum&limit=1&skip=1**

Response: 

    {
        "message": "Action complete.",
        "statusCode": 0,
        "data": {
            "totalCount": 3,
            "products": [
                {
                    "_id": "599b19ac5b9d9bf37d39c557",
                    "updatedAt": "2017-08-21T17:34:36.912Z",
                    "createdAt": "2017-08-21T17:34:36.912Z",
                    "productName": "Dummy Product name",
                    "description": "some random description",
                    "totalStock": 10,
                    "price": 30,
                    "discount": 0,
                    "salePrice": 30,
                    "brand": "VERY HI FI BRAND",
                    "isDeleted": false,
                    "isAvailable": true,
                    "totalUsersRated": 0,
                    "totalRating": 0,
                    "totalSold": 0
                }
            ]
        }
    }
    
    

#### Update product
  - Path : **api/v1/product/:productId**
  - Method: **PUT**
  - Auth Required
  - Scope: Super Admin or Admin

 Example:
 
   Path: **localhost:8000/api/v1/product/599b2d3d84f06ffb8c13491f**

  - Sample JSON object required:


	    {
	      "productName": "name"
	    }


  - Response JSON:
 
 
          {
         "message": "Action complete.",
         "statusCode": 0,
         "data": {}
          }

#### Delete product
  - Path : **api/v1/product/:productId**
  - Method: **DELETE**
  - Auth Required
  - Scope: Super Admin or Admin

 Example:
 
   Path: **localhost:8000/api/v1/product/599b2d3d84f06ffb8c13491f**

  - Response JSON:
 
 
          {
            "message": "Action complete.",
            "statusCode": 0,
            "data": {}
          }

#### Create Admin
  - Path : **api/v1/admin**
  - Method: **POST**
  - Auth Required
  - Scope: Super Admin
  - Sample JSON object required:


          {
            "firstName": "string",
            "lastName": "string",
            "email": "email@mail.com",
            "phoneNumber": "1234567891",
            "userRole": "ADMIN" <- SUPER_ADMIN or ADMIN
        }


  - Response JSON:
 
 
          {
             "message": "Admin successfully registered.",
             "statusCode": 0,
             "data": {
             "password": "342942"
            }
        }
     


























