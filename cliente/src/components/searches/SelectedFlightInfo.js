import './css/selected-flight-info.css';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { getSymbol } from '../../helpers';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CgAirplane } from 'react-icons/cg';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { AuthContext } from '../../App';
import { useHistory } from 'react-router-dom';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

require('dotenv').config();

function SelectedFlightInfo({ dataResults }) {
    const [myArrivalCity, setMyArrivalCity] = useState('');
    const [myDepartureCity, setDepartureCity] = useState('');
    const [myReturnArrivalCity, setMyReturnArrivalCity] = useState('');
    const [myReturnDepartureCity, setReturnDepartureCity] = useState('');
    const [covidRestrictions, setCovidRestrictions] = useState('');
    const [showArrivalCity, setShowArrivalCity] = useState(false);
    const [showDepartureCity, setShowDepartureCity] = useState(false);
    const [showReturnArrivalCity, setShowReturnArrivalCity] = useState(false);
    const [showReturnDepartureCity, setShowReturnDepartureCity] =
        useState(false);
    const [showCovidRestrictions, setShowCovidRestrictions] = useState(false);
    const [values, setValues] = useState({
        email: '',
        name: '',
        lastname: '',
        error: '',
        showError: false,
        ok: '',
        showOk: false,
        disabledPDF: false,
    });
    // const { login, setShowForm} = useContext(AuthContext);
    const { setTravelersInfo, setSaveTravelers } = useContext(AuthContext);
    const history = useHistory();

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

    function generatePDF() {
        const contenedorToPDF = document.getElementById('generate-pdf-content');
        // console.log(contenedorToPDF);
        html2canvas(contenedorToPDF, {
            ignoreElements: function (element) {
                if (element.classList.contains('not-to-pdf')) {
                    return true;
                }
            },
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const doc = new jsPDF('p', 'mm', 'a4');
            const pdfContainerWidth = contenedorToPDF.clientWidth,
                pdfContainerHeight = contenedorToPDF.clientHeight;

            const containerProp = pdfContainerWidth / pdfContainerHeight;
            const pdfWidth = 170,
                pdfHeight = pdfWidth / containerProp;

            doc.addImage(imgData, 'JPEG', 20, 15, pdfWidth, pdfHeight);
            doc.save('sample-file.pdf');
        });
    }

    const covidRestrictionsSearch = async (countryData) => {
        const { data } = await axios.post(
            'http://localhost:3001/covidRestrictions',
            { ...countryData }
        );
        // console.log('Covid Restrictions: ', data);
        if (data) {
            setCovidRestrictions(data);
        }
    };
    const departureCity =
        dataResults.data.data.flightOffers[0].itineraries[0].segments[0]
            .departure.iataCode;
    const returnDepartureCity =
        dataResults.data.data.flightOffers[0].itineraries[1]?.segments[0]
            .departure.iataCode;
    const arrivalCity =
        dataResults.data.data.flightOffers[0].itineraries[0].segments[
            [
                dataResults.data.data.flightOffers[0].itineraries[0].segments
                    .length - 1,
            ]
        ].arrival.iataCode;
    const returnArrivalCity =
        dataResults.data.data.flightOffers[0].itineraries[1]?.segments[
            [
                dataResults.data.data.flightOffers[0].itineraries[1].segments
                    .length - 1,
            ]
        ].arrival.iataCode;
    const arrivalCountryData =
        dataResults.data.dictionaries.locations[
            dataResults.data.data.flightOffers[0].itineraries[0].segments[
                [
                    dataResults.data.data.flightOffers[0].itineraries[0]
                        .segments.length - 1,
                ]
            ].arrival.iataCode
        ];

    useEffect(() => {
        const cityCall = async (iataCityCode, setCity, setShowCity) => {
            setShowCity(false);
            if (iataCityCode) {
                const { data } = await axios.get(
                    'http://localhost:3001/citySearch',
                    {
                        params: {
                            keyword: iataCityCode,
                            view: 'LIGHT',
                        },
                    }
                );
                if (data) {
                    const myCity = data.data.data[0];
                    setCity(myCity);
                    setShowCity(true);
                }
            }
        };
        const arrivalCityCall = async (iataCityCode) => {
            setShowArrivalCity(false);
            if (iataCityCode) {
                const { data } = await axios.get(
                    'http://localhost:3001/citySearch',
                    {
                        params: {
                            keyword: iataCityCode,
                            view: 'LIGHT',
                        },
                    }
                );
                if (data) {
                    const myCity = data.data.data[0];
                    setMyArrivalCity(myCity);
                    setShowArrivalCity(true);
                }
            }
        };

        const departureCityCall = async (iataCityCode) => {
            setShowDepartureCity(false);
            if (iataCityCode) {
                const { data } = await axios.get(
                    'http://localhost:3001/citySearch',
                    {
                        params: {
                            keyword: iataCityCode,
                            view: 'LIGHT',
                        },
                    }
                );

                if (data) {
                    const myCity = data.data.data[0];
                    setDepartureCity(myCity);
                    setShowDepartureCity(true);
                }
            }
        };

        if (dataResults) {
            // console.log('dataResults:', dataResults);

            departureCityCall(departureCity);

            arrivalCityCall(arrivalCity);
            cityCall(
                returnDepartureCity,
                setReturnDepartureCity,
                setShowReturnDepartureCity
            );
            cityCall(
                returnArrivalCity,
                setMyReturnArrivalCity,
                setShowReturnArrivalCity
            );
            covidRestrictionsSearch(arrivalCountryData);
        }
    }, [
        dataResults,
        departureCity,
        arrivalCity,
        arrivalCountryData,
        returnDepartureCity,
        returnArrivalCity,
    ]);

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
    const handleClickPassengers = () => {
        //console.log('Nos vamos a confirmar pasajeros');
        // console.log(dataResults);
        const travelers =
            dataResults?.data?.data?.flightOffers[0].travelerPricings.map(
                (e) => ({
                    key: e.travelerId,
                    id: '',
                    typePassenger: e.travelerType,
                    typeSeat: e.fareOption,
                    validate: false,
                    documents: [],
                    name: {
                        firstName: '',
                        lastName: '',
                    },
                    gender: '',
                    dateofBirth: '',
                    contact: {
                        emailAddress: '',
                        phones: [
                            {
                                deviceType: 'MOBILE',
                                contruyCallingCode: '34',
                                number: '666666666',
                            },
                        ],
                    },
                })
            );
        setTravelersInfo(travelers);
        //Extraemos información, si la hay, de los pasajeros asociados al usuario
        const idUser = localStorage.getItem('idUser');
        const token = localStorage.getItem('userToken');
        const typeAuth = localStorage.getItem('typeAuth');

        //let saveTravelers;

        const getPassengers = async () => {
            const myHeaders = {
                'Content-Type': 'application/json',
                Authorization: token,
                idUser: idUser,
                typeAuth: typeAuth,
            };

            try {
                // console.log('myHeaders: ', myHeaders);
                const res = await axios.get(
                    `http://localhost:3001/passengers/`,
                    {
                        headers: myHeaders,
                    }
                );
                // saveTravelers = res.data.data;
                // console.log('251:::::::::::', res.data.data);

                let passengers = [];
                res.data.data?.map((traveler) => {
                    let exist = false;
                    for (const passenger of passengers) {
                        if (
                            passenger.nationality === traveler.nationality &&
                            passenger.documentNumber ===
                                traveler.documentNumber &&
                            passenger.documentType === traveler.documentType
                        ) {
                            exist = true;
                        }
                    }
                    if (!exist) {
                        passengers.push(traveler);
                    }
                    return passengers;
                });
                // console.log('passengers: ', passengers);

                setSaveTravelers(passengers);
                history.push('/passengers', [
                    dataResults,
                    myDepartureCity,
                    myArrivalCity,
                    myReturnDepartureCity,
                    myReturnArrivalCity,
                ]);
            } catch (error) {
                console.log(error);
            }
        };
        getPassengers();
        // history.push('/passengers', [dataResults, myDepartureCity, myArrivalCity, myReturnDepartureCity, myReturnArrivalCity, saveTravelers]);
    };

    return (
        <div id='flight-info-container'>
            {!dataResults && <div>Cargando información del vuelo...</div>}
            <div id='generate-pdf-content'>
                {dataResults && showArrivalCity && (
                    <div className='flight-info-header-container'>
                        <h3 className='flight-info-header'>
                            Detalles de tu viaje a{' '}
                            {myArrivalCity.address.cityName}
                        </h3>
                    </div>
                )}
                {dataResults && showDepartureCity && showArrivalCity && (
                    <div>
                        <div className='departure-info-container'>
                            <br />
                            <div className='itinerarie-info-header'>
                                <b>Trayecto: IDA</b>
                            </div>
                            <div>Compañia Aérea: {dataResults.myCarrier}</div>
                            <div>Aeronave: {dataResults.myAircraft}</div>
                            <div>
                                Emisiones CO2:{' '}
                                {dataResults.data.data.flightOffers[0].itineraries[0].segments.reduce(
                                    (acc, segment) => {
                                        if (!segment.co2Emissions) {
                                            return (acc += 0);
                                        } else {
                                            return (acc += Number(
                                                segment.co2Emissions[0].weight
                                            ));
                                        }
                                    },
                                    0
                                )}
                                {
                                    dataResults.data.data.flightOffers[0]
                                        .itineraries[0].segments[0]
                                        .co2Emissions[0].weightUnit
                                }
                                <div>Duración: {dataResults.myDuration}</div>
                            </div>
                        </div>
                        <br />
                        <div className='flight-info-segments-container'>
                            <div className='flight-info-segment'>
                                <h5>SALIDA: </h5>
                                {dataResults &&
                                    showDepartureCity &&
                                    myDepartureCity && (
                                        <div>
                                            <div className='flight-info-time'>
                                                <>
                                                    {
                                                        getMyDateTime(
                                                            dataResults.data
                                                                .data
                                                                .flightOffers[0]
                                                                .itineraries[0]
                                                                .segments[0]
                                                                .departure.at
                                                        )[0]
                                                    }
                                                </>
                                                <div>
                                                    {
                                                        getMyDateTime(
                                                            dataResults.data
                                                                .data
                                                                .flightOffers[0]
                                                                .itineraries[0]
                                                                .segments[0]
                                                                .departure.at
                                                        )[1]
                                                    }
                                                </div>
                                            </div>
                                            <div>
                                                {
                                                    myDepartureCity.address
                                                        .cityName
                                                }{' '}
                                                (
                                                {
                                                    myDepartureCity.address
                                                        .countryName
                                                }
                                                )
                                            </div>
                                            <div>{myDepartureCity.name}</div>
                                            <div>
                                                Terminal:{' '}
                                                {
                                                    dataResults.data.data
                                                        .flightOffers[0]
                                                        .itineraries[0]
                                                        .segments[0].departure
                                                        .terminal
                                                }
                                            </div>
                                        </div>
                                    )}
                            </div>
                            <div className='flight-info-separator'></div>

                            <div className='flight-info-segment'>
                                <h5>DESTINO: </h5>
                                {dataResults &&
                                    showArrivalCity &&
                                    myArrivalCity && (
                                        <div>
                                            <div className='flight-info-time'>
                                                <>
                                                    {
                                                        getMyDateTime(
                                                            dataResults.data
                                                                .data
                                                                .flightOffers[0]
                                                                .itineraries[0]
                                                                .segments[
                                                                dataResults.data
                                                                    .data
                                                                    .flightOffers[0]
                                                                    .itineraries[0]
                                                                    .segments
                                                                    .length - 1
                                                            ].arrival.at
                                                        )[0]
                                                    }
                                                </>
                                                <div>
                                                    {
                                                        getMyDateTime(
                                                            dataResults.data
                                                                .data
                                                                .flightOffers[0]
                                                                .itineraries[0]
                                                                .segments[
                                                                dataResults.data
                                                                    .data
                                                                    .flightOffers[0]
                                                                    .itineraries[0]
                                                                    .segments
                                                                    .length - 1
                                                            ].arrival.at
                                                        )[1]
                                                    }
                                                </div>
                                            </div>
                                            <div>
                                                {myArrivalCity.address.cityName}{' '}
                                                (
                                                {
                                                    myArrivalCity.address
                                                        .countryName
                                                }
                                                )
                                            </div>
                                            <div>{myArrivalCity.name}</div>
                                            <div>
                                                Terminal:{' '}
                                                {
                                                    dataResults.data.data
                                                        .flightOffers[0]
                                                        .itineraries[0]
                                                        .segments[0].arrival
                                                        .terminal
                                                }
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                        <div>
                            <p>
                                Paradas:{' '}
                                {dataResults.data.data.flightOffers[0]
                                    .itineraries[0].segments.length === 1
                                    ? 'No'
                                    : `${
                                          dataResults.data.data.flightOffers[0]
                                              .itineraries[0].segments.length -
                                          1
                                      }`}
                            </p>
                            {dataResults.data.data.flightOffers[0]
                                .itineraries[0].segments.length > 1 && (
                                <div>
                                    <ul className='stops-info-container'>
                                        {dataResults?.data?.data?.flightOffers[0].itineraries[0].segments?.map(
                                            (segment) => (
                                                <li key={segment.id}>
                                                    {
                                                        <p>
                                                            {
                                                                segment
                                                                    .departure
                                                                    .iataCode
                                                            }{' '}
                                                            (
                                                            {
                                                                getMyDateTime(
                                                                    segment
                                                                        .departure
                                                                        .at
                                                                )[1]
                                                            }
                                                            ){' '}
                                                            <CgAirplane id='logo-ida' />{' '}
                                                            {
                                                                segment.arrival
                                                                    .iataCode
                                                            }{' '}
                                                            (
                                                            {
                                                                getMyDateTime(
                                                                    segment
                                                                        .arrival
                                                                        .at
                                                                )[1]
                                                            }
                                                            )
                                                        </p>
                                                    }
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {dataResults &&
                    showReturnDepartureCity &&
                    showReturnArrivalCity &&
                    dataResults?.data?.data?.flightOffers[0].itineraries
                        .length > 1 && (
                        <div>
                            <div className='return-info-container'>
                                <br />
                                <div className='itinerarie-info-header'>
                                    <b>Trayecto: VUELTA</b>
                                </div>
                                <div>
                                    Compañia Aérea:{' '}
                                    {dataResults.myReturnCarrier}
                                </div>
                                <div>
                                    Aeronave: {dataResults.myReturnAircraft}
                                </div>
                                <div>
                                    Emisiones CO2:{' '}
                                    {dataResults.data.data.flightOffers[0].itineraries[1].segments.reduce(
                                        (acc, segment) => {
                                            if (!segment.co2Emissions) {
                                                return (acc += 0);
                                            } else {
                                                return (acc += Number(
                                                    segment.co2Emissions[0]
                                                        .weight
                                                ));
                                            }
                                        },
                                        0
                                    )}
                                    {
                                        dataResults.data.data.flightOffers[0]
                                            .itineraries[1].segments[0]
                                            .co2Emissions[0].weightUnit
                                    }
                                    <div>
                                        Duración: {dataResults.myReturnDuration}
                                    </div>
                                </div>
                            </div>
                            <br />
                            <div className='flight-info-segments-container'>
                                <div className='flight-info-segment'>
                                    <h5>SALIDA: </h5>
                                    {dataResults &&
                                        showReturnDepartureCity &&
                                        myReturnDepartureCity && (
                                            <div>
                                                <div className='flight-info-time'>
                                                    {
                                                        getMyDateTime(
                                                            dataResults.data
                                                                .data
                                                                .flightOffers[0]
                                                                .itineraries[1]
                                                                .segments[0]
                                                                .departure.at
                                                        )[1]
                                                    }
                                                </div>
                                                <div>
                                                    {
                                                        myReturnDepartureCity
                                                            .address.cityName
                                                    }{' '}
                                                    (
                                                    {
                                                        myReturnDepartureCity
                                                            .address.countryName
                                                    }
                                                    )
                                                </div>
                                                <div>
                                                    {myReturnDepartureCity.name}
                                                </div>
                                                <div>
                                                    Terminal:{' '}
                                                    {
                                                        dataResults.data.data
                                                            .flightOffers[0]
                                                            .itineraries[1]
                                                            .segments[0]
                                                            .departure.terminal
                                                    }
                                                </div>
                                            </div>
                                        )}
                                </div>
                                <div className='flight-info-separator'></div>

                                <div className='flight-info-segment'>
                                    <h5>DESTINO: </h5>
                                    {dataResults &&
                                        showReturnArrivalCity &&
                                        myReturnArrivalCity && (
                                            <div>
                                                <div className='flight-info-time'>
                                                    {
                                                        getMyDateTime(
                                                            dataResults.data
                                                                .data
                                                                .flightOffers[0]
                                                                .itineraries[1]
                                                                .segments[
                                                                dataResults.data
                                                                    .data
                                                                    .flightOffers[0]
                                                                    .itineraries[1]
                                                                    .segments
                                                                    .length - 1
                                                            ].arrival.at
                                                        )[1]
                                                    }
                                                </div>
                                                <div>
                                                    {
                                                        myReturnArrivalCity
                                                            .address.cityName
                                                    }{' '}
                                                    (
                                                    {
                                                        myReturnArrivalCity
                                                            .address.countryName
                                                    }
                                                    )
                                                </div>
                                                <div>
                                                    {myReturnArrivalCity.name}
                                                </div>
                                                <div>
                                                    Terminal:{' '}
                                                    {
                                                        dataResults.data.data
                                                            .flightOffers[0]
                                                            .itineraries[1]
                                                            .segments[0].arrival
                                                            .terminal
                                                    }
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>
                            <div>
                                <p>
                                    Paradas:{' '}
                                    {dataResults.data.data.flightOffers[0]
                                        .itineraries[1].segments.length === 1
                                        ? 'No'
                                        : `${
                                              dataResults.data.data
                                                  .flightOffers[0]
                                                  .itineraries[1].segments
                                                  .length - 1
                                          }`}
                                </p>
                                {dataResults.data.data.flightOffers[0]
                                    .itineraries[1].segments.length > 1 && (
                                    <div>
                                        <ul className='stops-info-container'>
                                            {dataResults?.data?.data?.flightOffers[0].itineraries[1].segments?.map(
                                                (segment) => (
                                                    <li key={segment.id}>
                                                        {
                                                            <p>
                                                                {
                                                                    segment
                                                                        .departure
                                                                        .iataCode
                                                                }{' '}
                                                                (
                                                                {
                                                                    getMyDateTime(
                                                                        segment
                                                                            .departure
                                                                            .at
                                                                    )[1]
                                                                }
                                                                ){' '}
                                                                <CgAirplane id='logo-ida' />{' '}
                                                                {
                                                                    segment
                                                                        .arrival
                                                                        .iataCode
                                                                }{' '}
                                                                (
                                                                {
                                                                    getMyDateTime(
                                                                        segment
                                                                            .arrival
                                                                            .at
                                                                    )[1]
                                                                }
                                                                )
                                                            </p>
                                                        }
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                <div>
                    {dataResults && (
                        <div className='price-info-container'>
                            <br />
                            <p>
                                Equipaje facturado incluido{' '}
                                {dataResults.data.data.flightOffers[0]
                                    .pricingOptions.includedCheckedBagsOnly
                                    ? '✅'
                                    : '❌'}
                            </p>
                            <p>
                                BASE:{' '}
                                {dataResults.data.data.flightOffers[0].travelerPricings
                                    .reduce(
                                        (acu, value) =>
                                            acu + Number(value.price.base),
                                        0
                                    )
                                    .toFixed(2)}
                                {getSymbol(
                                    dataResults.data.data.flightOffers[0].price
                                        .currency
                                )}
                            </p>
                            <p>
                                IMPUESTOS:{' '}
                                {dataResults.data.data.flightOffers[0].travelerPricings
                                    .reduce(
                                        (acu, value) =>
                                            acu +
                                            Number(value.price.refundableTaxes),
                                        0
                                    )
                                    .toFixed(2)}
                                {getSymbol(
                                    dataResults.data.data.flightOffers[0]
                                        .travelerPricings[0].price.currency
                                )}
                            </p>
                            <p className='total-price'>
                                TOTAL:{' '}
                                {dataResults.data.data.flightOffers[0].travelerPricings
                                    .reduce(
                                        (acu, value) =>
                                            acu + Number(value.price.total),
                                        0
                                    )
                                    .toFixed(2)}
                                {getSymbol(
                                    dataResults.data.data.flightOffers[0].price
                                        .currency
                                )}
                            </p>
                        </div>
                    )}
                </div>
                <div className='buttons-container not-to-pdf'>
                    <button
                        className='passengers-confirm-button'
                        onClick={() => {
                            handleClickPassengers();
                        }}
                    >
                        <CheckCircleOutlineIcon fontSize='medium' />
                        Confirmar pasajeros
                    </button>
                    <button
                        className='covid-info-button'
                        onClick={() => {
                            setShowCovidRestrictions(!showCovidRestrictions);
                        }}
                    >
                        🦠 Información Covid-19
                    </button>
                    {!values.disabledPDF && (
                        <button onClick={() => generatePDF()}>
                            Ver en PDF
                        </button>
                    )}
                </div>

                {dataResults && covidRestrictions && showCovidRestrictions && (
                    <div className='covid-info-container'>
                        <div className='covid-info-title'>
                            Información COVID-19 en DESTINO
                        </div>
                        <div>
                            <b>Área:</b> {covidRestrictions.data.data.area.name}
                        </div>
                        <div>
                            <b>Restricciones de acceso:</b> (
                            {
                                covidRestrictions.data.data
                                    .areaAccessRestriction.declarationDocuments
                                    .date
                            }
                            )
                        </div>

                        {
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: `${covidRestrictions.data.data.areaAccessRestriction.declarationDocuments.text}`,
                                }}
                            ></div>
                        }
                        <div>
                            <br />
                            <b>Test Covid: </b>(
                            {
                                covidRestrictions.data.data
                                    .areaAccessRestriction.diseaseTesting.date
                            }
                            )
                            {
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: `${covidRestrictions.data.data.areaAccessRestriction.diseaseTesting.text}`,
                                    }}
                                ></p>
                            }
                        </div>
                        <br />
                        <div>
                            <b>Vacunación: </b>(
                            {
                                covidRestrictions.data.data
                                    .areaAccessRestriction.diseaseVaccination
                                    .date
                            }
                            )
                            {
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: `${covidRestrictions.data.data.areaAccessRestriction.diseaseVaccination.text}`,
                                    }}
                                ></p>
                            }
                        </div>
                    </div>
                )}
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
                        autoHideDuration={5000}
                        onClose={handleCloseOk}
                    >
                        <Alert onClose={handleCloseOk} severity='success'>
                            {values.ok}
                        </Alert>
                    </Snackbar>
                </>
            </div>
        </div>
    );
}

export default SelectedFlightInfo;
