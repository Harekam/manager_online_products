Manager Online Products
=====================

[![Build Status](https://travis-ci.org/Harekam/manager_online_products.svg?branch=master)](https://travis-ci.org/Harekam/manager_online_products)

----------
### The server is implemented using only core libraries without any framework.

Access link (deployed on heroku) : https://manager-online-products.herokuapp.com

 - For authentication JWT bearer tokens are used.
 - Auth Token Pattern(without quotes) : "bearer access_token"

#### [Click here for DB Schema](https://manager-online-products.herokuapp.com/dbSchema)
 - In production Mongo Atlas (Database as Service) is used.
 
#### For running the code locally

> **Prerequisite:**

> - Node.js >= 6.10.x
> - Mongodb >= 3.2.X

> **Tools Used:**

> - Travis CI
> - Mocha
> - Chai


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

#### List of APIs:
 1. Get/Search Product(s)
    - Path : api/v1/product
    - Method: GET
    - Query Parameters Allowed:
      - productId: string (optional)
      - searchText: string (optional)
      - orderBy: enum = [DESC (default), ASC] (optional)
      - includeDeleted: boolean (default: false) (optional)
      - limit: number
      - skip: number
     
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

Request: /api/v1/product?searchText=dum&limit=1&skip=1

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
    
    
 2. Create Product
    - Path : api/v1/product
    - Method: POST
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


   - Sample JSON object required:
 
 
     {
         "message": "Successfully added.",
         "statusCode": 0,
         "data": {
             "_id": "599b2d3d84f06ffb8c13491f"
         }
     }
     
3. Update product
    - Path : api/v1/product/:productId
    - Method: PUT
    
 Example:
 
   Path: localhost:8000/api/v1/product/599b2d3d84f06ffb8c13491f

    - Sample JSON object required:


    {
      "productName": "name"
    }


   - Sample JSON object required:
 
 
     {
         "message": "Action complete.",
         "statusCode": 0,
         "data": {}
     }

4. Delete product
    - Path : api/v1/product/:productId
    - Method: DELETE
    
 Example:
 
   Path: localhost:8000/api/v1/product/599b2d3d84f06ffb8c13491f

   - Sample JSON object required:
 
 
     {
         "message": "Action complete.",
         "statusCode": 0,
         "data": {}
     }

5. Create Admin
    - Path : api/v1/admin
    - Method: POST
    - Sample JSON object required:


    {
      "firstName": "string",
      "lastName": "string",
      "email": "email@mail.com",
      "phoneNumber": "1234567891",
      "userRole": "ADMIN" <- SUPER_ADMIN or ADMIN
    }


   - Sample JSON object required:
 
 
     {
         "message": "Successfully added.",
         "statusCode": 0,
         "data": {
             "_id": "599b2d3d84f06ffb8c13491f"
         }
     }
     