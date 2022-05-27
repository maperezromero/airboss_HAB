const { getDB } = require('../../bbdd/db');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        const [user] = await connection.query(
            `SELECT id, role, active, name, lastname, phoneNumber, nationality, createdAt, birthDate, avatar FROM users WHERE email = ? AND password = SHA2(?, 512);`,
            [email, password]
        );

        // Si no existe el usuario...
        if (user.length < 1) {
            res.send({
                status: 'No existe',
                data: {},
            });
        }

        // Si existe pero no está activo...
        if (!user[0].active) {
            const error = new Error('Usuario pendiente de validar');
            error.httpStatus = 401;
            throw error;
        }

        // Creamos un objeto con información que le pasaremos al token.
        const tokenInfo = {
            idUser: user[0].id,
            role: user[0].role,
        };

        // Creamos el token.
        const token = jwt.sign(tokenInfo, process.env.SECRET, {
            expiresIn: '7d',
        });

        const name = user[0].name;
        const lastname = user[0].lastname;
        const phoneNumber = user[0].phoneNumber;
        const nationality = user[0].nationality;
        const createdAt = user[0].createdAt;
        const birthDate = user[0].birthDate;
        const idUser = user[0].id;
        const avatar = user[0].avatar;

        res.send({
            status: 'ok',
            data: {
                token,
                idUser,
                name,
                lastname,
                phoneNumber,
                nationality,
                createdAt,
                birthDate,
                avatar: `${process.env.REACT_APP_NODE_URL}/static/uploads/${avatar}`,
                idUser,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { loginUser };
