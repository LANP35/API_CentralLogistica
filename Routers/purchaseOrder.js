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


//------------------Dirección de nodos-----------------:

const { direccionNodoConsenso, certificadoDigital, direccionNodeExecutive, direccionNodeLogistics } = require('../variables');

//--------------------Configurar Api Key--------------------

const headerconsenso = {
    'api-key': 'Password783',
    'cert-dig': JSON.stringify(certificadoDigital)
};

const headerExecutive = {
    'api-key': 'Password785',
    'cert-dig': JSON.stringify(certificadoDigital)
};

const headerLogistics = {
    'api-key': 'Password786',
    'cert-dig': JSON.stringify(certificadoDigital)
};


//---------------------------------------------  


//Registrar Orden de Compra

routerPurchaseOrders.post('/registerPurchaseOrder', async (req, res) => {

    //Obtener el correo
    const email = req.body.emailSupplier;
    //Obtener variables
    const { nombreProveedor, fechaOrden, infoRecepcion, total, orderDetails } = req.body.doc1;
    //Enviar Correo
    enviarCorreoPurchaseOrder(nombreProveedor, fechaOrden, infoRecepcion, total, orderDetails,email);

    //-------------Procesamiento de la información-------------------
    let objEnviar=req.body.doc1;

    let fecha = new Date();
    let fechaString = fecha.toLocaleString();

    objEnviar["date"] = fechaString;

    //Enviar informacion a los nodos
    try {
        response1 = await axios.post(direccionNodoConsenso+"/api/logistica/purchaseOrders/newPurchaseOrder", objEnviar , { headers: headerconsenso });
    } catch (error) {
        console.log("Error al hacer la petición");
        response1 = { status: 404, data: "123" };
        MensajeNodeOffline(error, "Node Consensus");
    }

    try {
        response2 = await axios.post(direccionNodeExecutive+"/api/logistica/purchaseOrders/newPurchaseOrder", objEnviar , { headers: headerExecutive });
    } catch (error) {
        console.log("Error al hacer la petición");
        response2 = { status: 404, data: "123" };
        MensajeNodeOffline(error, "Node Executive");
    }

    try {
        response3 = await axios.post(direccionNodeLogistics+"/api/logistica/purchaseOrders/newPurchaseOrder", objEnviar , { headers: headerLogistics });
    } catch (error) {
        console.log("Error al hacer la petición");
        response3 = { status: 404, data: "123" };
        MensajeNodeOffline(error, "Node Logistics");
    }


     //--------------Verificar Consistencia de todos los nodos----------------
     {
        if (JSON.stringify(response1.data) == JSON.stringify(response3.data)
            && JSON.stringify(response2.data) == JSON.stringify(response3.data)
            && JSON.stringify(response1.data) == JSON.stringify(response2.data)
        ) {
            console.log("Todos concuerdan");
        } else {
            console.log("No concuerdan todos");
            //Envia mensaje
            noConcuerdanTodos(response1.data, response2.data, response3.data);
            return res.status(404).json({ "messageError": "No se pudo procesar la transacción" });
        }
    }

    {
        console.log("Enviando información a los bloques");

        let bloqueComun;

        if (JSON.stringify(response1.data) == JSON.stringify(response3.data)
            || JSON.stringify(response2.data) == JSON.stringify(response3.data)
            || JSON.stringify(response1.data) == JSON.stringify(response2.data)
        ) {

            if (JSON.stringify(response1.data) == JSON.stringify(response3.data)) {
                bloqueComun = response1.data;
                //console.log("El bloque común es:", bloqueComun);
            }

            if (JSON.stringify(response2.data) == JSON.stringify(response3.data)) {
                bloqueComun = response2.data;
                //console.log("El bloque común es:", bloqueComun);
            }

            if (JSON.stringify(response1.data) == JSON.stringify(response2.data)) {
                bloqueComun = response1.data;
                //console.log("El bloque común es:", bloqueComun);
            }

            //---------------------Enviar Bloque-----------------------

            try {
                let responseConsenso = await axios.post(direccionNodoConsenso + "/api/logistica/purchaseOrders/addBlockNew", bloqueComun, { headers: headerconsenso });
            } catch (error) {
                MensajeNodeOffline(error, "Node Consensus");
            }

            try {
                let responseExecutive = await axios.post(direccionNodeExecutive + "/api/logistica/purchaseOrders/addBlockNew", bloqueComun, { headers: headerExecutive });
            } catch (error) {
                MensajeNodeOffline(error, "Node Executive");
            }

            try {
                let responseLogistics = await axios.post(direccionNodeLogistics + "/api/logistica/purchaseOrders/addBlockNew", bloqueComun, { headers: headerLogistics });
            } catch (error) {
                MensajeNodeOffline(error, "Node Logistics");
            }

            console.log("Transferencia Correcta");
            return res.status(200).json({ "message": "Todo Correcto" });
        }
        else {
            TransaccionErronea(objEnviar);
            return res.status(404).json({ "messageError": "No se pudo procesar la transacción" });
        }
    }
});



