const express = require('express');
const cradle = require('cradle');
const app = express();
const nodemailer = require('nodemailer');
const axios = require('axios');

//Router
const routerProducts = express.Router();

//-----------------------------------------------------------------------------------

// Middleware para procesar solicitudes con datos JSON
routerProducts.use(express.json());


//------------------Dirección de nodos-----------------:

const {direccionNodoConsenso}=require('../variables');


//--------------------Configurar Api Key--------------------

const headers = {
    'api-key': 'Password783'
  };

//----------------------------------Peticiones---------------------



//Registrar un producto

routerProducts.post('/registerProduct', async (req, res) => {

    //Enviar informacion a los nodos
    response1 = await axios.post(`${direccionNodoConsenso}/api/logistica/products/newProduct`, req.body, { headers });

    //-------------------------------Final-----------------------------

    if (response1.status = 200) {
        console.log("Los servidores recibieron la información de manera correcta");
        res.status(200).json({"message":"Se registro el proveedor de manera correcta"})
    }else{
        console.log("No se pudo enviar de manera correcta la información a los nodos")
    }

});



routerProducts.get('/getProducts', async (req, res) => {

    response1 = await axios.get(`${direccionNodoConsenso}/api/logistica/products/getAllProducts`,{ headers });

    res.status(200).json(response1.data);

});



routerProducts.get('/getProduct/:id', async (req, res) => {

    const id=req.params.id;

    response1 = await axios.get(`${direccionNodoConsenso}/api/logistica/products/Product/${id}`,{ headers });

    console.log("Enviando datos");
    console.log(response1.data);

    res.status(200).json(response1.data);

});


//Modify Supplier

routerProducts.put('/modifyProduct/:id', async (req, res) => {

    const id=req.params.id;

    response1 = await axios.put(`${direccionNodoConsenso}/api/logistica/products/ModifyProduct/${id}`,req.body,{ headers });
    
    if (response1.status = 200) {
        console.log("Los servidores recibieron la información de manera correcta");
        res.status(200).json({"message":"Se modificó el proveedor de manera correcta"})
    }else{
        console.log("No se pudo enviar de manera correcta la información a los nodos")
    }

});

module.exports.routerProducts = routerProducts;