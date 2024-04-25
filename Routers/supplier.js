const express = require('express');
const cradle = require('cradle');
const app = express();
const nodemailer = require('nodemailer');
const axios = require('axios');

//Router
const routerProveedores = express.Router();

//-----------------------------------------------------------------------------------

// Middleware para procesar solicitudes con datos JSON
routerProveedores.use(express.json());


//------------------Dirección de nodos-----------------:

const {direccionNodoConsenso,certificadoDigital}=require('../variables');


//--------------------Configurar Api Key--------------------

const headers = {
    'api-key': 'Password783',
    'cert-dig': JSON.stringify(certificadoDigital)
  };

//----------------------------------Peticiones---------------------

//Registrar Supplier

routerProveedores.post('/registerSupplier', async (req, res) => {

    const { name, email, phone, ruc } = req.body;

    const lastSupplier = {
        name: name,
        email: email,
        phone: phone,
        ruc: ruc
    };

    //Enviar informacion a los nodos
    response1 = await axios.post(direccionNodoConsenso+"/api/logistica/suppliers/newSupplier", lastSupplier,{ headers });



    //-------------------------------Final-----------------------------

    if (response1.status = 200) {
        console.log("Los servidores recibieron la información de manera correcta");
        res.status(200).json({"message":"Se registro el proveedor de manera correcta"})
    }else{
        console.log("No se pudo enviar de manera correcta la información a los nodos")
    }

});

//Obtener todos los suppliers

routerProveedores.get('/getSuppliers', async (req, res) => {

    response1 = await axios.get(direccionNodoConsenso+"/api/logistica/suppliers/getAllSuppliers",{ headers });

    res.status(200).json(response1.data);

});

//Obtener un proveedor en Específico:

routerProveedores.get('/getSupplier/:id', async (req, res) => {

    const id=req.params.id;

    response1 = await axios.get(direccionNodoConsenso+"/api/logistica/suppliers/Supplier/"+id,{ headers });

    res.status(200).json(response1.data);

});


//Modify Supplier

routerProveedores.put('/modifySupplier/:id', async (req, res) => {

    const id=req.params.id;

    response1 = await axios.put(direccionNodoConsenso+"/api/logistica/suppliers/ModifySupplier/"+id,req.body, { headers });
    
    if (response1.status = 200) {
        console.log("Los servidores recibieron la información de manera correcta");
        res.status(200).json({"message":"Se modificó el proveedor de manera correcta"})
    }else{
        console.log("No se pudo enviar de manera correcta la información a los nodos")
    }

});


module.exports.routerProveedores = routerProveedores;