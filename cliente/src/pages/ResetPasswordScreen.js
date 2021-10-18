import { TitleHome } from '../components/ui/Title';
import './css/home-screen.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../App';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ResetPasswordForm from '../components/login/ResetPasswordForm';

export const ResetPasswordScreen = ({ history, match }) => {
    const { opacity } = useContext(AuthContext);
    const [values, setValues] = useState({
        showOk: false,
        ok: '',
        showError: false,
        error: '',
    });
    useEffect(() => {
        // console.log('DENTRO DE RESET PASSWORD');
        // code = match.params.recoverCode;
        //console.log(code);

        return () => {};
    }, []);

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
        <>
            <ResetPasswordForm code={match.params.recoverCode} />
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
        </>
    );
};
