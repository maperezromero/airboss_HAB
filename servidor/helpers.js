const { format } = require('date-fns');
const sharp = require('sharp');
const uuid = require('uuid');
const { ensureDir, unlink } = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const { parse } = require('iso8601-duration');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { UPLOADS_DIRECTORY } = process.env;
//const uploadsDir = path.join(__dirname, UPLOADS_DIRECTORY);

//fijo API KEY de sendgrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/* 
   ##################################################
   ## Formatear un objeto fecha a DATETIME de SQL. ##
   ##################################################
*/
function formatDate(date) {
    return format(date, 'yyy-MM-dd HH:mm:ss');
}

/* 
   ######################################
   ## Formatear una duración PThhHmmM. ##
   ######################################
*/

function formatDuration(duration) {
    return parse(duration);
}

// console.log(formatDuration('P1Y2M3DT4H5M6S'));

/**
 * ##################
 * ## Enviar email ##
 * ##################
 */

async function sendMail({ to, subject, body, url }) {
    try {
        const msg = {
            to,
            from: process.env.SENDGRID_FROM,
            subject,
            text: body,
            html: `
                <div>
                    <h1>${subject}</h1>
                    <p>${body}</p>
                    <a href=${url}>Clica aquí</a> 
                </div>
            `,
        };
        await sgMail.send(msg);
    } catch (error) {
        //console.log(error);
        throw new Error('Error enviando email');
    }
}

/**
 * #############################################
 * ## Enviar email de confirmación de reserva ##
 * #############################################
 */

async function sendMailBooking({ to, subject, body, passengers }) {
    try {
        let passengersList='';
        for (const passenger of passengers){
            passengersList += `- ${passenger.name.firstName} ${passenger.name.lastName} <br>`; 

        }
        const msg = {
            to,
            from: process.env.SENDGRID_FROM,
            subject,
            text: body,
            html: `
                <div>
                    <h1>${subject}</h1>
                    <p>${body}</p>
                    <p>${passengersList}</p>
                </div>
            `,
        };
        await sgMail.send(msg);
    } catch (error) {
        console.log(error);
        throw new Error('Error enviando email');
    }
}

/**
 * #####################
 * ## Validar esquema ##
 * #####################
 */
async function validate(schema, data) {
    try {
        //console.log(data);
        await schema.validateAsync(data);
    } catch (error) {
        error.httpStatus = 400;
        throw error;
    }
}

/**
 * ###################
 * ## Random String ##
 * ###################
 *
 * Generamos una cadena de caracteres aleatoria.
 *
 */
function generateRandomString(length) {
    return crypto.randomBytes(length).toString('hex');
}

/**
 * ###########################
 * ## Guardar foto en disco ##
 * ###########################
 *
 * Guardar una foto en el directorio "uploads".
 *
 */

async function savePhoto(image) {
    // Comprobamos que el directorio de subida de imágenes existe.
    // console.log('DENTRO DE SAVEPHOTO', UPLOADS_DIRECTORY);
    console.log('Se guarda!');
    await ensureDir(UPLOADS_DIRECTORY, (err) => {
        console.log(err);
    });
    // Leer la imagen con sharp.
    const sharpImage = sharp(image.data);

    // Comprobamos que la imagen no tenga un tamaño mayor que "X" píxeles de ancho.
    // Para ello obtenemos los metadatos de la imagen.
    // console.log(sharpImage);
    const imageInfo = await sharpImage.metadata();

    // Definimos el ancho máximo.
    const IMAGE_MAX_WIDTH = 1000;

    // Si la imagen supera el ancho máximo definido anteriormente redimensionamos la
    // imagen.
    if (imageInfo.width > IMAGE_MAX_WIDTH) {
        sharpImage.resize(IMAGE_MAX_WIDTH);
    }

    // Generamos un nombre único para la imagen.
    const savedImageName = `${uuid.v4()}.jpg`;

    // Unimos el directorio de imagenes con el nombre de la imagen.
    const imagePath = path.join(UPLOADS_DIRECTORY, savedImageName);

    // Guardamos la imagen en el directorio de imágenes.
    await sharpImage.toFile(imagePath);
    // console.log('DENTRO DE SAVEPHOTO');

    // Retornamos el nombre del fichero.
    return savedImageName;
}

/**
 * ############################
 * ## Eliminar foto en disco ##
 * ############################
 *
 * Eliminar una foto del directorio "uploads".
 *
 */

async function deletePhoto(photoName) {
    const photoPath = path.join(uploadsDir, photoName);
    await unlink(photoPath);
}

const googleVerify = async (idToken = '') => {
    try {
        //console.log('LLEGA A GOOGLE VERIFY');
        //console.log(id_token,'****',process.env.GOOGLE_CLIENT_ID );
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        //console.log('PASA PROMESA');
        const { name, picture, email } = ticket.getPayload();
        //console.log(name, picture, email);
        return { name, picture, email };
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    formatDate,
    sendMail,
    sendMailBooking,
    validate,
    generateRandomString,
    savePhoto,
    deletePhoto,
    googleVerify,
    formatDuration,
};
