import { useState, useEffect, useContext, useRef } from 'react';
import './css/login-form.css';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import clsx from 'clsx';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import GoogleLogin from 'react-google-login';
import { AuthContext } from '../../App';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Link } from 'react-router-dom';
import axios from 'axios';

import logo3 from '../../assets/isologo.png';

const idGoogle = process.env.REACT_APP_ID_GOOGLE;
const urlGoogle = `${idGoogle}-pelele5h6cbtvccnk47pourck5eq82pd.apps.googleusercontent.com`;

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            width: '100%',
        },
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}
function LoginForm() {
    const [values, setValues] = useState({
        email: '',
        password: '',
        showPassword: false,
        error: '',
        showError: false,
        ok: '',
        showOk: false,
    });
    const classes = useStyles();
    const {
        login,
        setShowForm,
        setShowRegisterForm,
        setRestorePasswordForm,
        setLogin,
        setNameUser,
        setLastname,
        setEmail,
        animation,
        setOpacity,
        setPicture,
        setNationality,
        setPhone,
        setBirthday,
        setCreatedAt,
    } = useContext(AuthContext);

    const refLoginForm = useRef(null);

    useEffect(() => {
        setShowRegisterForm(false);
        setOpacity({
            opacity: 0.5,
        });

        document.addEventListener('mousedown', handleClick);
        function handleClick(e) {
            // console.log(e);
            if (
                refLoginForm.current &&
                !refLoginForm.current.contains(e.target)
            ) {
                setShowForm(false);
            }
        }
        return () => {
            setOpacity({
                opacity: 1,
            });
        };
    }, [setShowRegisterForm, setOpacity, setShowForm]); //REV_ERRORS

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

    const responseGoogle = (response) => {
        const token_google = response.tokenObj.id_token;
        //Verifico que la respuesta de google este OK.
        if (response?.profileObj?.email) {
            async function getUser() {
                try {
                    //Verifico si esta el usuario registrado
                    const { data } = await axios.get(
                        `${process.env.REACT_APP_NODE_URL}/users/${response?.profileObj?.email}`
                    );
                    const currentUser = data.data;

                    //Si el usuario esta registrado
                    if (currentUser.length === 1) {
                        //Valido el token
                        try {
                            async function loginGoogle() {
                                const res = await axios.get(
                                    `${process.env.REACT_APP_NODE_URL}/users/validate-token/google`,
                                    {
                                        headers: {
                                            'Content-Type': 'application/json',
                                            authorization: `${token_google}`,
                                        },
                                    }
                                );

                                //Si el token esta ok.
                                if (res?.data?.status === 'ok') {
                                    setValues({
                                        ...values,
                                        ok: 'Te has logado con éxito',
                                        showOk: true,
                                    });

                                    setShowForm(false);
                                    setLogin(true);
                                    // console.log(currentUser[0]);
                                    setNameUser(currentUser[0].name);
                                    setLastname(currentUser[0].lastname);
                                    setPicture(currentUser[0].avatar);
                                    setEmail(currentUser[0].email);
                                    setNationality(currentUser[0].nationality);
                                    setPhone(currentUser[0].phoneNumber);
                                    setBirthday(currentUser[0].birthDate);
                                    setCreatedAt(currentUser[0].createdAt);
                                    // console.log('CURRENT:::',currentUser[0]);
                                    localStorage.setItem(
                                        'userToken',
                                        response.tokenObj.id_token
                                    );
                                    localStorage.setItem(
                                        'userName',
                                        currentUser[0].name
                                    );
                                    localStorage.setItem('typeAuth', 'google');
                                    localStorage.setItem(
                                        'idUser',
                                        currentUser[0].id
                                    );
                                }
                            }
                            loginGoogle();
                        } catch (error) {
                            console.log(error);
                        }
                    } else {
                        //Si el usuario no esta registrado
                        try {
                            const currentUser = {
                                email: response.profileObj.email,
                                password: '12345678',
                                name: response.profileObj.givenName,
                                lastname: response.profileObj.familyName,
                                avatar: response.profileObj.imageUrl,
                            };

                            const { data } = await axios.post(
                                `${process.env.REACT_APP_NODE_URL}/users`,
                                currentUser
                            );

                            if (data.status === 'ok') {
                                const idUser = data.idUser[0].id;

                                try {
                                    async function loginGoogle() {
                                        const res = await axios.get(
                                            `${process.env.REACT_APP_NODE_URL}/users/validate-token/google`,
                                            {
                                                headers: {
                                                    'Content-Type':
                                                        'application/json',
                                                    authorization: `${token_google}`,
                                                },
                                            }
                                        );

                                        //Si el token esta ok.
                                        if (res?.data?.status === 'ok') {
                                            setValues({
                                                ...values,
                                                ok: 'Te has logado con éxito',
                                                showOk: true,
                                            });

                                            setShowForm(false);
                                            setLogin(true);
                                            setNameUser(currentUser.name);
                                            setPicture(currentUser.avatar);

                                            localStorage.setItem(
                                                'userToken',
                                                response.tokenObj.id_token
                                            );
                                            localStorage.setItem(
                                                'userName',
                                                currentUser.name
                                            );
                                            localStorage.setItem(
                                                'typeAuth',
                                                'google'
                                            );
                                            localStorage.setItem(
                                                'idUser',
                                                idUser
                                            );
                                        }
                                    }
                                    loginGoogle();
                                } catch (error) {
                                    console.log(error);
                                }
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            getUser();
        } else {
            setValues({
                ...values,
                error: 'No ha sido posible logarte mediante Google, inténtalo más tarde',
                showError: true,
            });
        }
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };
    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        if (
            event.target.id === 'standard-adornment-password' &&
            event.charCode === 13
        ) {
            onSubmitLogin(event);
        }
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const goToRegister = () => {
        setShowForm(false);
        setShowRegisterForm(true);
    };

    const restorePassword = () => {
        setOpacity({
            opacity: 1,
        });
        setShowForm(false);
        setRestorePasswordForm(true);
    };

    function onSubmitLogin(event) {
        //console.log('ENTRA EN SUBMIT');
        event.preventDefault();

        const body = {
            email: values.email,
            password: values.password,
        };
        if (!body.email || !body.password) {
            setValues({
                ...values,
                error: 'Email o contraseña incorrectos',
                showError: true, //REV_ERRORS
            });
            return;
        }

        async function login() {
            try {
                const { data } = await axios.post(
                    `${process.env.REACT_APP_NODE_URL}/users/login`,
                    body
                );

                if (data.status === 'No existe') {
                    setValues({
                        ...values,
                        error: 'Email o contraseña incorrectos',
                        showError: true, //REV_ERRORS
                    });
                } else {
                    setValues({
                        ...values,
                        ok: 'Te has logado con éxito',
                        showOk: true,
                    });
                    setNameUser(data.data.name);
                    if (data.data.avatar) {
                        setPicture(data.data.avatar);
                        console.log('avatar:::', data.data.avatar);
                    }
                    setTimeout(() => {
                        setShowForm(false);
                        setLogin(true);
                    }, 2500);
                    localStorage.setItem('userToken', data.data.token);
                    localStorage.setItem('userName', data.data.name);
                    localStorage.setItem('idUser', data.data.idUser);
                    localStorage.setItem('typeAuth', 'API');
                }
            } catch (error) {
                console.log(error);
            }
        }
        login();
    }
    document.addEventListener('keydown', handleKeyDown);

    function handleKeyDown(e) {
        if (e.keyCode === 27) {
            setShowForm(false);
        }
    }

    return (
        <div
            className={'login-container animate__animated ' + animation}
            ref={refLoginForm}
        >
            <div>
                <img src={logo3} alt='' width='30%' />
            </div>
            <form id='form-login' onSubmit={onSubmitLogin}>
                <div>
                    <TextField
                        className='inputs-form'
                        id='standard-basic-email'
                        label='Correo electrónico'
                        value={values.email}
                        onChange={handleChange('email')}
                        autoFocus
                    />
                </div>
                <FormControl
                    className={clsx(classes.margin, classes.textField)}
                >
                    <InputLabel
                        htmlFor='standard-adornment-password'
                        id='standard-adornment-password-label'
                    >
                        Contraseña
                    </InputLabel>
                    <Input
                        id='standard-adornment-password'
                        type={values.showPassword ? 'text' : 'password'}
                        value={values.password}
                        onChange={handleChange('password')}
                        endAdornment={
                            <InputAdornment position='end'>
                                <IconButton
                                    aria-label='toggle password visibility'
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {values.showPassword ? (
                                        <Visibility />
                                    ) : (
                                        <VisibilityOff />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        }
                        onKeyPress={handleChange('password')}
                        className='inputs-form'
                    />
                </FormControl>
                <div id='forgot-password'>
                    <Link to='/' onClick={restorePassword} className='small'>
                        Olvidé mi contraseña
                    </Link>
                </div>
                <div>
                    <Button
                        variant='contained'
                        id='button-login'
                        color='primary'
                        className='button-form'
                        onClick={onSubmitLogin}
                    >
                        Iniciar Sesión
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
                <div id='social-btn'>
                    {!login && (
                        <GoogleLogin
                            clientId={urlGoogle}
                            buttonText='Login with Google'
                            id='google-login'
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            cookiePolicy={'single_host_origin'}
                            expires_on='50000'
                        />
                    )}
                </div>
                <div id='no-account-container'>
                    <Link to='/' onClick={goToRegister}>
                        ¿No tienes cuenta? Regístrate
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;
