const { getDB } = require('../../bbdd/db');
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
        console.log('el body', req.body);
        // await validate(newUserSchema, req.body);
        const {
            email,
            password,
            name,
            lastname,
            birthday,
            nationality,
            phone,
            avatar,
        } = req.body;

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
            Pulsa abajo para completar el registro. Gracias!
        `;

        // Enviamos el mensaje.
        await sendMail({
            to: email,
            subject: 'Activa tu usuario de airboss',
            body: emailBody,
            url: `${process.env.PUBLIC_HOST}/users/validate/${registrationCode}`
        });

        // Guardamos al usuario en la base de datos junto al código de registro.
        await connection.query(
            `INSERT INTO users (email, name, lastname, password, registrationCode, createdAt, birthDate, nationality, phoneNumber, avatar) VALUES (?, ?,?, SHA2(?, 512), ?, ?, ?, ?, ?, ?);`,
            [
                email,
                name,
                lastname,
                password,
                registrationCode,
                formatDate(new Date()),
                birthday,
                nationality,
                phone,
                avatar,
            ]
        );

        const [idUser] = await connection.query(
            `SELECT id FROM users WHERE email = ?;`,
            [email]
        );

        res.send({
            status: 'ok',
            message: 'Usuario registrado, comprueba tu email para activarlo',
            idUser,
        });
    } catch (error) {
        console.log(error);
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { newUser };
