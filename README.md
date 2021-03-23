# REVARZ

**PERN Stack E-Commerce Demo Store**<br/>
Created By **Ezayji** in February - March 2021<br/>
[Live Version](https://revarz.herokuapp.com/)

---

## General Information

REVARZ is a streetwear e-store that offers a colorful and refreshing selection of the newest trends. Current selection includes 20 products from 4 manufacturers:

* Carhartt WIP
* Edwin
* RIPNDIP
* Stüssy

---

The site is built keeping in mind the growing variety of products and brands to be featured on the catalogue meaning that the front-end and the back-end code are both scalable enough to handle an addition of brands and products to the database.

This project is created for learning purposes but with some configurations the shop could be turned into a real working product.<br/>

     * Note that because this is a demo, you shouldn't enter your real credit card information for testing payment functionality. Please use "dummy" credit cards provided below instead. *

---

Front page:

* On desktop:

     ![Home page on desktop](https://i.imgur.com/6oeggHW.png)

* On mobile:

     ![Home Page On Mobile](https://i.imgur.com/SdOAqoi.png)

---

## Features
1. **User** 

   * Register an account.
   * Log in as an user.
   * Update account information.
   * Add an address if no address is already added.
   * Update address info if there is an existing address.
   * Change account's password.
   * Interact with cart.
   * Interact with orders.

2. **Products Catalogue**

   * Browse items catalogue as a guest or as an user.
   * Browse products by gender:

     + On desktop click on "MN" or "WMN"
     + On mobile:

          1. Open burger menu.
          2. Click on "MN" or "WMN".
          3. Select "ALL PRDCTS FR [ gender ] ".

   * Browse products by gender + category:

     + On desktop hover over "MN" or "WMN" and select a category.
     + On mobile:

          1. Open burger menu.
          2. Click on "MN" or "WMN".
          3. Select a category.

   * Browse products by manufacturer / brand:

     + On desktop hover over "BRNDS" and select a brand.
     + On mobile:

          1. Open burger menu.
          2. Click on "BRNDS".
          3. Select a brand.

   * Read product details on product's page.

        ![Stussy jacket](https://i.imgur.com/06zoRZB.png)

   * Select a size and add the item to cart. <== **Must be logged in!**
     + If logged in displays "ADD TO CART".
     + If not logged in displays "LOG IN OR REGISTER".


3. **Cart**

   * Cart item includes:

        + Thumbnail
        + Title
        + Brand
        + Size
        + Color
        + Price
        + Quantity
        
        ![Cart preview](https://i.imgur.com/FSxUCzU.png)


   * Change item quantity in cart based on availability by clicking "-" or "+".
   * Remove an item from cart.
   * Procceed to checkout.
   
4. **Checkout**

    * Opens as an overlay on the Cart page and functions as a two page form.
    * Billing

       ![Billing preview](https://i.imgur.com/D8O8ju7.png)

       * Option to use existing or custom address if you have a saved address.

            ![Use Existing Address](https://i.imgur.com/8yqB7bF.png)

       * Option to save inserted address if no address is already saved.

            ![Save Address](https://i.imgur.com/IvCyjk8.png)


        * Address requirements:

            + All fields must be filled.
            + For the sake of demo use, the entered address doesn't have to be a real world one but a **valid country must be entered**.

    * Payment

        ![Payment preview](https://i.imgur.com/ptCzjjP.png)

        * Preview order items.
        * **Test paying with three "dummy" credit cards:**
        
            + 4242 4242 4242 4242 <-- **for successful payment**
            + 4000 0027 6000 3184 <-- **for payment that requires 3D authentication**
            + 4000 0000 0000 0002 <-- **for declined card error**

        * Other card field requirements:

            * Enter a date in the future.
            * CVC and ZIP can be whatever as long as they are numeric values.
   
5. **Orders**

   * View completed orders:

     + Order id, date, total and payment status per order preview line.

   * View completed order details:
     
     + Delivery Address.
     + Items + details.
     + Total price paid. 

---

## Technical Information

