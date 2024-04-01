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
    response1 = await axios.post('http://192.168.18.170:3000/api/logistica/newSupplier', lastSupplier);

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

    response1 = await axios.get('http://192.168.18.170:3000/api/logistica/getAllSuppliers');

    res.status(200).json(response1.data);

});

//Obtener un proveedor en Específico:

routerProveedores.get('/getSupplier/:id', async (req, res) => {

    const id=req.params.id;

    response1 = await axios.get(`http://192.168.18.170:3000/api/logistica/Supplier/${id}`);

    res.status(200).json(response1.data);

});


//Modify Supplier

routerProveedores.get('/modifySupplier/:id', async (req, res) => {

    const id=req.params.id;

    response1 = await axios.get(`http://192.168.18.170:3000/api/logistica/ModifySupplier/${id}`);
    
    res.status(200).json(response1.data);

});

module.exports.routerProveedores = routerProveedores;