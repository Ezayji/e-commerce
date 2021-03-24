# REVARZ Clothing

**PERN Stack E-Commerce Demo Store**<br/>
Created By **Ezayji** in February - March 2021<br/>
[Live Version](https://revarz.herokuapp.com/)

---

**Table Of Contents**

* [General Information](#general-information)
* [Features / User Guide](#features-/-user-guide)

     1. [User](#user)

          * [Register an account](#register-an-account)
          * [Log in as an user](#log-in-as-an-user)
          * [Update account information](#update-account-information)
          * [Add an address if no address is already added](#add-an-address-if-no-address-is-already-added)
          * [Update address info if there is an existing address](#update-address-info-if-there-is-an-existing-address)
          * [Change account's password](#change-account's-password)
          * [Interact with cart](#interact-with-cart)
          * [Interact with orders](#interact-with-orders)

     2. [Products Catalogue](#products-catalogue)

          * [Browse products by gender](#browse-products-by-gender)
          * [Browse products by gender and category](#browse-products-by-gender-and-category)
          * [Browse products by brand](#browse-products-by-brand)
          * [Click on an item from the products list to read about the details](#Click-on-an-item-from-the-products-list-to-read-about-the-details)

     3. [Cart](#cart)
     4. [Checkout](#checkout)

          * [Billing](#billing)
          * [Payment](#payment)

     5. [Orders](#orders)

* [Technical Information](#technical-information)

    1. [Languages and Libraries](#languages-and-libraries)
    2. [Usage](#usage)

        * [Setup](#setup)
        * [Running Locally](#running-locally)
        * [Test Suites](#test-suites)

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

This project is created for learning purposes but with some configurations the shop could be turned into a real working product.<br/>
```
* Note that because this is a demo, 
  you shouldn't enter your real credit card information 
  for testing payment functionality. *

* Please use "dummy" credit cards provided in the Checkout section instead. *
```
---

Front page:

* On desktop:

     ![Home page on desktop](https://i.imgur.com/6oeggHW.png)

* On mobile:

     ![Home Page On Mobile](https://i.imgur.com/SdOAqoi.png)

---

## Features / User Guide
1. ### User 

   * #### Register an account.

     *This demo site doesn't send you any mail or text so you dont't have to enter the "real" phone and email.*

     * On desktop:
     ```
     1. Click on "LOGIN" in the upper right corner.
     2. Click on the text "CREATE ACCOUNT".
     3. Fill the fields.
     4. Click on "CREATE".
     ```

     * On mobile:
     ```
     1. Open the burger menu.
     2. Click on "LOGIN".
     3. -- ,, --
     ```

   * #### Log in as an user.

     * On desktop:
     ```
     1. Click on "LOGIN" in the upper right corner.
     2. Fill the "USERNAME" and "PASSWORD" fields.
     3. Click on "SIGN IN".
     ```
     * On mobile:
     ```
     1. Open the burger menu.
     2. Click on "LOGIN".
     3. -- ,, --
     ```

   * #### Update account information.

     * On desktop:
     ```
     1. Hover over your username in the top right corner.
     2. Click on "ACNT".
     3. Click on "CHNGE" under "MY ACNT".
     4. Replace the neccessary fields.
     5. Click on "SBMT".
     ```
     * On mobile:
     ```
     1. Click on the circle with the first letter of your username in the header.
     2. -- ,, --
     ```

   * #### Add an address if no address is already added.

     * On desktop:
     ```
     1. Hover over your username in the top right corner.
     2. Click on "ACNT".
     3. Fill the fields under "ADDRSS".
     4. Click on "SBMT".
     ```
     * On mobile:
     ```
     1. Click on the circle with the first letter of your username in the header.
     2. -- ,, --    
     ```

   * #### Update address info if there is an existing address.

     * On desktop:
     ```
     1. Hover over your username in the top right corner.
     2. Click on "ACNT".
     3. Click on "CHNGE" under "ADDRSS".
     4. Replace the neccessary fields.
     5. Click on "SBMT".
     ```
     * On mobile:
     ```
     1. Click on the circle with the first letter of your username in the header.
     2. -- ,, --    
     ```

   * #### Change account's password.

     * On desktop:
     ```
     1. Hover over your username in the top right corner.
     2. Click on "ACNT".
     3. Click on "UPDT PW".
     4. Fill the fields.
     5. Click on "SUBMIT".
     ```
     * On mobile: 
     ```
     1. Click on the circle with the first letter of your username in the header.
     2. -- ,, -- 
     ```

   * #### Interact with cart.

     * On desktop:
     ```
     1. Hover over your username in the top right corner.
     2. Click on "CART".
     ```
     * On mobile:
     ```
     1. Click on the circle with the first letter of your username in the header.
     2. -- ,, -- 
     ```

   * #### Interact with orders.

     * On Desktop:
     ```
     1. Hover over your username in the top right corner.
     2. Click on "ORDRS".
     ```
     * On Mobile:
     ```
     1. Click on the circle with the first letter of your username in the header.
     2. -- ,, -- 
     ```

---

2. ### Products Catalogue

   *You can browse the products catalogue as a guest or as an user.*

   * #### Browse products by gender:

     + On desktop click on "MN" or "WMN"
     + On mobile:
     ```
     1. Open the burger menu.
     2. Click on "MN" or "WMN".
     3. Select "ALL PRDCTS FR [ gender ] ".
     ```

   * #### Browse products by gender and category:

     + On desktop hover over "MN" or "WMN" and select a category.
     + On mobile:
     ```
     1. Open the burger menu.
     2. Click on "MN" or "WMN".
     3. Select a category.
     ```

   * #### Browse products by brand:

     + On desktop hover over "BRNDS" and select a brand.
     + On mobile:
     ```
     1. Open the burger menu.
     2. Click on "BRNDS".
     3. Select a brand.
     ```

   * #### Click on an item from the products list to read about the details.
     *Product's page*

        ![Stussy jacket](https://i.imgur.com/06zoRZB.png)

     * Select a size and add the item to cart.
     ```
     * If logged in displays "ADD TO CART".
     * If not logged in displays "LOG IN OR REGISTER".
     ```
---

3. ### Cart
     *(Only for logged in users)*

   * #### Cart item includes:

        + Thumbnail
        + Title
        + Brand
        + Size
        + Color
        + Price
        + Quantity
        
        ![Cart preview](https://i.imgur.com/FSxUCzU.png)

     
   * #### Change item quantity in cart based on availability by clicking on "-" or "+".
   * #### Remove an item from cart by clicking on "REMOVE ITEM".
   * #### Procceed to checkout by clicking on "CHECKOUT".
     
---

4. ### Checkout
     *(Only for logged in users)*

    * Opens as an overlay on the Cart page and functions as a two page form.
    * #### Billing

       ![Billing preview](https://i.imgur.com/D8O8ju7.png)

       * Option to use existing or custom address if you have a saved address.

            ![Use Existing Address](https://i.imgur.com/8yqB7bF.png)

       * Option to save inserted address if no address is already saved.

            ![Save Address](https://i.imgur.com/IvCyjk8.png)


        * Address requirements:

            + All fields must be filled.
            + For the sake of demo use, the entered address doesn't have to be a real world one but a **valid country must be entered**.

    * #### Payment

        ![Payment preview](https://i.imgur.com/ptCzjjP.png)

        * Preview order items.
        * **Test paying with three "dummy" credit cards:**
        
            + 4242 4242 4242 4242 <-- **for successful payment**
            + 4000 0027 6000 3184 <-- **for payment that requires 3D authentication**
            + 4000 0000 0000 0002 <-- **for declined card error**

        * Other card field requirements:

            * Enter a date in the future.
            * CVC and ZIP can be whatever as long as they are numeric values.

          *The confirm button doesn't work unless a valid credit card or one of the dummys is provided*

---

5. ### Orders
     *(Only for logged in users)*

   * #### View the list of completed orders:

     + Order id, date, total and payment status per order preview line.

     ![Orders](https://i.imgur.com/0nDM7YJ.png)
     ```
     ORDR NR acts as a hyperlink to order details page.
     ```
   * #### View completed order details:
     
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
      2. Navigate to the **root folder** with a **CLI** and **install** the back-end **packages**.
      ```
        $ cd .../e-commerce
      ```
      ```
        $ npm install
      ```
      3. Navigate to the **client folder** with a **CLI** and **install** the front-end **packages**.
      ```
        $ cd /client
      ```
      ```
        $ npm install
      ```
      4. Create a **PostgreSQL database** and insert the commands from **"e-comerce.sql"**.
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

      * Run the **whole app** from the **root folder** using a **CLI**.
        ```
        $ npm run dev
        ```
        *The app will be available at [http://localhost:3000/](http://localhost:3000/)* 

      * Run only the **Front-End** from the **root folder** using a **CLI**.
        ```
        $ npm run client
        ```
        *The app will be available at [http://localhost:3000/](http://localhost:3000/)*
      * Run only the **server** from the **root folder** using a **CLI**.
        ```
        $ npm run server
        ```
        *The app will be available at [http://localhost:5000/](http://localhost:5000/)*
    ---

    #### Test Suites

    Server testing suite covers all the CRUD operations.<br/>
    The suite is located in:
    >e-commerce/tests/server-test.js
    
    There are also helper functions in a subfolder that help the suite with some PostgreSQL queries that need to be performed before some tests.

    You can run the suite from the root directory using a CLI:
    >Folder: e-commerce
    ```
    $ npm test
    ```

    ---

    Front-End testing suites cover all the components functionality.<br/>
    Every parent component has a subfolder that contains a test suite for itself and the child components that it uses.

    You can run the suites from the 'client' folder using a CLI:
    >Folder: e-commerce/client
    ```
    $ npm test
    ```

---

