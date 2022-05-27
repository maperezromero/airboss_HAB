import './css/booking-history-screen.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getSymbol } from '../helpers';
// import AirlineSeatReclineExtraIcon from '@material-ui/icons/AirlineSeatReclineExtra';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

export const BookingHistoryScreen = () => {
    const idUser = localStorage.getItem('idUser');

    const [showResults, setShowResults] = useState(false);
    const [dataHistoryResults, setDataResults] = useState('');
    // const [showPassengersComp, setShowPassengersComp] = useState(false);
    // const [idBooking, setIdBooking] = useState('');

    const [values, setValues] = useState({
        info: '',
        showInfo: false,
    });

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

    useEffect(() => {
        setShowResults(false);
        setDataResults('');
        const getUserBooking = async () => {
            if (idUser) {
                const { data } = await axios.get(
                    `${process.env.REACT_APP_NODE_URL}/allBooking/${idUser}`
                );
                if (data) {
                    setDataResults(data);
                    // console.log('data:', data);
                    // Si no hay resultados muestro aviso en pantalla
                    if (data?.data?.length === 0) {
                        // console.log('No hay datos!!');
                        setValues({
                            ...values,
                            info: 'No hay resultados con la búsqueda indicada.',
                            showInfo: true,
                        });
                    }
                }
            }
        };
        setShowResults(true);
        getUserBooking();
    }, [idUser, values]);

    const handleCloseOk = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setValues({ ...values, showInfo: false });
    };
    // const showPassengers = (passengers, idBooking) => {
    //     showPassengersComp
    //         ? setShowPassengersComp(false)
    //         : setShowPassengersComp(true);
    //     setIdBooking(idBooking);
    //     // console.log(passengers, idBooking);
    // };

    return (
        <div id='history-container'>
            <div id='history-window'>
                <h3 id='history-header'>Mis vuelos</h3>
                <ul id='history-ul-container'>
                    {dataHistoryResults &&
                    showResults &&
                    dataHistoryResults.status === 'ok' &&
                    dataHistoryResults.data.length > 0 ? (
                        dataHistoryResults?.data?.map((booking) => (
                            <li key={booking.bookingCode} id='history-li'>
                                {/* <p>{`Booking Code: ${booking.bookingCode}`}</p> */}
                                <p>
                                    Fecha compra:{' '}
                                    {getMyDateTime(booking.createdAt)[0]} (
                                    {getMyDateTime(booking.createdAt)[1]})
                                </p>
                                <p>
                                    {booking.oneWay === 1
                                        ? 'Sólo Ida'
                                        : `Ida/Vuelta`}
                                </p>
                                <br />
                                <div id='ida-vuelta-container'>
                                    <div id='datos-ida'>
                                        <p>
                                            <b>Datos IDA:</b>
                                        </p>
                                        <p>
                                            Origen:{' '}
                                            {
                                                booking.itineraries[0]
                                                    .segments[0].origin
                                            }{' '}
                                            {
                                                getMyDateTime(
                                                    booking.itineraries[0]
                                                        .segments[0]
                                                        .departure_datetime
                                                )[0]
                                            }
                                            (
                                            {
                                                getMyDateTime(
                                                    booking.itineraries[0]
                                                        .segments[0]
                                                        .departure_datetime
                                                )[1]
                                            }
                                            )
                                        </p>
                                        <p>
                                            Destino:{' '}
                                            {
                                                booking.itineraries[0].segments[
                                                    booking.itineraries[0]
                                                        .segments.length - 1
                                                ].destination
                                            }{' '}
                                            {
                                                getMyDateTime(
                                                    booking.itineraries[0]
                                                        .segments[
                                                        booking.itineraries[0]
                                                            .segments.length - 1
                                                    ].arrival_datetime
                                                )[0]
                                            }
                                            (
                                            {
                                                getMyDateTime(
                                                    booking.itineraries[0]
                                                        .segments[
                                                        booking.itineraries[0]
                                                            .segments.length - 1
                                                    ].arrival_datetime
                                                )[1]
                                            }
                                            )
                                        </p>
                                        <div>
                                            Escalas:{' '}
                                            {booking.itineraries[0].segments
                                                .length >= 2
                                                ? 'Si'
                                                : 'No'}
                                            {booking.itineraries[0].segments
                                                .length >= 2 ? (
                                                <div>
                                                    <ul>
                                                        {booking.itineraries[0].segments.map(
                                                            (segment) => (
                                                                <li
                                                                    id='escales-li'
                                                                    key={
                                                                        segment.segmentId
                                                                    }
                                                                >
                                                                    <p>
                                                                        {
                                                                            segment.origin
                                                                        }{' '}
                                                                        →{' '}
                                                                        {
                                                                            segment.destination
                                                                        }
                                                                    </p>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                    </div>
                                    <br />
                                    <div id='datos-vuelta'>
                                        <div>
                                            {booking.oneWay === 0 && (
                                                <div>
                                                    <p>
                                                        <b>Datos VUELTA:</b>
                                                    </p>
                                                    <p>
                                                        Origen:{' '}
                                                        {
                                                            booking
                                                                .itineraries[1]
                                                                .segments[0]
                                                                .origin
                                                        }{' '}
                                                        {
                                                            getMyDateTime(
                                                                booking
                                                                    .itineraries[1]
                                                                    .segments[0]
                                                                    .departure_datetime
                                                            )[0]
                                                        }
                                                        (
                                                        {
                                                            getMyDateTime(
                                                                booking
                                                                    .itineraries[1]
                                                                    .segments[0]
                                                                    .departure_datetime
                                                            )[1]
                                                        }
                                                        pasajeros
                                                    </p>
                                                    <p>
                                                        Destino:{' '}
                                                        {
                                                            booking
                                                                .itineraries[1]
                                                                .segments[
                                                                booking
                                                                    .itineraries[1]
                                                                    .segments
                                                                    .length - 1
                                                            ].destination
                                                        }{' '}
                                                        {
                                                            getMyDateTime(
                                                                booking
                                                                    .itineraries[1]
                                                                    .segments[
                                                                    booking
                                                                        .itineraries[1]
                                                                        .segments
                                                                        .length -
                                                                        1
                                                                ]
                                                                    .arrival_datetime
                                                            )[0]
                                                        }
                                                        (
                                                        {
                                                            getMyDateTime(
                                                                booking
                                                                    .itineraries[1]
                                                                    .segments[
                                                                    booking
                                                                        .itineraries[1]
                                                                        .segments
                                                                        .length -
                                                                        1
                                                                ]
                                                                    .arrival_datetime
                                                            )[1]
                                                        }
                                                        )
                                                    </p>
                                                    <div>
                                                        Escalas:{' '}
                                                        {booking.itineraries[1]
                                                            .segments.length >=
                                                        2
                                                            ? 'Si'
                                                            : 'No'}
                                                        {booking.itineraries[1]
                                                            .segments.length >=
                                                        2 ? (
                                                            <div>
                                                                <ul>
                                                                    {booking.itineraries[1].segments.map(
                                                                        (
                                                                            segment
                                                                        ) => (
                                                                            <li
                                                                                id='escales-li'
                                                                                key={
                                                                                    segment.segmentId
                                                                                }
                                                                            >
                                                                                <p>
                                                                                    {
                                                                                        segment.origin
                                                                                    }{' '}
                                                                                    →{' '}
                                                                                    {
                                                                                        segment.destination
                                                                                    }
                                                                                </p>
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <br />

                                <p>
                                    {booking.oneWay === 1
                                        ? 'Precio Final: '
                                        : 'Precio Ida/Vuelta: '}
                                    {Number(booking.finalPrice).toFixed(2)}
                                    {getSymbol(booking.currency)}
                                </p>
                                {/* <span
                                    className='span-passengers'
                                    onClick={() =>
                                        showPassengers(
                                            booking.passengers[0],
                                            booking.bookingCode
                                        )
                                    }
                                >
                                    <AirlineSeatReclineExtraIcon /> Ver
                                    pasajeros del vuelo
                                </span>
                                {showPassengersComp &&
                                    booking.bookingCode === idBooking && (
                                        <ul id='ul-passengers'>
                                            {booking.passengers.map(
                                                (passenger) => (
                                                    <li key={passenger.id}>
                                                        {' '}
                                                        {passenger.name}{' '}
                                                        {passenger.lastname}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )} */}
                            </li>
                        ))
                    ) : (
                        <li id='sin-resultados'>
                            No hay vuelos que mostrar para este usuario
                        </li>
                    )}
                </ul>
            </div>
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
