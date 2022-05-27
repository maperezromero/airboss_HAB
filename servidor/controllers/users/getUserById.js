const { getDB } = require('../../bbdd/db');

const getUserById = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();

        const { idUser } = req.params;

        // Obtenemos el email del usuario actual.
        const [user] = await connection.query(
            `
            SELECT email, avatar, name, lastname, nationality, birthDate, createdAt, phoneNumber, birthDate FROM users WHERE id = ?`,
            [idUser]
        );

        //console.log(req.headers);
        if (
            user[0].avatar[0] === 'h' &&
            user[0].avatar[1] === 't' &&
            user[0].avatar[2] === 't'
        ) {
            // user[0].avatar = ${user[0].avatar};
        } else {
            user[0].avatar = `${process.env.REACT_APP_NODE_URL}/static/uploads/${user[0].avatar}`;
        }

        res.send({
            status: 'ok',
            data: user,
        });
    } catch (error) {
        console.log(error);
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { getUserById };
