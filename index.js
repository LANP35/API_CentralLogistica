const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3002;

/*
const {routerLogin}= require('./Routers/login.js');
const {routerRegUser}=require('./Routers/register.js');
const {routerGestionUsuario}=require('./Routers/gestionUsuarios.js');
*/
const {routerProveedores}=require('./Routers/supplier');
const {routerPurchaseOrders}=require('./Routers/purchaseOrder');
const {routerProducts}=require('./Routers/products');

app.use(cors());

//Routers
app.use('/api/supplier/', routerProveedores);
app.use('/api/purchaseOrder/', routerPurchaseOrders);
app.use('/api/products/', routerProducts);

app.get('/test', async (req, res) => {

  res.status(200).json({"message":"ok"});

});


// Iniciar el servidor
app.listen(PORT, () => {
  
  console.log(`Servidor corriendo en http://localhost:${PORT}`);

});

