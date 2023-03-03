
const client  = require('./client');

 async function createCart(userId, productIds) {

   if (!userId) {
     userId = null
   }

   try {
     const { rows: [cart] } = await client.query(`
           INSERT INTO cart ("userId", "productIds") 
             VALUES($1, $2) 
             RETURNING *;
           `, [userId, productIds]);


     return cart;
    } catch (error) {
      throw error
    }
  }
 
  async function getCartById(id) {
 
    try {
      const { rows: [cart] } = await client.query(`
          SELECT *
          FROM cart
          WHERE id=${id};
          `, [id]);

          if (!cart) {
            throw {
              error: "error",
              name: "CartNotFound",
              message: "Cart was not found"
            };
          }
     
          return cart;
        } catch (error) {
          throw error;
        }
      }
     
      async function getCartByUserId(userId) {
     
        try {
          const { rows: [cart] } = await client.query(`
              SELECT *
              FROM cart
              WHERE "userId"=${id};
            `, [userId]);
           
            if (!cart) {
                throw {
                  error: "error",
                  name: "CartNotFound",
                  message: "Cart was not found"
                };
              }
         
              return cart;
            } catch (error) {
              throw error;
            }
          }

          async function addToCart(userId, newProductId) {
            const newCart = await getCartById(userId)
   newCart.productIds.push(newProductId)
   const newProductIds = newCart.productIds

   try {
     await client.query(`
         UPDATE cart
         SET "productIds" = '{${newProductIds}}'
         WHERE "userId"=${userId}
         RETURNING *;
         `)

     return newCart
   } catch (error) {
     throw error;
   }
 }

 async function removeFromCart(userId, newProductId) {

   const newCart = await getCartById(userId)

   for (let i = 0; i < newCart.productIds.length; i++) {

     if (newCart.productIds[i] = newProductId) {

       const newCart = await getCartById(userId)
       const newProductIds = newCart.productIds
       const index = newProductIds.indexOf(newProductId)

       newProductIds.splice(index, 1)

       try {
         await client.query(`
         UPDATE cart
         SET "productIds" = '{${newProductIds}}'
         WHERE "userId"=${userId}
         RETURNING *;
         `)

         return newCart
       } catch (error) {
         throw error;
       }
     }
   }
 }

 async function updateCart({ userId, ...fields }) {

   const setString = Object.keys(fields).map(
     (key, index) => `"${key}"=$${index + 1}`
   ).join(', ');

   if (setString.length === 0) {
     return;
   }

   try {
     if (setString.length > 0) {
       await client.query(`
         UPDATE cart
         SET ${setString}
         WHERE "userId"=${userId}
         RETURNING *;
       `, Object.values(fields));
     }

     return await getCartByUserId(userId);
   } catch (error) {
     throw error;
   }

 }

 async function destroyCart(userId) {

   try {
     const { rows } = await client.query(`
     DELETE from cart
     WHERE "userId"=$1
     RETURNING *;
   `, [userId]);

     return rows;
   } catch (error) {
     throw error
   }
 }

 module.exports = {
   createCart,
   getCartById,
   getCartByUserId,
   destroyCart,
   addToCart,
   removeFromCart,
   updateCart
 }
