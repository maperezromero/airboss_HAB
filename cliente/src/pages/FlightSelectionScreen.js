import './css/flight-selection-screen.css';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FlightResults from '../components/searches/FlightResults';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { UserContext } from '../routers/AppRouter';
import { formatDate } from '../helpers';
import SearchBox from '../components/searches/SearchBox';
import { AuthContext } from '../App';
import { PoisDestinations } from '../components/utilities/PoisDestinations';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { Stepper } from '../components/ui/Stepper';

const queryString = require('query-string');

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

export const FlightSelectionScreen = ({ history }) => {
    const idUser = localStorage.getItem('idUser');

    const [showResults, setShowResults] = useState(false);
    const [dataResults, setDataResults] = useState('');

    const location = useLocation();
    const { preferredCurrency } = useContext(UserContext);
    const { opacity } = useContext(AuthContext);

    //Extraigo los valores separados de las querys de busqueda.
    const {
        oneWay,
        nonStop,
        originLocationCode,
        destinationLocationCode,
        departureDate,
        returnDate,
        numAdults,
        numChilds,
        crossBorderAllowed,
        travelClass,
    } = queryString.parse(location.search);

    //Hook para el manejo de snackbar
    const [values, setValues] = useState({
        error: '',
        showError: false,
        ok: '',
        showOk: false,
        info: '',
        showInfo: false,
    });

    let querysAPI = `?currencyCode=${
        preferredCurrency.currency
    }&oneWay=${oneWay}&nonStop=${nonStop}&originLocationCode=${originLocationCode}&destinationLocationCode=${destinationLocationCode}&departureDate=${formatDate(
        departureDate
    )}&returnDate=${returnDate}&numAdults=${numAdults}&numChilds=${numChilds}&crossBorderAllowed=${crossBorderAllowed}&travelClass=${travelClass}&maxFlightOffers=20`;

    useEffect(() => {
        setShowResults(false);
        setDataResults('');
        history.push(`/searches${querysAPI}`);
        const getFlights = async () => {
            // console.log('useEffect_IDUSER:::', idUser);
            const { data } = await axios.post(
                `http://localhost:3001/searches${querysAPI}`,
                { idUser: idUser }
            );
            if (data) {
                setDataResults(data);
                // console.log(data);
                //Si no hay resultados muestro aviso en pantalla
                if (data?.data?.data?.length === 0) {
                    setValues({
                        ...values,
                        info: 'No hay resultados con la búsqueda indicada.',
                        showInfo: true,
                    });
                }
            }
        };

        setShowResults(true);

        getFlights();
    }, [querysAPI, history, idUser, values]);

    const useStyles = makeStyles((theme) => ({
        root: {
            position: 'absolute',
            top: '65px',
            width: '100%',
            zIndex: '2000',
            height: '0.5rem',
            '& > * + *': {
                marginTop: theme.spacing(2),
            },
        },
    }));
    const classes = useStyles();

    //Manejo del snackbar para cerrarlo
    const handleCloseOk = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setValues({ ...values, showInfo: false });
    };
    return (
        <div id='searches-container-all' style={opacity}>
            <div>
                <div id='searches-container'>
                    {showResults && !dataResults && (
                        <LinearProgress className={classes.root} />
                    )}
                    {/* {showResults && !dataResults && <h1>Buscando vuelos...</h1>} */}
                    {showResults && dataResults && (
                        <div id='flight-screen-results'>
                            <Stepper step='flightSelection' />
                            <SearchBox history={history} vertical={true} />
                            <FlightResults
                                dataResults={dataResults}
                                oneWay={oneWay}
                                numAdults={numAdults}
                                numChilds={numChilds}
                            />
                            <Snackbar
                                open={values.showInfo}
                                autoHideDuration={4000}
                                onClose={handleCloseOk}
                            >
                                <Alert onClose={handleCloseOk} severity='info'>
                                    {values.info}
                                </Alert>
                            </Snackbar>

                            <PoisDestinations
                                destinationLocationCode={
                                    destinationLocationCode
                                }
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
