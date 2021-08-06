const {getDB} = require('../../bbdd/db');
const {
    validate,
    generateRandomString,
    sendMail,
    formatDate,
} = require('../../helpers');
const { newUserSchema } = require('../../schemas/newUserSchema');

const newUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Validamos los datos.
        await validate(newUserSchema, req.body);
        // console.log(req.body);
        const { email, password, name, lastname, birthday, nationality, phone } = req.body;

        // Comprobamos si existe en la base de datos un usuario con ese email.
        const [user] = await connection.query(
            `SELECT id FROM users WHERE email = ?;`,
            [email]
        );

        if (user.length > 0) {
            const error = new Error(
                'Ya existe un usuario con ese email en la base de datos'
            );
            error.httpStatus = 409;
            throw error;
        }

        // Creamos un código de registro (de un solo uso).
        const registrationCode = generateRandomString(40);

        // Mensaje que enviaremos al usuario.
        const emailBody = `
            Has solicitado el registro en airboss.
            Pulsa en este link para verificar tu cuenta: ${process.env.PUBLIC_HOST}/users/validate/${registrationCode}
        `;

        // Enviamos el mensaje.
        await sendMail({
            to: email,
            subject: 'Activa tu usuario de airboss',
            body: emailBody,
        });
        
        // Guardamos al usuario en la base de datos junto al código de registro.
        await connection.query(
            `INSERT INTO users (email, name, lastname, password, registrationCode, createdAt, birthDate, nationality, phoneNumber) VALUES (?, ?,?, SHA2(?, 512), ?, ?, ?, ?, ?);`,
            [email, name, lastname, password, registrationCode, formatDate(new Date()), birthday, nationality, phone]
        );

        res.send({
            status: 'ok',
            message: 'Usuario registrado, comprueba tu email para activarlo',
        });
    } catch (error) {
        console.log(error);
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {newUser};
