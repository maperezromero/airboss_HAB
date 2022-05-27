import { AppRouter } from './routers/AppRouter';
import './App.css';
import { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const App = () => {
    const [showForm, setShowForm] = useState(false);
    const [name, setNameUser] = useState(null);
    const [lastname, setLastname] = useState(null);
    const [phone, setPhone] = useState('');
    const [nationality, setNationality] = useState('');
    const [birthday, setBirthday] = useState(null);
    const [createdAt, setCreatedAt] = useState(null);
    const [email, setEmail] = useState('');
    const [animation, setAnimation] = useState('animate__backInDown');
    const [picture, setPicture] = useState('');
    const [opacity, setOpacity] = useState({
        opacity: 1,
    });
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [showRestorePasswordForm, setRestorePasswordForm] = useState(false);
    const [showEditTravelerForm, setShowEditTravelerForm] = useState(false);
    const [travelersInfo, setTravelersInfo] = useState(null);
    //Hook para recoger información de pasajeros relacionados con el idUSer
    const [saveTravelers, setSaveTravelers] = useState(null);
    const [currentTraveler, setCurrentTraveler] = useState('');
    const refApp = useRef(null);

    const isLogged = () => {
        const token = localStorage.getItem('userToken');
        if (token) {
            return true;
        }
        return false;
    };

    const [login, setLogin] = useState(isLogged());

    useEffect(() => {
        function handleKeyDown(e) {
            if (!refApp.current || refApp.current.contains(e.target)) {
                return;
            }
            if (e.keyCode === 27) {
                setShowRegisterForm(false);
                setShowForm(false);
            }
            //si pulsamos ESC cambiamos la clase para la animación y tras 2 segundos fijamos a false
            if (e.keyCode === 27) {
                setAnimation('animate__backOutUp');
                setTimeout(() => {
                    //Si se está mostrando el formulario de login fijo el valor a false,
                    //sino es que se está mostrando el formulario de registro
                    setShowForm(false);
                    setShowRegisterForm(false);
                    setOpacity({
                        opacity: 1,
                    });
                    showForm ? setShowForm(false) : setShowRegisterForm(false);
                }, 1000);
            }
        }
        document.addEventListener('keydown', handleKeyDown);

        const token = localStorage.getItem('userToken');
        const typeAuth = localStorage.getItem('typeAuth');

        if (token && typeAuth === 'API') {
            const idUser = localStorage.getItem('idUser');

            try {
                async function validateToken() {
                    const res = await axios.get(
                        `${process.env.REACT_APP_NODE_URL}/users/validate-token/${typeAuth}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                authorization: token,
                                iduser: idUser,
                            },
                        }
                    );

                    if (res.data.status === 'ok') {
                        try {
                            const { data } = await axios.get(
                                `${process.env.REACT_APP_NODE_URL}/users/id/${idUser}`
                            );

                            const currentUser = data.data;

                            if (currentUser.length === 1) {
                                // console.log(currentUser[0].avatar);
                                setNameUser(currentUser[0].name);
                                setLastname(currentUser[0].lastname);
                                setEmail(currentUser[0].email);
                                setNationality(currentUser[0].nationality);
                                setPhone(currentUser[0].phoneNumber);
                                setBirthday(currentUser[0].birthDate);
                                setCreatedAt(currentUser[0].createdAt);
                                if (currentUser[0].avatar) {
                                    setPicture(currentUser[0].avatar);
                                    // console.log('FIJAMOS AVATAR:::', currentUser[0].avatar);
                                }
                                setLogin(true);
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    } else {
                        //console.log('HAY UN PROBLEMA EN EL LOGADO');
                        setLogin(false);
                    }
                }
                validateToken();
            } catch (error) {
                console.log(error);
            }
        }

        if (token && typeAuth === 'google') {
            const idUser = localStorage.getItem('idUser');

            try {
                async function validateToken() {
                    const res = await axios.get(
                        `${process.env.REACT_APP_NODE_URL}/users/validate-token/${typeAuth}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                authorization: token,
                            },
                        }
                    );

                    if (res.data.status === 'ok') {
                        try {
                            const { data } = await axios.get(
                                `${process.env.REACT_APP_NODE_URL}/users/id/${idUser}`
                            );

                            const currentUser = data?.data;

                            console.log(currentUser[0]);
                            if (currentUser.length === 1) {
                                // console.log('CURRENTUSER:::',currentUser);
                                setNameUser(currentUser[0].name);
                                setLastname(currentUser[0].lastname);
                                setPhone(currentUser[0].phoneNumber);
                                setNationality(currentUser[0].nationality);
                                setCreatedAt(currentUser[0].createdAt);
                                setBirthday(currentUser[0].birthday);
                                setEmail(currentUser[0].email);
                                setPicture(currentUser[0].avatar);
                                setLogin(true);
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    } else {
                        console.log(
                            'HAY UN PROBLEMA EN EL LOGADO DE GOOGLE/FB APP.JS'
                        );
                        setLogin(false);
                    }
                }
                validateToken();
            } catch (error) {
                console.log(error);
            }
        }

        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showForm, email]);

    return (
        <div ref={refApp}>
            <AuthContext.Provider
                value={{
                    login,
                    setLogin,
                    showForm,
                    setShowForm,
                    email,
                    setEmail,
                    name,
                    setNameUser,
                    lastname,
                    setLastname,
                    refApp,
                    animation,
                    setAnimation,
                    phone,
                    setPhone,
                    nationality,
                    setNationality,
                    createdAt,
                    setCreatedAt,
                    birthday,
                    setBirthday,
                    opacity,
                    setOpacity,
                    picture,
                    setPicture,
                    showRegisterForm,
                    setShowRegisterForm,
                    setRestorePasswordForm,
                    showRestorePasswordForm,
                    showEditTravelerForm,
                    setShowEditTravelerForm,
                    travelersInfo,
                    setTravelersInfo,
                    currentTraveler,
                    setCurrentTraveler,
                    saveTravelers,
                    setSaveTravelers,
                }}
            >
                <AppRouter />
            </AuthContext.Provider>
        </div>
    );
};
