// import { useLocation } from 'react-router';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import './css/selected-flight-details.css';
// import SearchBox from '../components/searches/SearchBox';
// import { PoisDestinations } from '../components/utilities/PoisDestinations';

import SelectedFlightInfo from '../components/searches/SelectedFlightInfo';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { UserContext } from '../routers/AppRouter';
import { Stepper } from '../components/ui/Stepper';
import { PoisDestinations } from '../components/utilities/PoisDestinations';

export const SelectedFlightDetailsScreen = ({ history }) => {
    const { selectedFlight } = useContext(UserContext);

    const [values, setValues] = useState({
        info: '',
        showInfo: false,
    });
    const {
        myCarrier,
        myAircraft,
        myDuration,
        myReturnDuration,
        myReturnCarrier,
        myReturnAircraft,
    } = selectedFlight;
    // const destinationLocationCode =
    //     selectedFlight.itineraries[0].segments[0].arrival.iataCode;

    const [dataResults, setDataResults] = useState('');
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        setShowResults(false);
        setDataResults('');
        setValues({
            ...values,
            showInfo: true,
            info: 'Recuerda que debes confirmar pasajeros y realizar pago para confirmar tu reserva',
        });
        const getPricing = async () => {
            const flightPrincingObject = {
                data: {
                    type: 'flight-offers-pricing',
                    flightOffers: [{ ...selectedFlight }],
                },
            };
            const { data } = await axios.post(
                `${process.env.REACT_APP_NODE_URL}/pricing`,
                flightPrincingObject
            );
            if (data) {
                setDataResults({
                    myCarrier,
                    myAircraft,
                    myDuration,
                    myReturnDuration,
                    myReturnCarrier,
                    myReturnAircraft,
                    ...data,
                });
            }
        };
        getPricing();
        setShowResults(true);
    }, [
        selectedFlight,
        myCarrier,
        myAircraft,
        myDuration,
        myReturnDuration,
        myReturnCarrier,
        myReturnAircraft,
    ]);

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
    const handleCloseOk = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setValues({ ...values, showInfo: false });
    };
    return (
        <div>
            {showResults && !dataResults && (
                <LinearProgress className={classes.root} />
            )}
            {showResults && dataResults && (
                <div id='selected-flight-info-container-all'>
                    <Stepper step='selectedFlight' history={history} />
                    <div className='selected-flight-info'>
                        <SelectedFlightInfo dataResults={dataResults} />
                        <PoisDestinations
                            destinationLocationCode={
                                dataResults.data.data.flightOffers[0]
                                    .itineraries[0].segments[
                                    [
                                        dataResults.data.data.flightOffers[0]
                                            .itineraries[0].segments.length - 1,
                                    ]
                                ].arrival.iataCode
                            }
                        />
                    </div>
                </div>
            )}
            <Snackbar
                open={values.showInfo}
                autoHideDuration={5000}
                onClose={handleCloseOk}
            >
                <Alert onClose={handleCloseOk} severity='info'>
                    {values.info}
                </Alert>
            </Snackbar>
        </div>
    );
};
