import { useState, useEffect, useContext } from 'react';
import './css/restore-form.css';
//import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { AuthContext } from '../../App';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';
import validator from 'validator';
import { useHistory } from 'react-router-dom';

/* const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(10),
      width: '50px',
      
    },
  },
})); */

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}
function RestorePasswordForm() {
    //setShowForm, setLogin, login
    const history = useHistory();
    const [values, setValues] = useState({
        email: '',
        password: '',
        showPassword: false,
        error: '',
        showError: false,
        ok: '',
        showOk: false,
    });
    const { setShowRegisterForm, ref, animation, setOpacity } =
        useContext(AuthContext);

    useEffect(() => {
        setOpacity({
            opacity: 0.5,
        });
        setShowRegisterForm(false);
        return () => {
            setOpacity({
                opacity: 1,
            });
        };
    }, [setOpacity, setShowRegisterForm]);

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

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        if (
            event.target.id === 'standard-basic-email' &&
            event.charCode === 13
        ) {
            onSubmitLogin(event);
        }
    };
    async function onSubmitLogin(event) {
        //console.log('ENTRA EN SUBMIT');
        event.preventDefault();
        // console.log(values.email);
        if (validator.isEmail(values.email)) {
            const body = {
                email: values.email,
            };
            try {
                const res = await axios.put(
                    'http://localhost:3001/users/password/recover',
                    body
                );

                if (res.data.status === 'ok') {
                    setValues({
                        ...values,
                        ok: 'Enviado email con código de reseteo',
                        showOk: true,
                    });
                    setTimeout(() => {
                        history.push('/');
                    }, 2000);
                }
            } catch (error) {
                // console.log(error);
                setValues({
                    ...values,
                    error: 'Ha habido un error',
                    showError: true,
                });
            }
        } else {
            setValues({
                ...values,
                error: 'Introduce un email válido',
                showError: true,
            });
        }
    }

    return (
        <div
            className={'restore-password-form animate__animated ' + animation}
            ref={ref}
        >
            <h3>Solicitar reseteo</h3>
            <p>Ingrese su correo electrónico</p>
            <form onSubmit={onSubmitLogin}>
                <div>
                    <TextField
                        className='inputs-form'
                        id='standard-basic-email'
                        label='Correo electrónico'
                        value={values.email}
                        onChange={handleChange('email')}
                    />
                </div>
                <div>
                    <Button
                        variant='contained'
                        id='button-login'
                        color='primary'
                        className='button-form'
                        onClick={onSubmitLogin}
                    >
                        Solicitar reseteo
                    </Button>
                </div>
                <>
                    <Snackbar
                        open={values.showError}
                        autoHideDuration={3000}
                        onClose={handleClose}
                    >
                        <Alert onClose={handleClose} severity='error'>
                            {values.error}
                        </Alert>
                    </Snackbar>
                    <Snackbar
                        open={values.showOk}
                        autoHideDuration={3000}
                        onClose={handleCloseOk}
                    >
                        <Alert onClose={handleClose} severity='success'>
                            {values.ok}
                        </Alert>
                    </Snackbar>
                </>
            </form>
        </div>
    );
}

export default RestorePasswordForm;
