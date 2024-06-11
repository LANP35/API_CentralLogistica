const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3002;


const {routerProveedores}=require('./Routers/supplier');
const {routerPurchaseOrders}=require('./Routers/purchaseOrder');
const {routerProducts}=require('./Routers/products');

app.use(cors());

// Middleware para verificar la API key
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['api-key'];

  if (apiKey && apiKey === "Password782") {
      next(); // Clave válida, pasa al siguiente middleware o ruta
  } else {
      //console.log(apiKey);
      res.status(401).json({ error: 'Api Key incorrecto' });
  }
};

app.use(apiKeyMiddleware);

//Routers
app.use('/api/supplier/', routerProveedores);
app.use('/api/purchaseOrder/', routerPurchaseOrders);
app.use('/api/products/', routerProducts);

app.get('/test', async (req, res) => {
  
  //console.log("Actualizado");
  res.status(200).json({"message":"ok"});

});


// Iniciar el servidor
app.listen(PORT, () => {
  
  console.log(`Servidor corriendo en http://localhost:${PORT}`);

});

