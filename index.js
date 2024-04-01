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


app.use(cors());

//Routers
app.use('/api/supplier/', routerProveedores);

// Iniciar el servidor
app.listen(PORT, () => {
  
  console.log(`Servidor corriendo en http://localhost:${PORT}`);

});

