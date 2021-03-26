# REVARZ Clothing

**PERN Stack E-Commerce Demo Store**<br/>
Created By **Ezayji** in February - March 2021<br/>
[Live Version](https://revarz.herokuapp.com/)

---

**Table Of Contents**

* [General Information](#general-information)
* [Features / User Guide](#features-/-user-guide)

     1. [User](#user)
     2. [Products Catalogue](#products-catalogue)
     3. [Cart](#cart)
     4. [Checkout](#checkout)
     5. [Orders](#orders)

* [Technical Information](#technical-information)

    1. [Languages and Libraries](#languages-and-libraries)
    2. [Usage](#usage)

        * [Setup](#setup)
        * [Running Locally](#running-locally)
        * [Test Suites](#test-suites)
    3. [Status](#status)
    4. [Database](#database)
    5. [Server Routes](#server-routes)

        * [User Routes](#user-routes)
        * [Product Routes](#product-routes)
        * [Cart Routes](#cart-routes)
        * [Checkout Routes](#checkout-routes)
        * [Order Routes](#order-routes)

* [Inspiration](#inspiration)
* [Licence](#licence)

---

## General Information

REVARZ is a streetwear e-store that offers a colorful and refreshing selection of the newest trends. Current selection includes 20 products from 4 manufacturers:

* Carhartt WIP
* Edwin
* RIPNDIP
* Stüssy

---

The site is built keeping in mind the growing variety of products and brands to be featured on the catalogue meaning that the front-end and the back-end code are both scalable enough to handle an addition of brands and products to the database.

REVARZ offers the ability to browse the store to both users and guests.<br />
Checkouts and Cart related actions currently remain available only for registered users. 

This project is created for learning purposes but with a few configurations it could be turned into a working product.<br/>

**Note that because this is a demo, you shouldn't enter your real credit card information for testing payment functionality.**

Please use "dummy" credit cards provided in the [Checkout](#checkout) section instead.

---

Front page:

* On desktop:

     ![Home page on desktop](https://i.imgur.com/Ux66G3D.png)

* On mobile:

     ![Home Page On Mobile](https://i.imgur.com/S78JO2L.png)

---

## Features / User Guide
1. ### User 

   * Register an account.

     *<strong>This demo site doesn't send you any mail or text so you dont't have to enter the "real" phone and email.</strong>*


   * Update profile information.

   * Interact with cart.

   * Interact with orders.
---

2. ### Products Catalogue

   *You can browse the products catalogue as a guest or as an user.*

   * Browse products by gender

   * Browse products by gender and category

   * Browse products by brand
     
   * Click on an item from the products list and take further action.
     *Product's page*

        ![Stussy jacket](https://i.imgur.com/06zoRZB.png)

     * Select a size and add the item to cart.
     
     >* If logged in displays "ADD TO CART".
     >* A guest who's not logged in sees "LOG IN OR REGISTER".
     
---

3. ### Cart
     *(Only for logged in users)*

   * Cart item:
        
        ![Cart preview](https://i.imgur.com/FSxUCzU.png)

     
   * Change item quantity in cart based on availability by clicking on "-" or "+".
   * Remove an item from cart by clicking on "REMOVE ITEM".
   * Procceed to checkout by clicking on "CHECKOUT".
     
---

4. ### Checkout
     *(Only for logged in users)*

    * Opens as an overlay on the Cart page and functions as a two page form.
    * #### Billing

       ![Billing preview](https://i.imgur.com/D8O8ju7.png)

       * You can use an existing address if you have saved one before.

            ![Use Existing Address](https://i.imgur.com/8yqB7bF.png)

       * Option to save inserted address if you haven't saved one.

            ![Save Address](https://i.imgur.com/IvCyjk8.png)


        * Address requirements:

            + All fields must be filled.
            + A **valid country must be entered**.

    * #### Payment

        ![Payment preview](https://i.imgur.com/ptCzjjP.png)

        * Preview order items.
        * <strong>Test paying with three "dummy" credit cards:</strong>
        
            + 4242 4242 4242 4242 <-- **for successful payments**
            + 4000 0027 6000 3184 <-- **for payments that require 3D authentication**
            + 4000 0000 0000 0002 <-- **for declined card errors**

        * Other card field requirements:

            * **Enter a date in the future**.
            * CVC and ZIP can be whatever as long as they are **numeric** values.

          *The confirm button won't work unless a valid credit card or one of the dummys is provided*

---

5. ### Orders
     *(Only for logged in users)*

   * View the list of completed orders:

     * Order id, date, total and payment status per order preview line.

     
     
     >ORDR NR acts as a hyperlink to the details page.
     
   * View completed order details:
     
     + Delivery Address.
     + Items + details.
     + Total price paid. 

     ![Order Details](https://i.imgur.com/uqRDnqo.png)

---

## Technical Information

1. ### Languages and Libraries

     Languages used:

     * Javascript
     * HTML
     * CSS
     * SQL

     ---

     Database:

     * PostgreSQL

     ---

     Front-End Libraries:

     * [React](https://reactjs.org/docs/getting-started.html)
     * [Redux](https://redux.js.org/introduction/getting-started)
     * [@reduxjs/toolkit](https://redux-toolkit.js.org/introduction/getting-started)
     * [@stripe/stripe-js](https://www.npmjs.com/package/@stripe/stripe-js)
     * [@stripe/react-stripe-js](https://www.npmjs.com/package/@stripe/react-stripe-js)
     * [Axios](https://www.npmjs.com/package/axios)
     * [i18n-iso-countries](https://www.npmjs.com/package/i18n-iso-countries)

     ---

     Back-End Libraries:

     * [Express.js](https://www.npmjs.com/package/express)
     * [Express-session](https://www.npmjs.com/package/express-session)
     * [Passport.js](https://www.npmjs.com/package/passport)
     * [passport-local](https://www.npmjs.com/package/passport-local)
     * [Stripe Node.js Library](https://www.npmjs.com/package/stripe)
     * [node-postgres](https://www.npmjs.com/package/pg)
     * [bcrypt](https://www.npmjs.com/package/bcrypt)

---

2. ### Usage

    Prerequisites for running the project locally:

    + [Node.js](https://nodejs.org/en/) locally installed.
    + [PostgreSQL](https://www.postgresql.org/download/windows/) locally installed.
    + Knowledge of interacting with PostgreSQL through a CLI or through GUI's like [Postbird](https://www.electronjs.org/apps/postbird) or [pgAdmin](https://www.pgadmin.org/) (Included with PostgreSQL).
    + Free unique [API test keys](https://stripe.com/docs/keys#obtain-api-keys) obtained from Stripe

    ---

    #### Setup

      1. Fork or download the repository.
      2. Navigate to the **root folder** with a **CLI** and install the **back-end** packages.
      
      >$ cd .../e-commerce
      
      >$ npm install
      
      3. install the **front-end** packages.
      
      >$ cd /client
  
      >$ npm install
      
      4. Create a **PostgreSQL database** and insert the commands from **"e-commerce.sql"**.
      5. Create a **".env"** file in the **root directory** and add the following:
      ```
      SESSION_SECRET={Any randomly generated key or word}
      PG_USER={Your PostgreSQL user}
      PG_HOST=localhost
      PG_DB={Name of the database that you created}
      PG_PW={Your PostgreSQL password}
      PG_PORT=5432
      STRIPE_SECRET={Your stripe secret API key}
      ```
      6. Open the root folder in your **code editor** and select the file **"config.js"** located in **"/client/src/Services"**. Then replace the **"publicKey"** with your **Stripe API public key**.
      >e-commerce/client/src/Services/config.js
      ```javascript
      export const publicKey='insert your Stripe public API key here'
      ```
      7. You're good to go, have fun!

    ---

    #### Running Locally

      After a successful setup you can run the application using the following commands:

      * Run the **whole app**.
        ```
        $ npm run dev
        ```
        *The app will be available at [http://localhost:3000/](http://localhost:3000/)* 

      * Run only the **Front-End** .
        ```
        $ npm run client
        ```
        *The app will be available at [http://localhost:3000/](http://localhost:3000/)*
      * Run only the **Server**.
        ```
        $ npm run server
        ```
        *The app will be available at [http://localhost:5000/](http://localhost:5000/)*
    ---

    #### Test Suites

    Server testing suite covers all the CRUD operations.<br/>
    Run the **Server** suite from the root directory:
    >Folder: e-commerce
    ```
    $ npm test
    ```

    The suite is located in:
    >e-commerce/tests/server-test.js
    
    There are also helper functions in a subfolder that help the suite with some PostgreSQL queries that need to be performed before some actions.

    

    ---

    **Front-End** testing suites cover the functionality of all components<br/>

    You can run the suites from the 'client' folder:
    >Folder: e-commerce/client
    ```
    $ npm test
    ```

    *note that stripe related actions were manually tested.*

---

  3. ### Status

      The current application state is suitable for demo use and supports the addition of products and brands.
      For real use, the server must also change stock quantity after a successful checkout which could be implemented by adding an extra query to the server payment confirmation route. Also the "forgot password" function should be implemented for real usage and e-mail confirmations should be sent after registering.

      Next steps for the demo:
      
      * Admin view.
      * OAuth login with Google. 

---

  4. ### Database

      Schema:

      ![Database Schema](https://i.imgur.com/q0gSPRl.png)

      * Each customer must have an unique id, username, email and phone. All columns except address related ones must be filled.

      * Cart items are tracked in the table "cart" with a foreign key "customer_username". 
  
      * Ordered items are tracked in the table "order_item" with a foreign key "shippment_id".

      * The server creates a shippment after a successful checkout and then the Front-End sends a "POST" request to convert tracked cart items to order items.
 
      * For the sake of demo use no quantity is removed from stock. That could be implemented by adding a query function to the server side payment confirmation route.

---

  5. ### Server Routes

      * #### User Routes

        *Only an authenticated user can access their information.*

        * POST **/api/register**

          Expected request body:
          ```javascript
          {
            username: 'userName',
            first_name: 'firstName',
            last_name: 'lastName',
            email: 'email',
            phone: '+44 5559 95943',
            password: 'password',
            registered: new Date()
          }
          ```
          Responds:
            * 201 "Created" on success.
            * 400 "Bad request" if any info is missing or some field is not unique.

        ---

        * POST **/api/login**

          * Expected request body:
          ```javascript
          {
            username: 'userName',
            password: 'password'
          }
          ```

          Responds:
            * 404 if not registered.
            * 400 if wrong password is provided.
            * Successful response:
            ```javascript
            {
              user: {
                username: 'userName'
              }
            }
            ```

        ---

        * GET **/api/auth**

          * Route for **checking** if the browser is authenticated.
          * Responds 400 if not authenticated.
          * Successful response:
            ```javascript
            {
              user: {
                username: 'userName'
              }
            }
            ```

        ---

        * GET **/api/logout**

          * Ends the authenticated session.
          * Responds 200 "OK" on success.

        ---

        * GET **/api/customer_un/**:username

          * Route for recieving customer profile info.
          * An username must be provided in params.
          * Returns 400 if the request is not authenticated.
          * Successful response:
          ```javascript
          {
            id: 55, // id that was generated by the server
            username: 'userName',
            first_name: 'firstName',
            last_name: 'lastName',
            email: 'email',
            phone: '+44 5559 95943',
            registered: "2021-03-20T22:00:00.000Z"
          }
          ```

        ---

        * GET **/api/customer_address/**:username

          * Route for recieving customer address.
          * An username must be provided in params.
          * Returns 400 if the request is not authenticated.
          * Successful responses:
          ```javascript
          {
            username: 'username',
            appartment_nr: '1',
            street: 'Street',
            city: 'City',
            province: 'Province',
            zip: 77777,
            country: 'Country'
          }
          ```

          or

          ```javascript
          {
            username: 'username',
            appartment_nr: null,
            street: null,
            city: null,
            province: null,
            zip: null,
            country: null
          }
          ```

          >*If no address is saved all values except the username will be null*

        ---

        * PUT **/api/customer_un/**:username

          * Route for updating customer profile info.
          * An username must be provided in params.
          * Username can't be updated.
          * Responds 400 if the sent email or phone is not unique or the request is not authenticated.
          * Expected request body:
          ```javascript
          {
            first_name: 'newFirstName', // all fields 
            last_name: 'newLastName',   // don't have to be
            email: 'newEmail',          // new
            phone: '+44 6666 66666',
          }
          ```
          * Successful response:
          ```javascript
          {
            id: 55,
            username: 'userName',
            first_name: 'newFirstName',
            last_name: 'newLastName',
            email: 'newEmail',
            phone: '+44 6666 66666',
            registered: "2021-03-20T22:00:00.000Z"
          }
          ```

        ---

        * PUT **/api/customer_un/**:username/**password**

          * Route for updating customer's password.
          * Responds 400 if the provided old password is incorrect or the request is not authenticated.
          * Expected request body:
          ```javascript
          {
            password: 'oldPassword',
            new_password: 'newPassword'
          }
          ```
          * Successful response is 200 "OK".

        ---

        * PUT **/api/customer_address/**:username
          
          * Route for updating customer address.
          * An username must be provided in params.
          * Responds 400 if the request is not authenticated.
          * Expected request body:
          ```javascript
          {
            appartment_nr: 1,       
            street: 'newStreet',
            city: 'newCity',
            province: 'newProvince',
            zip: 75607,             
            country: 'newCountry'
          }
          // all fields don't have to be new
          ```
          * Successful response:
          ```javascript
          {
            username: 'username',
            appartment_nr: '1',
            street: 'newStreet',
            city: 'newCity',
            province: 'newProvince',
            zip: 75607,             
            country: 'newCountry'
          }
          ```

      ---

      * #### Product Routes

        *No authentication is needed for product routes*

        * GET **/api/manufacturers**

          * Route for recieving available manufacturers
          * Successful response:
          ```javascript
          [
            {
              id: 1,
              title: 'Manufacturer 1 Title'
            },
            ...
          ]
          ```

        ---

        * GET **/api/categories**

          * Route for recieving available categories.
          * Successful response:
          ```javascript
          [
            {
              id: 1,
              title: 'Category 1 Title'
            },
            ...
          ]
          ```

        ---

        * GET **/api/products?gender=**${gender}**&category=**${category_id}

          * Provide **only** a **gender query** to get the products for a specific **gender** ( men / women ).
          * Provide **gender** and **category ID queries** to get **category products** for a specific **gender**.
          * Successful response:
          ```javascript
          [
            {
              id: 1,
              category_id: 2,
              title: 'Product Title',
              unit_price_eur: 20,
              thumbnail_url: 'thumbnailUrl',
              manufacturer: 'Manufacturer Title'
            },
            ...
          ]
          ```

        ---

        * GET **/api/manufacturers**/manufacturer_id

          * Route for products by manufacturer.
          * Provide a manufacturer ID in params.
          * Successful response:
          ```javascript
          {
            manufacturer: {
              id: 1,
              title: 'Brand Name',
              description: 'Brand Description',
              logo_url: 'Logo URL'
            },
            products: [
              {
                id: 1,
                category_id: 2,
                title: 'Product 1 Title',
                unit_price_eur: 20,
                thumbnail_url: 'thumbnailUrl',
                manufacturer: 'Manufacturer Title'
              }
              ...
            ]
          }
          ```

        ---

        * GET **/api/products/**:product_id

          * Route for product details.
          * Successful response:
          ```javascript
          {
            product: {
              id: 1,
              category_id: 2,
              title: 'Product Title',
              description: 'Product Description',
              color: 'Color',
              unit_price_eur: 20,
              gender: 'Gender',
              material: 'Material',
              manufacturer: 'Manufacturer Title'
            },
            images: [
              {
                url: 'url 1'
              },
              ...
            ],
            sizes: [
              {
                size: 'size 1',
                quantity: 2
              },
              ...
            ]
          }
          ```

      ---

      * #### Cart Routes

        *Only authenticated users can interact with cart routes.*

          * POST **/api/cart/**:username

            * Route for posting a cart item.
            * Expected request body:
            ```javascript
            {
              product_id: 1,
              quantity: 1,
              size: 'Size'
            }
            ```
            * Successful response:
            ```javascript
            {
              products: [
                {
                  cart_id: 1,
                  product_id: 1,
                  quantity: 1,
                  size: 'Size',
                  product_title: 'Product 1 Title',
                  manufacturer: 'Manufacturer Title',
                  color: 'Color',
                  unit_price_eur: 50,
                  thumbnail_url: 'Product Thumbnail URL'
                }
                ...
              ]
              total: 555
            }
            ```

          ---

          * PUT **/api/cart/**:username

            * Route for updating the quantity of a product in cart
            * Expected request body:
            ```javascript
            {
              product_id: 1,
              quantity: 2,
              size: 'Size'
            }
            ```
            * Successful response:
            ```javascript
            {
              products: [
                {
                  cart_id: 1,
                  product_id: 1,
                  quantity: 2,
                  size: 'Size',
                  product_title: 'Product 1 Title',
                  manufacturer: 'Manufacturer Title',
                  color: 'Color',
                  unit_price_eur: 50,
                  thumbnail_url: 'Product Thumbnail URL'
                }
                ...
              ]
              total: 605
            }
            ```

          ---

          * DELETE **/api/cart/**:username/**product_id=**[Product ID]**&size=**[Size]

            * Username, Product ID and Size must be provided in params and query.
            * If Size includes "/" replace it with "_".
            * Successful response is 204.

          ---

          * GET **/api/cart/**:username

            * Route for recieving current cart items with total price.
            * Successful response:
            ```javascript
            {
              products: [
                {
                  cart_id: 1,
                  product_id: 1,
                  quantity: 2,
                  size: 'Size',
                  product_title: 'Product 1 Title',
                  manufacturer: 'Manufacturer Title',
                  color: 'Color',
                  unit_price_eur: 50,
                  thumbnail_url: 'Product Thumbnail URL'
                }
                ...
              ]
              total: 605
            }
            ```

      ---

      * #### Checkout Routes
        *Only authenticated users can interact with checkout routes.*<br/>
        Current implementation confirms the payment on the server and then tells the Front-End to send a POST request with the shippment_id for converting cart items into order items.

          * POST **/api/payment/**:username

            * Route for creating and confirming payments.
            * Expected request body:
            ```javascript
            {
              payment_method_id: 'Created by stripe.createPaymentMethod()',
              address: {
                appartment_nr: 2,
                street: 'Street',
                city: 'City',
                province: 'Province',
                zip: 77777,
                country: 'Country',
                status: 'New',
                check: false
              },
            }
            ```
            ```
            check = true && status === 'Existing' if customer used their existing address

            check = true && status === 'New' if addressless user wanted to save the used address

            check = false && status === 'Existing' if customer with saved address used a custom address

            check = false && status === 'New' if addressless user did not want to save the used address 
            ```

            * Responses:

              * Body includes "**error**" property if payment encountered an error.
              * Body includes "**requires_action: true**" if further authentication is needed.
              * Body includes "**success: true**" and "**shippment_id**" if the payment was succesful.

          ---

          * POST **/api/cart/**:username/**checkout**

            * Route for converting cart items into order items
            * Expected request body:
            ```javascript
            {
              shippment_id: 1000000
            }
            ```
            * ^^ Returned by previous route if the payment was successful. ^^

      ---

      * #### Order Routes
        *Only authenticated users can interact with order routes.*

          * GET **/api/orders/**:username

            * Route for recieving all successful orders.
            * Successful response:
            ```javascript
            [
              {
                id: 10012,
                date_utc: "2021-03-25T14:20:05.130Z",
                total_eur: 50,
                payment: true
              },
              ...
            ]
            ```

          ---

          * GET **/api/orders/**:username/:order_id

            * Route for recieving order details.
            * Successful response:
            ```javascript
            {
              id: 10012,
              date_utc: "2021-03-25T14:20:05.130Z",
              total_eur: 101,
              payment: true,
              to_appartment: '33',
              to_street: 'Street',
              to_city: 'City',
              to_province: 'Province',
              to_zip: 77777,
              to_country: 'Country',
              products: [
                {
                  product_id: 6,
                  quantity: 1,
                  size: 'Size',
                  unit_price_eur: 50,
                  product_title: 'Product Title',
                  manufacturer: 'Manufacturer Title',
                  color: 'Color' 
                },
                ...
              ]
            }
            ```

---

## Inspiration

This project was created as an assignement from Codecademy and inspired by the creative clothing brands featured in the catalogue.

It's a little step in my journey of becoming a real developer and this project could be improved a lot in the future.

---

## Licence

MIT License

Copyright (c) 2021 Ezayji

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
