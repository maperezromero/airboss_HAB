import { useState, useEffect, useContext } from 'react';
import './css/reset-pwd-form.css';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { AuthContext } from '../../App';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';
import validator from 'validator';
import {
    FormControl,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
} from '@material-ui/core';
import clsx from 'clsx';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(10),
            width: '50px',
        },
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}
function ResetPasswordForm({ code }) {
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
    const classes = useStyles();
    const { setShowRegisterForm, animation, setOpacity } =
        useContext(AuthContext);

    useEffect(() => {
        // console.log(code);
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
            event.target.id === 'standard-basic-repeatPassword' &&
            event.charCode === 13
        ) {
            onSubmitChangePwd(event);
        }
    };
    async function onSubmitChangePwd(event) {
        event.preventDefault();
        // console.log(values.email);
        if (
            !validator.isEmpty(values.password) &&
            !validator.isEmpty(values.repeatPassword) &&
            values.password === values.repeatPassword
        ) {
            const body = {
                recoverCode: code,
                newPassword: values.password,
            };
            try {
                const res = await axios.put(
                    'http://localhost:3001/users/password/reset',
                    body
                );

                if (res.data.status === 'ok') {
                    setValues({
                        ...values,
                        ok: 'Nueva contraseña restaurada!',
                        showOk: true,
                    });
                    setTimeout(() => {
                        history.push('/');
                    }, 2000);
                }
            } catch (error) {
                // console.log(error.response);
                setValues({
                    ...values,
                    error: 'Ha habido un error',
                    showError: true,
                });
            }
        } else {
            if (values.password !== values.repeatPassword) {
                setValues({
                    ...values,
                    error: 'Las contraseñas deben coincidir',
                    showError: true,
                });
            }
        }
    }
    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleClickShowRepeatPassword = () => {
        setValues({
            ...values,
            showRepeatPassword: !values.showRepeatPassword,
        });
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    return (
        <div className={'reset-password-form animate__animated ' + animation}>
            <form onSubmit={onSubmitChangePwd}>
                <FormControl
                    className={clsx(classes.margin, classes.textField)}
                >
                    <InputLabel
                        htmlFor='standard-adornment-password'
                        className='label'
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
                <FormControl
                    className={clsx(classes.margin, classes.textField)}
                >
                    <InputLabel
                        htmlFor='standard-adornment-password'
                        className='label'
                    >
                        contraseña
                    </InputLabel>
                    <Input
                        id='standard-adornment-repeatPassword'
                        type={values.showRepeatPassword ? 'text' : 'password'}
                        value={values.repeatPassword}
                        onChange={handleChange('repeatPassword')}
                        endAdornment={
                            <InputAdornment position='end'>
                                <IconButton
                                    aria-label='toggle password visibility'
                                    onClick={handleClickShowRepeatPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {values.showRepeatPassword ? (
                                        <Visibility />
                                    ) : (
                                        <VisibilityOff />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        }
                        onKeyPress={handleChange('repeatPassword')}
                        className='inputs-form'
                    />
                </FormControl>
                <div>
                    <Button
                        variant='contained'
                        id='button-login'
                        color='primary'
                        className='button-form'
                        onClick={onSubmitChangePwd}
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

export default ResetPasswordForm;
