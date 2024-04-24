const express = require('express');
const cradle = require('cradle');
const app = express();
const nodemailer = require('nodemailer');
const axios = require('axios');
const { transporter } = require('../mensaje.js');
//Router

const routerPurchaseOrders = express.Router();

// Middleware para procesar solicitudes con datos JSON

routerPurchaseOrders.use(express.json());


//-----------Dirección de nodos-------------:
const { direccionNodoConsenso } = require('../variables');


//--------------------Configurar Api Key--------------------

const headers = {
    'api-key': 'Password783'
  };

//---------------------------------------------  


//Registrar Orden de Compra

routerPurchaseOrders.post('/registerPurchaseOrder', async (req, res) => {

    //Obtener el correo
    const email = req.body.emailSupplier;

    //Obtener variables
    const { nombreProveedor, fechaOrden, infoRecepcion, total, orderDetails } = req.body.doc1;

    //Crear Cuerpo del correo:
    let bodyMessage = `

¡Hola ${nombreProveedor}!

Buenas tardes, me gustaría realizar una orden de compra para los siguientes productos:

Fecha de compra: ${fechaOrden}

|---Producto ---|---Cantidad---|

${orderDetails.map(item => `|---${item.productName}---|--- ${item.cantidad}---|`).join('\n')}

Info de Recepcion: ${infoRecepcion}

Gracias por su tiempo, espero su confirmación de la Orden

`;


    //Enviar correo:
    // Detalles del correo electrónico para notificar falla
    let mailOptions = {
        from: 'tp2mensaje@gmail.com', // Remitente
        to: email, // Destinatario
        subject: 'Orden de Compra', // Asunto
        text: bodyMessage // Contenido del correo
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo electrónico:', error);
        } else {
            console.log('Correo electrónico enviado:', info.response);
        }
    });


    //Enviar informacion a los nodos
    response1 = await axios.post(`${direccionNodoConsenso}/api/logistica/purchaseOrders/newPurchaseOrder`, req.body.doc1, { headers });

    //-------------------------------Final-----------------------------

    if (response1.status = 200) {
        console.log("Los servidores recibieron la información de manera correcta");
        res.status(200).json({ "message": "Se registro la orden de Compra de manera correcta" })
    } else {
        console.log("No se pudo enviar de manera correcta la información a los nodos")
    }

});



//Obtener todas las ordenes de compras
routerPurchaseOrders.get('/getPurchaseOrders', async (req, res) => {

    response1 = await axios.get(`${direccionNodoConsenso}/api/logistica/purchaseOrders/getPurchaseOrders`,{ headers });

    res.status(200).json(response1.data);

});


//Obtener una Órden de compra en Específico:
routerPurchaseOrders.get('/getPuchaseOrder/:id', async (req, res) => {

    const id = req.params.id;

    response1 = await axios.get(`${direccionNodoConsenso}/api/logistica/purchaseOrders/purchaseOrder/${id}`,{ headers });

    res.status(200).json(response1.data);

});


//Modificar la orden de compra

routerPurchaseOrders.put('/modifyPurchaseOrder/:id', async (req, res) => {

    const id = req.params.id;

    response1 = await axios.put(`${direccionNodoConsenso}/api/logistica/purchaseOrders/modifyPurchaseOrder/${id}`, req.body, { headers });

    if (response1.status = 200) {
        console.log("Los servidores recibieron la información de manera correcta");
        res.status(200).json({ "message": "Se modificó la órden de Compra de manera correcta" })

    } else {
        console.log("No se pudo enviar de manera correcta la información a los nodos")
    }
});


//Export

module.exports.routerPurchaseOrders = routerPurchaseOrders;