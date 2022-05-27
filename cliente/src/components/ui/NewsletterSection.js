import './css/newsletter.css';
import photo from '../../assets/newsletter.jpg';
import axios from 'axios';
import { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { Alert } from '@material-ui/lab';

export const NewsletterSection = () => {
    const [email, setEmail] = useState('');
    const [values, setValues] = useState({
        error: '',
        showError: false,
        ok: '',
        showOk: false,
    });

    const sumbitHandler = (e) => {
        e.preventDefault();

        const validateNewsletter = async () => {
            const { data } = await axios.post(
                `${process.env.REACT_APP_NODE_URL}/newsletter`,
                {
                    email,
                }
            );
            if (data.status === 'ok') {
                setValues({
                    showOk: true,
                    ok: `El email ${email} fue añadido correctamente.`,
                    showError: false,
                    error: '',
                });
                setEmail('');
            } else {
                setValues({
                    showOk: false,
                    ok: '',
                    showError: true,
                    error: `El email ${email} ya fue añadido anteriormente`,
                });
            }
        };
        validateNewsletter();
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setValues({ ...values, showError: false });
    };
    const handleCloseOk = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setValues({ ...values, showOk: false });
    };

    return (
        <div id='newsletter-container'>
            <h3>¿Quieres recibir ofertas a tu correo?</h3>
            <p>Suscríbete a nuestro newsletter</p>
            <div>
                <form onSubmit={sumbitHandler}>
                    <input
                        required
                        value={email}
                        type='email'
                        placeholder='Inserte su correo electrónico'
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                    <>
                        <Snackbar
                            open={values.showError}
                            autoHideDuration={2000}
                            onClose={handleClose}
                        >
                            <Alert onClose={handleClose} severity='error'>
                                {values.error}
                            </Alert>
                        </Snackbar>
                        <Snackbar
                            open={values.showOk}
                            autoHideDuration={2000}
                            onClose={handleCloseOk}
                        >
                            <Alert onClose={handleCloseOk} severity='success'>
                                {values.ok}
                            </Alert>
                        </Snackbar>
                    </>
                    <input type='submit' value='¡Quiero!' />
                </form>
                <figure>
                    <img src={photo} alt='newsletter' width='100%' />
                </figure>
            </div>
        </div>
    );
};
