import { Redirect, useLocation } from 'react-router';
import { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';
//import { makeStyles } from '@material-ui/core/styles';
import './css/ConfirmPassengersScreen.css';
import { Snackbar, TextField } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import EditIcon from '@material-ui/icons/Edit';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { green, red } from '@material-ui/core/colors';
import Tooltip from '@material-ui/core/Tooltip';
import { Fab } from '@material-ui/core';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { AuthContext } from '../App';
import { routes } from '../routers/routes';
import { Autocomplete } from '@material-ui/lab';
import { Fragment } from 'react';
import { Stepper } from '../components/ui/Stepper';
require('dotenv').config();

//Usamos este hook para controlar el cierre del formulario si se clica fuera de él
export const TravelersContext = createContext(null);
export const ConfirmPassengersScreen = ({ history }) => {
    

    const {
        setAnimation,
        opacity,
        setOpacity,
        setShowEditTravelerForm,
        showEditTravelerForm,
        travelersInfo,
        setTravelersInfo,
        setCurrentTraveler,
        saveTravelers,
    } = useContext(AuthContext);
    const [values, setValues] = useState({
        info: '',
        showInfo: false,
        ok: '',
        showOk: false,
    });
    const [bookingDone, setBookingDone] = useState(false);

    const data = useLocation();
    let price =
        data?.state[0]?.data?.data?.flightOffers[0]?.travelerPricings[0]?.price
            ?.total;
    //let saveTravelers = data?.state[5];
    // console.log('saveTravelers::::::::',saveTravelers);
    // const [previousTravelers, setPreviousTravelers] = useState(saveTravelers);

    useEffect(() => {
        setValues({
            ...values,
            showInfo: true,
            info: 'Recuerda que debes confirmar pasajeros y realizar pago para confirmar tu reserva',
        });
        // console.log(previousTravelers);
    }, [data, travelersInfo, saveTravelers]);

    /* const useStyles = makeStyles((theme) => ({
        root: {
            position: 'absolute',
            top: '10%',
            width: '100%',
            zIndex: '2000',
            '& > * + *': {
                marginTop: theme.spacing(2),
            },
        },
    }));
    const classes = useStyles(); */

    function getMyDateTime(resultsDate) {
        const dateTime = new Date(resultsDate);
        const date = dateTime.toLocaleDateString('es-ES');
        const time = dateTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });

        const myDate = [date, time];
        return myDate;
    }

    function getMyDateTimeAmadeus(resultsDate) {
        const dateTime = new Date(resultsDate);
        const date = dateTime.toLocaleDateString('en-CA');
        return date;
    }
    const handleCloseOk = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setValues({ ...values, showOk: false });
    };
    const handleCloseInfo = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setValues({ ...values, showInfo: false });
    };
    function editTraveler(id) {
        setAnimation('animate__backInDown');
        //{showEditTravelerForm && <PassengersForm  travelersInfo={travelersInfo} currentTraveler={currentTraveler}/>}
        // console.log('92::::::', id);
        setCurrentTraveler(id);
        setShowEditTravelerForm(true);
        setOpacity({
            opacity: 0.5,
        });
    }

    async function paymentSuccess(details) {
        // console.log('TRAVELERS PAYMENT:',travelersInfo);
        // setValues({...values, showOk: true, ok: 'Pago realizado correctamente', disabledPDF: false});
        // console.log('DATA::',data.state[0].data.data.flightOffers[0]);
        try {
            const body = {
                idUser: localStorage.getItem('idUser'),
                flightObject: data.state[0].data.data.flightOffers[0],
                travelers: travelersInfo,
            };

            const res = await axios.post(`${process.env.REACT_APP_NODE_URL}/booking`, body);
            // console.log(res);
            // console.log(res.data.data.data.id);

            if (res?.data?.data?.data?.id) {
                setBookingDone(true);
                setValues({
                    ...values,
                    showInfo: false,
                    showOk: true,
                    ok: `Reserva ${res?.data?.data?.data?.id} Confirmada`,
                });
                setTimeout(() => {
                    <Redirect to={routes.home} />;

                    history.push('/');
                }, 3000);
            } else if (res?.data?.data?.message?.code === 'ClientError') {
                setValues({
                    ...values,

                    showInfo: true,
                    info: 'No se ha podido completar la reserva',
                });
            }
        } catch (error) {
            setValues({
                ...values,
                showInfo: true,
                info: 'No se ha podido completar la reserva',
            });
            // console.log(error);
        }
    }
    const handleChangePassenger = (event, key) => {
        const passenger =
            saveTravelers[event.currentTarget.dataset.optionIndex];
        // console.log(passenger);
        // console.log('travelerInfo:::', travelersInfo);
        setTravelersInfo((prevState) =>
            prevState.map((el) => {
                // console.log(el.key, key);
                if (el.key === key) {
                    // console.log('DENTRO DEL IFFFFFF');
                    return {
                        key: key,
                        id: `${key}`,
                        name: {
                            firstName: passenger.name,
                            lastName: passenger.lastname,
                        },
                        contact: {
                            emailAddress: passenger.emailAddress,
                            phones: [
                                {
                                    deviceType: 'MOBILE',
                                    contruyCallingCode: '34',
                                    number: '666666666',
                                },
                            ],
                        },
                        gender: passenger.gender,
                        dateOfBirth: getMyDateTimeAmadeus(passenger.birthDate),
                        documents: [
                            {
                                documentType: passenger.documentType,
                                number: passenger.documentNumber,
                                issuanceDate: getMyDateTimeAmadeus(
                                    passenger.issuanceDate
                                ),
                                nationality: 'ES',
                                birthPlace: passenger.birthPlace,
                                expiryDate: '2050-12-31',
                                issuanceCountry: 'ES',
                                validityCountry: 'ES',
                                holder: true,
                            },
                        ],
                        validate: true,
                    };
                }
                //console.log(el.id);
                return el;
            })
        );
        // console.log('154:::::::',travelersInfo);
    };
    return (
        <div id='selected-flight-info-container-all' style={opacity}>
            <Stepper step='confirmPassengers' history={history} />
            <div className='passengers-form'>
                <div className='summary-flight'>
                    Vuelo origen: {data?.state[1]?.address?.cityName} con
                    destino: {data?.state[2]?.address?.cityName} y fecha:{' '}
                    {
                        getMyDateTime(
                            data?.state[0]?.data?.data?.flightOffers[0]
                                ?.itineraries[0]?.segments[0]?.departure?.at
                        )[0]
                    }
                </div>
                <div id='passengers'>Listado de pasajeros</div>
                <div id='passengers-titles'>
                    <span>Identificación</span>
                    <span>Nombre</span>
                </div>
                {travelersInfo?.map((e) => {
                    return (
                        <div className='list-travelers' key={e.key}>
                            <span>{e?.documents[0]?.number || ''}</span>{' '}
                            <span>
                                {(e.name.firstName || e.name.lastName) ||
                                    'DEBES COMPLETAR DATOS DEL PASAJERO'}
                            </span>
                            <span>
                                <Autocomplete
                                    id='passenger-select'
                                    key={e.key}
                                    style={{ width: 300, zIndex: 10000 }}
                                    options={saveTravelers}
                                    disablePortal
                                    className='inputs-form-travelers'
                                    onChange={(event) =>
                                        handleChangePassenger(event, e.key)
                                    }
                                    autoHighlight
                                    getOptionLabel={(option) => option.name}
                                    renderOption={(option) => (
                                        <Fragment>
                                            {option.documentNumber} (
                                            {option.name } 
                                            {option.lastname})
                                        </Fragment>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            className='textField-countries'
                                            {...params}
                                            onChange={(event) =>
                                                handleChangePassenger(
                                                    event,
                                                    e.key
                                                )
                                            }
                                            label='Elige de tus pasajeros frecuentes'
                                            variant='standard'
                                        />
                                    )}
                                />
                            </span>
                            <Tooltip title='Editar los datos del pasajero'>
                                <span>
                                    <Fab
                                        color='primary'
                                        aria-label='Añadir datos pasajero'
                                        size='small'
                                        onClick={() => editTraveler(e.key)}
                                    >
                                        <EditIcon />
                                    </Fab>
                                </span>
                            </Tooltip>
                            {e.validate && (
                                <Tooltip title='Pasajero guardado correctamente'>
                                    <span>
                                        <Fab
                                            style={{ color: green[500] }}
                                            aria-label='Borrar datos pasajero'
                                            size='small'
                                            disabled
                                        >
                                            <CheckCircleIcon
                                                style={{ color: green[500] }}
                                            />
                                        </Fab>
                                    </span>
                                </Tooltip>
                            )}
                            {!e.validate && (
                                <Tooltip title='Debes completar los datos del pasajero'>
                                    <span>
                                        <Fab
                                            style={{ color: red[500] }}
                                            aria-label='Borrar datos pasajero'
                                            size='small'
                                            disabled
                                        >
                                            <ErrorIcon
                                                style={{ color: red[500] }}
                                            />
                                        </Fab>
                                    </span>
                                </Tooltip>
                            )}
                        </div>
                    );
                })}
                {travelersInfo?.every((e) => e.validate) && !bookingDone && (
                    <PayPalScriptProvider
                        className='paypal-container'
                        options={{
                            'client-id': `${process.env.REACT_APP_PAYPAL_CLIENTID}`,
                            currency: `${data?.state[0]?.data?.data?.flightOffers[0]?.travelerPricings[0]?.price?.currency}`,
                            'disable-funding': 'sofort',
                        }}
                    >
                        <PayPalButtons
                            className='paypal-container'
                            style={{ height: 44 }}
                            createOrder={(data, actions) => {
                                return actions.order.create({
                                    purchase_units: [
                                        {
                                            amount: {
                                                value: `${price}`,
                                            },
                                        },
                                    ],
                                });
                            }}
                            onApprove={(data, actions) => {
                                // This function captures the funds from the transaction.
                                return actions.order
                                    .capture()
                                    .then(function (details) {
                                        // This function shows a transaction success message to your buyer.
                                        paymentSuccess(details);
                                        //alert('Transaction completed by ' + details.payer.name.given_name);
                                    });
                            }}
                            onCancel={function (data) {
                                setValues({
                                    ...values,
                                    showInfo: true,
                                    info: 'Has cancelado el pago, si no realizas el mismo no tendrás confirmación de tu reserva.',
                                });
                            }}
                            onError={function (err) {
                                console.log(err);
                            }}
                        />
                    </PayPalScriptProvider>
                )}
                {/* <div id='container-button'>
                            <button id='payment-button' onClick={goToPayment}>Ir a Pago</button>
                    </div> */}
            </div>
            <Snackbar
                open={values.showOk}
                autoHideDuration={5000}
                onClose={handleCloseOk}
            >
                <Alert onClose={handleCloseOk} severity='success'>
                    {values.ok}
                </Alert>
            </Snackbar>
            <Snackbar
                open={values.showInfo}
                autoHideDuration={3000}
                onClose={handleCloseInfo}
            >
                <Alert onClose={handleCloseInfo} severity='info'>
                    {values.info}
                </Alert>
            </Snackbar>
        </div>
    );
};
