Manager Online Products
=====================

[![Build Status](https://travis-ci.org/Harekam/manager_online_products.svg?branch=master)](https://travis-ci.org/Harekam/manager_online_products)

----------

#### [Click here for Swagger Documentation](https://manager-online-products.herokuapp.com/documentation)

 - The Documentation includes all required details for implementation like request, response objects.
 - It also segregates response objects based on success or error with different http codes.
 - One can run the APIs from their only without any third party tools like postman.
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