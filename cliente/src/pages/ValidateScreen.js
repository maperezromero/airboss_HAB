import { TitleHome } from '../components/ui/Title';
import './css/home-screen.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../App';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

export const ValidateScreen = ({ history, match }) => {
    const { setLogin, setNameUser, opacity } = useContext(AuthContext);
    const [values, setValues] = useState({
        showOk: false,
        ok: '',
        showError: false,
        error: '',
    });
    useEffect(() => {
        async function sendValidation() {
            const code = match.params.registrationCode;
            const response = await fetch(
                `${process.env.REACT_APP_NODE_URL}/users/validate/${code}`
            );
            const data = await response.json();
            // console.log(data);
            if (data.status === 'ok') {
                setLogin(true);
                setNameUser(`${data.name} ${data.lastname}`);
                setValues({
                    ...values,
                    ok: 'Usuario activado correctamente',
                    showOk: true,
                });
                setTimeout(() => {
                    history.push(`/`);
                }, 3000);
            } else {
                setValues({
                    ...values,
                    error: 'No se ha podido activar la cuenta',
                    showError: true,
                });
            }
        }
        sendValidation();
        return () => {};
    }, [history, match.params.registrationCode, setLogin, setNameUser, values]);

    function Alert(props) {
        return <MuiAlert elevation={6} variant='filled' {...props} />;
    }
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
        <div id='home-container' style={opacity}>
            <TitleHome />
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
        </div>
    );
};