function enviarCorreoPurchaseOrder(nombreProveedor, fechaOrden, infoRecepcion, total, orderDetails,email){
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

}

//-----Mensajes-------
function MensajeNodeOffline(error, nombreNodo) {

    if (error.code === 'ECONNREFUSED') {

        console.error("Error al enviar la información al servidor. Al menos un nodo esta offline, revisar el estado de los nodos por favor");

        // Detalles del correo electrónico para notificar falla
        let mailOptions = {
            from: 'tp2mensaje@gmail.com', // Remitente
            to: 'tp2mensaje@gmail.com', // Destinatario
            subject: 'Problemas con el nodo: ' + nombreNodo, // Asunto
            text: 'Aparentemente un el nodo' + nombreNodo + 'se encuentra offline, por favor revisar su estado' // Contenido del correo
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo electrónico:', error);
            } else {
                console.log('Correo electrónico enviado:', info.response);
            }
        });
    } else {
        console.error("Error al enviar la información. Detalles:", error);
    }
}

function noConcuerdanTodos(a, b, c) {
    let mailOptions = {
        from: 'tp2mensaje@gmail.com', // Remitente
        to: 'tp2mensaje@gmail.com', // Destinatario
        subject: 'Problemas de Consistencia entre los bloques de transacción', // Asunto
        text: 'Detalle: \n Response del API nodeConsensus' + a.data + "-------\n Response del API nodeExecutive" + b.data + "-------\n  Response del API nodeLogistics" + c.data// Contenido del correo
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo electrónico:', error);
        } else {
            console.log('Correo electrónico enviado:', info.response);
        }
    });
}

function TransaccionErronea(objEnviar) {
    let mailOptions = {
        from: 'tp2mensaje@gmail.com', // Remitente
        to: 'tp2mensaje@gmail.com', // Destinatario
        subject: 'Transacción Erronea', // Asunto
        text: 'Detalles de la transacción: ' + objEnviar
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo electrónico:', error);
        } else {
            console.log('Correo electrónico enviado:', info.response);
        }
    });
}



//-------------------------------------------GET-------------------------------------

//Obtener todas las ordenes de compras
routerPurchaseOrders.get('/getPurchaseOrders', async (req, res) => {

    try {
        response1 = await axios.get(direccionNodoConsenso+"/api/logistica/purchaseOrders/getPurchaseOrders",{ headers: headerconsenso });

    } catch (error) {
        try {
            response1 = await axios.get(direccionNodeExecutive+"/api/logistica/purchaseOrders/getPurchaseOrders",{ headers: headerExecutive });

        } catch (error) {

            res.status(404).send(error);
        }
    }
    res.status(200).json(response1.data);

});


//Obtener una Órden de compra en Específico:
routerPurchaseOrders.get('/getPuchaseOrder/:id', async (req, res) => {

    const id = req.params.id;

    try {
        response1 = await axios.get(direccionNodoConsenso+"/api/logistica/purchaseOrders/purchaseOrder/"+id,{ headers: headerconsenso });

    } catch (error) {
        try {
            response1 = await axios.get(direccionNodeExecutive+"/api/logistica/purchaseOrders/purchaseOrder/"+id,{ headers: headerExecutive });

        } catch (error) {

            res.status(404).send(error);
        }
    }
    res.status(200).json(response1.data);

});

/*
//Modificar la orden de compra
routerPurchaseOrders.put('/modifyPurchaseOrder/:id', async (req, res) => {

    const id = req.params.id;

    response1 = await axios.put(direccionNodoConsenso+"/api/logistica/purchaseOrders/modifyPurchaseOrder/"+id, req.body, { headers });

    if (response1.status = 200) {
        console.log("Los servidores recibieron la información de manera correcta");
        res.status(200).json({ "message": "Se modificó la órden de Compra de manera correcta" })

    } else {
        console.log("No se pudo enviar de manera correcta la información a los nodos")
    }
});
*/

//Export

module.exports.routerPurchaseOrders = routerPurchaseOrders;