import './css/profile-screen.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../App';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { PhotoCamera } from '@material-ui/icons';
import axios from 'axios';
import FormData from 'form-data';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Fragment } from 'react';
import MaterialUiPhoneNumber from 'material-ui-phone-number';
import nextFlight from '../assets/next-flight.jpg';
import { routes } from '../routers/routes';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    input: {
        display: 'none',
    },
}));
const useStylesFlags = makeStyles({
    option: {
        fontSize: 15,
        '& > span': {
            marginRight: 10,
            fontSize: 18,
        },
    },
});

export const ProfileScreen = ({ history, match }) => {
    const classesFlags = useStylesFlags();
    const classes = useStyles();
    const {
        phone,
        email,
        name,
        lastname,
        opacity,
        nationality,
        birthday,
        createdAt,
        picture,
        setPicture,
        setNameUser,
        setLastname,
        setNationality,
        setPhone,
        setBirthday,
    } = useContext(AuthContext);
    const birthdayDate = new Date(birthday).toLocaleDateString();
    const createDate = new Date(createdAt).toLocaleDateString();
    const [values, setValues] = useState({
        email: '',
        password: '',
        showPassword: false,
        repeatPassword: '',
        showRepeatPassword: false,
        name: '',
        lastname: '',
        error: '',
        showError: false,
        nationality: '',
        phone: '',
        birthday,
        ok: '',
        showOk: false,
        disabledName: true,
        disabledLastname: true,
        disabledNationality: true,
        disabledPhone: true,
        disabledBirthday: true,
    });

    const inputName = useRef(null);
    const inputLastname = useRef(null);

    useEffect(() => {
        // console.log('LOGINNNNN:',login);
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
    const onChangeAvatar = (event) => {
        // console.log(event);
        setPicture(URL.createObjectURL(event.target.files[0]));
        async function changeAvatar() {
            try {
                // console.log('entro en avatar');
                const token = localStorage.getItem('userToken');
                const typeAuth = localStorage.getItem('typeAuth');
                const formData = new FormData();
                formData.append('avatar', event.target.files[0]);
                formData.append('email', email);

                const res = await axios.post(
                    'http://localhost:3001/users/avatar',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `${token}`,
                            typeauth: `${typeAuth}`,
                        },
                    }
                );
                if (res.data.status === 'ok') {
                    setValues({
                        ...values,
                        ok: 'Avatar modificado!',
                        showOk: true,
                    });
                }
            } catch (error) {
                // console.log(error);
                setValues({ ...values, error: error.message, showError: true });
            }
        }
        changeAvatar();
    };

    /*  const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        if(event.target.id === 'standard-adornment-password' && event.charCode === 13){
            //handleRegister(event);
        }
    }; */
    async function saveElement(element, newValue) {
        const token = localStorage.getItem('userToken');
        const typeAuth = localStorage.getItem('typeAuth');
        const body = {
            element,
            newValue,
        };

        try {
            const { data } = await axios.put(
                `http://localhost:3001/users/${localStorage.getItem('idUser')}`,
                body,
                {
                    headers: {
                        Authorization: `${token}`,
                        typeAuth: `${typeAuth}`,
                    },
                }
            );
            // console.log(data);
            if (data.status === 'ok') {
                if (element === 'name') {
                    setValues({
                        ...values,
                        ok: `Nombre actualizado`,
                        name: newValue,
                        showOk: true,
                        disabledName: true,
                    });
                    setNameUser(newValue);
                    localStorage.setItem('userName', newValue);
                }
                if (element === 'lastname') {
                    setValues({
                        ...values,
                        ok: `Apellido actualizado`,
                        lastname: newValue,
                        showOk: true,
                        disabledLastname: true,
                    });
                    setLastname(newValue);
                }
                if (element === 'nationality') {
                    setValues({
                        ...values,
                        ok: `Nacionalidad actualizada`,
                        nationality: newValue,
                        showOk: true,
                        disabledNationality: true,
                    });
                    setNationality(newValue);
                }
                if (element === 'phoneNumber') {
                    setValues({
                        ...values,
                        ok: `Teléfono actualizado`,
                        phone: newValue,
                        showOk: true,
                        disabledPhone: true,
                    });
                    setPhone(newValue.replace(/\s/g, ''));
                }
                if (element === 'birthDate') {
                    setValues({
                        ...values,
                        ok: `Fecha de nacimiento actualizada`,
                        birthday: newValue,
                        showOk: true,
                        disabledBirthday: true,
                    });
                    setBirthday(newValue);
                }
            }
        } catch (error) {
            setValues({ ...values, error: error.message, showError: true });
            // console.log(error);
        }
    }

    function changeValue(prop, value) {
        //console.log('ENTRO');
        setValues({ ...values, [prop]: value });
    }
    const changeBirthday = (event) => {
        //console.log(event.target.value);
        setValues({ ...values, birthday: event.target.value });
    };
    function focus(element) {
        element.current.disabled = false;
        element.current.focus();
    }

    function countryToFlag(isoCode) {
        return typeof String.fromCodePoint !== 'undefined'
            ? isoCode
                  .toUpperCase()
                  .replace(/./g, (char) =>
                      String.fromCodePoint(char.charCodeAt(0) + 127397)
                  )
            : isoCode;
    }
    const handleonChangePhone = (event) => {
        setValues({ ...values, phone: event.replace(/\s/g, '') });
    };
    const handleChangeNationality = (event) => {
        // console.log(event);
        const country =
            countries[event.currentTarget.dataset.optionIndex]?.label;
        // console.log(country);
        setValues({ ...values, nationality: country });
    };
    return (
        <div id='profile-container-all'>
            <div id='profile-container' style={opacity}>
                <div id='data'>
                    <div id='titles'>
                        <div className={classes.root} id='avatar-container'>
                            <div>
                                <input
                                    accept='image/*'
                                    className={classes.input}
                                    id='icon-button-file'
                                    type='file'
                                    onChange={onChangeAvatar}
                                />
                                <label
                                    htmlFor='icon-button-file'
                                    id='camera-icon'
                                >
                                    <IconButton
                                        color='primary'
                                        aria-label='cargar imagen'
                                        component='span'
                                    >
                                        <PhotoCamera className='camera' />
                                    </IconButton>
                                </label>
                            </div>
                            <div>
                                {picture && (
                                    <img
                                        alt={name}
                                        src={picture}
                                        className='pictureProfile'
                                    />
                                )}
                                {!picture && (
                                    <img
                                        alt={name}
                                        className='no-picture-Profile'
                                    />
                                )}
                            </div>
                        </div>
                        <div className='profile-email'>
                            <div className='info-account'>Mi perfil</div>
                            <div>{email} </div>
                        </div>
                    </div>
                    <div id='data'>
                        <div className='data-container'>
                            <h3>Nombre</h3>
                            <div>
                                <input
                                    type='text'
                                    disabled={values.disabledName}
                                    autoFocus
                                    id='name'
                                    className='inputs-profile'
                                    ref={inputName}
                                    defaultValue={name}
                                    onChange={(event) =>
                                        changeValue('name', event.target.value)
                                    }
                                ></input>
                                {values.disabledName && (
                                    <EditIcon
                                        onClick={() => {
                                            setValues({
                                                ...values,
                                                disabledName: false,
                                            });
                                            focus(inputName);
                                        }}
                                        className='icon-edit'
                                    />
                                )}
                                {!values.disabledName && (
                                    <SaveIcon
                                        onClick={() =>
                                            saveElement('name', values.name)
                                        }
                                        className='icon-edit'
                                    />
                                )}
                            </div>
                        </div>
                        <div className='data-container'>
                            <h3>Apellidos</h3>
                            <div>
                                <input
                                    type='text'
                                    disabled={values.disabledLastname}
                                    id='lastname'
                                    className='inputs-profile'
                                    ref={inputLastname}
                                    defaultValue={lastname}
                                    onChange={(event) =>
                                        changeValue(
                                            'lastname',
                                            event.target.value
                                        )
                                    }
                                ></input>
                                {values.disabledLastname && (
                                    <EditIcon
                                        onClick={() => {
                                            setValues({
                                                ...values,
                                                disabledLastname: false,
                                            });
                                            focus(inputLastname);
                                        }}
                                        className='icon-edit'
                                    />
                                )}
                                {!values.disabledLastname && (
                                    <SaveIcon
                                        onClick={() =>
                                            saveElement(
                                                'lastname',
                                                values.lastname
                                            )
                                        }
                                        className='icon-edit'
                                    />
                                )}
                            </div>
                        </div>

                        <div className='data-container'>
                            <h3>Nacionalidad</h3>
                            <div>
                                {values.disabledNationality && (
                                    <div className='data-4'>
                                        {nationality}{' '}
                                        <EditIcon
                                            onClick={() =>
                                                setValues({
                                                    ...values,
                                                    disabledNationality: false,
                                                })
                                            }
                                            className='icon-edit'
                                        />
                                    </div>
                                )}

                                {!values.disabledNationality && (
                                    <div className='data-4'>
                                        <Autocomplete
                                            id='country-select'
                                            style={{
                                                width: 300,
                                                zIndex: 10000,
                                            }}
                                            options={countries}
                                            disablePortal
                                            classes={{
                                                option: classesFlags.option,
                                            }}
                                            className='inputs-form-country'
                                            onChange={handleChangeNationality}
                                            autoHighlight
                                            getOptionLabel={(option) =>
                                                option.label
                                            }
                                            renderOption={(option) => (
                                                <Fragment>
                                                    <span>
                                                        {countryToFlag(
                                                            option.code
                                                        )}
                                                    </span>
                                                    {option.label} (
                                                    {option.code}) +
                                                    {option.phone}
                                                </Fragment>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    className='textField-countries'
                                                    {...params}
                                                    onChange={
                                                        handleChangeNationality
                                                    }
                                                    label='Elige un país'
                                                    variant='standard'
                                                />
                                            )}
                                        />
                                        <SaveIcon
                                            onClick={() =>
                                                saveElement(
                                                    'nationality',
                                                    values.nationality
                                                )
                                            }
                                            className='icon-edit'
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='data-container'>
                            <h3>Teléfonos</h3>
                            <div>
                                {values.disabledPhone && (
                                    <div className='data-5'>
                                        {phone}{' '}
                                        <EditIcon
                                            onClick={() =>
                                                setValues({
                                                    ...values,
                                                    disabledPhone: false,
                                                })
                                            }
                                            className='icon-edit'
                                        />{' '}
                                    </div>
                                )}
                                {!values.disabledPhone && (
                                    <div className='data-5'>
                                        <MaterialUiPhoneNumber
                                            dropdownClass='list-countries'
                                            className='input-phone inputs-form'
                                            defaultCountry={'es'}
                                            onChange={handleonChangePhone}
                                        />
                                        <SaveIcon
                                            onClick={() =>
                                                saveElement(
                                                    'phoneNumber',
                                                    values.phone
                                                )
                                            }
                                            className='icon-edit'
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='data-container'>
                            <h3>Fecha de Nacimiento</h3>
                            <div>
                                {values.disabledBirthday && (
                                    <div className='data-6'>
                                        {birthdayDate}{' '}
                                        <EditIcon
                                            onClick={() =>
                                                setValues({
                                                    ...values,
                                                    disabledBirthday: false,
                                                })
                                            }
                                            className='icon-edit'
                                        />{' '}
                                    </div>
                                )}
                                {!values.disabledBirthday && (
                                    <div className='data-6'>
                                        <TextField
                                            id='birthday'
                                            label='Fecha de nacimiento'
                                            type='date'
                                            defaultValue=''
                                            className='birthday'
                                            onChange={changeBirthday}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                        <SaveIcon
                                            onClick={() =>
                                                saveElement(
                                                    'birthDate',
                                                    values.birthday
                                                )
                                            }
                                            className='icon-edit'
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='data-container'>
                            <h3>Fecha de alta de usuario</h3>
                            <div>
                                {createdAt && (
                                    <div className='data-7'>{createDate}</div>
                                )}
                            </div>
                        </div>
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
                </div>
                <div id='section2-profile'>
                    <div>
                        <h3>¡Planea tu próximo vuelo!</h3>
                        <p>Aprovecha todas las ofertas disponibles</p>
                        <figure>
                            <img src={nextFlight} width='100%' alt='airboss' />
                        </figure>
                        <button
                            onClick={() => {
                                history.push(routes.home);
                            }}
                        >
                            Encuentra tu vuelo
                        </button>
                    </div>
                    <div>
                        <h3>Accede a tus reservas</h3>
                        <button
                            onClick={() => {
                                history.push('/bookingHistory');
                            }}
                        >
                            Mis vuelos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
const countries = [
    { code: 'AD', label: 'Andorra', phone: '376' },
    { code: 'AE', label: 'United Arab Emirates', phone: '971' },
    { code: 'AF', label: 'Afghanistan', phone: '93' },
    { code: 'AG', label: 'Antigua and Barbuda', phone: '1-268' },
    { code: 'AI', label: 'Anguilla', phone: '1-264' },
    { code: 'AL', label: 'Albania', phone: '355' },
    { code: 'AM', label: 'Armenia', phone: '374' },
    { code: 'AO', label: 'Angola', phone: '244' },
    { code: 'AQ', label: 'Antarctica', phone: '672' },
    { code: 'AR', label: 'Argentina', phone: '54' },
    { code: 'AS', label: 'American Samoa', phone: '1-684' },
    { code: 'AT', label: 'Austria', phone: '43' },
    { code: 'AU', label: 'Australia', phone: '61', suggested: true },
    { code: 'AW', label: 'Aruba', phone: '297' },
    { code: 'AX', label: 'Alland Islands', phone: '358' },
    { code: 'AZ', label: 'Azerbaijan', phone: '994' },
    { code: 'BA', label: 'Bosnia and Herzegovina', phone: '387' },
    { code: 'BB', label: 'Barbados', phone: '1-246' },
    { code: 'BD', label: 'Bangladesh', phone: '880' },
    { code: 'BE', label: 'Belgium', phone: '32' },
    { code: 'BF', label: 'Burkina Faso', phone: '226' },
    { code: 'BG', label: 'Bulgaria', phone: '359' },
    { code: 'BH', label: 'Bahrain', phone: '973' },
    { code: 'BI', label: 'Burundi', phone: '257' },
    { code: 'BJ', label: 'Benin', phone: '229' },
    { code: 'BL', label: 'Saint Barthelemy', phone: '590' },
    { code: 'BM', label: 'Bermuda', phone: '1-441' },
    { code: 'BN', label: 'Brunei Darussalam', phone: '673' },
    { code: 'BO', label: 'Bolivia', phone: '591' },
    { code: 'BR', label: 'Brazil', phone: '55' },
    { code: 'BS', label: 'Bahamas', phone: '1-242' },
    { code: 'BT', label: 'Bhutan', phone: '975' },
    { code: 'BV', label: 'Bouvet Island', phone: '47' },
    { code: 'BW', label: 'Botswana', phone: '267' },
    { code: 'BY', label: 'Belarus', phone: '375' },
    { code: 'BZ', label: 'Belize', phone: '501' },
    { code: 'CA', label: 'Canada', phone: '1', suggested: true },
    { code: 'CC', label: 'Cocos (Keeling) Islands', phone: '61' },
    { code: 'CD', label: 'Congo, Democratic Republic of the', phone: '243' },
    { code: 'CF', label: 'Central African Republic', phone: '236' },
    { code: 'CG', label: 'Congo, Republic of the', phone: '242' },
    { code: 'CH', label: 'Switzerland', phone: '41' },
    { code: 'CI', label: "Cote d'Ivoire", phone: '225' },
    { code: 'CK', label: 'Cook Islands', phone: '682' },
    { code: 'CL', label: 'Chile', phone: '56' },
    { code: 'CM', label: 'Cameroon', phone: '237' },
    { code: 'CN', label: 'China', phone: '86' },
    { code: 'CO', label: 'Colombia', phone: '57' },
    { code: 'CR', label: 'Costa Rica', phone: '506' },
    { code: 'CU', label: 'Cuba', phone: '53' },
    { code: 'CV', label: 'Cape Verde', phone: '238' },
    { code: 'CW', label: 'Curacao', phone: '599' },
    { code: 'CX', label: 'Christmas Island', phone: '61' },
    { code: 'CY', label: 'Cyprus', phone: '357' },
    { code: 'CZ', label: 'Czech Republic', phone: '420' },
    { code: 'DE', label: 'Germany', phone: '49', suggested: true },
    { code: 'DJ', label: 'Djibouti', phone: '253' },
    { code: 'DK', label: 'Denmark', phone: '45' },
    { code: 'DM', label: 'Dominica', phone: '1-767' },
    { code: 'DO', label: 'Dominican Republic', phone: '1-809' },
    { code: 'DZ', label: 'Algeria', phone: '213' },
    { code: 'EC', label: 'Ecuador', phone: '593' },
    { code: 'EE', label: 'Estonia', phone: '372' },
    { code: 'EG', label: 'Egypt', phone: '20' },
    { code: 'EH', label: 'Western Sahara', phone: '212' },
    { code: 'ER', label: 'Eritrea', phone: '291' },
    { code: 'ES', label: 'Spain', phone: '34' },
    { code: 'ET', label: 'Ethiopia', phone: '251' },
    { code: 'FI', label: 'Finland', phone: '358' },
    { code: 'FJ', label: 'Fiji', phone: '679' },
    { code: 'FK', label: 'Falkland Islands (Malvinas)', phone: '500' },
    { code: 'FM', label: 'Micronesia, Federated States of', phone: '691' },
    { code: 'FO', label: 'Faroe Islands', phone: '298' },
    { code: 'FR', label: 'France', phone: '33', suggested: true },
    { code: 'GA', label: 'Gabon', phone: '241' },
    { code: 'GB', label: 'United Kingdom', phone: '44' },
    { code: 'GD', label: 'Grenada', phone: '1-473' },
    { code: 'GE', label: 'Georgia', phone: '995' },
    { code: 'GF', label: 'French Guiana', phone: '594' },
    { code: 'GG', label: 'Guernsey', phone: '44' },
    { code: 'GH', label: 'Ghana', phone: '233' },
    { code: 'GI', label: 'Gibraltar', phone: '350' },
    { code: 'GL', label: 'Greenland', phone: '299' },
    { code: 'GM', label: 'Gambia', phone: '220' },
    { code: 'GN', label: 'Guinea', phone: '224' },
    { code: 'GP', label: 'Guadeloupe', phone: '590' },
    { code: 'GQ', label: 'Equatorial Guinea', phone: '240' },
    { code: 'GR', label: 'Greece', phone: '30' },
    {
        code: 'GS',
        label: 'South Georgia and the South Sandwich Islands',
        phone: '500',
    },
    { code: 'GT', label: 'Guatemala', phone: '502' },
    { code: 'GU', label: 'Guam', phone: '1-671' },
    { code: 'GW', label: 'Guinea-Bissau', phone: '245' },
    { code: 'GY', label: 'Guyana', phone: '592' },
    { code: 'HK', label: 'Hong Kong', phone: '852' },
    { code: 'HM', label: 'Heard Island and McDonald Islands', phone: '672' },
    { code: 'HN', label: 'Honduras', phone: '504' },
    { code: 'HR', label: 'Croatia', phone: '385' },
    { code: 'HT', label: 'Haiti', phone: '509' },
    { code: 'HU', label: 'Hungary', phone: '36' },
    { code: 'ID', label: 'Indonesia', phone: '62' },
    { code: 'IE', label: 'Ireland', phone: '353' },
    { code: 'IL', label: 'Israel', phone: '972' },
    { code: 'IM', label: 'Isle of Man', phone: '44' },
    { code: 'IN', label: 'India', phone: '91' },
    { code: 'IO', label: 'British Indian Ocean Territory', phone: '246' },
    { code: 'IQ', label: 'Iraq', phone: '964' },
    { code: 'IR', label: 'Iran, Islamic Republic of', phone: '98' },
    { code: 'IS', label: 'Iceland', phone: '354' },
    { code: 'IT', label: 'Italy', phone: '39' },
    { code: 'JE', label: 'Jersey', phone: '44' },
    { code: 'JM', label: 'Jamaica', phone: '1-876' },
    { code: 'JO', label: 'Jordan', phone: '962' },
    { code: 'JP', label: 'Japan', phone: '81', suggested: true },
    { code: 'KE', label: 'Kenya', phone: '254' },
    { code: 'KG', label: 'Kyrgyzstan', phone: '996' },
    { code: 'KH', label: 'Cambodia', phone: '855' },
    { code: 'KI', label: 'Kiribati', phone: '686' },
    { code: 'KM', label: 'Comoros', phone: '269' },
    { code: 'KN', label: 'Saint Kitts and Nevis', phone: '1-869' },
    {
        code: 'KP',
        label: "Korea, Democratic People's Republic of",
        phone: '850',
    },
    { code: 'KR', label: 'Korea, Republic of', phone: '82' },
    { code: 'KW', label: 'Kuwait', phone: '965' },
    { code: 'KY', label: 'Cayman Islands', phone: '1-345' },
    { code: 'KZ', label: 'Kazakhstan', phone: '7' },
    { code: 'LA', label: "Lao People's Democratic Republic", phone: '856' },
    { code: 'LB', label: 'Lebanon', phone: '961' },
    { code: 'LC', label: 'Saint Lucia', phone: '1-758' },
    { code: 'LI', label: 'Liechtenstein', phone: '423' },
    { code: 'LK', label: 'Sri Lanka', phone: '94' },
    { code: 'LR', label: 'Liberia', phone: '231' },
    { code: 'LS', label: 'Lesotho', phone: '266' },
    { code: 'LT', label: 'Lithuania', phone: '370' },
    { code: 'LU', label: 'Luxembourg', phone: '352' },
    { code: 'LV', label: 'Latvia', phone: '371' },
    { code: 'LY', label: 'Libya', phone: '218' },
    { code: 'MA', label: 'Morocco', phone: '212' },
    { code: 'MC', label: 'Monaco', phone: '377' },
    { code: 'MD', label: 'Moldova, Republic of', phone: '373' },
    { code: 'ME', label: 'Montenegro', phone: '382' },
    { code: 'MF', label: 'Saint Martin (French part)', phone: '590' },
    { code: 'MG', label: 'Madagascar', phone: '261' },
    { code: 'MH', label: 'Marshall Islands', phone: '692' },
    {
        code: 'MK',
        label: 'Macedonia, the Former Yugoslav Republic of',
        phone: '389',
    },
    { code: 'ML', label: 'Mali', phone: '223' },
    { code: 'MM', label: 'Myanmar', phone: '95' },
    { code: 'MN', label: 'Mongolia', phone: '976' },
    { code: 'MO', label: 'Macao', phone: '853' },
    { code: 'MP', label: 'Northern Mariana Islands', phone: '1-670' },
    { code: 'MQ', label: 'Martinique', phone: '596' },
    { code: 'MR', label: 'Mauritania', phone: '222' },
    { code: 'MS', label: 'Montserrat', phone: '1-664' },
    { code: 'MT', label: 'Malta', phone: '356' },
    { code: 'MU', label: 'Mauritius', phone: '230' },
    { code: 'MV', label: 'Maldives', phone: '960' },
    { code: 'MW', label: 'Malawi', phone: '265' },
    { code: 'MX', label: 'Mexico', phone: '52' },
    { code: 'MY', label: 'Malaysia', phone: '60' },
    { code: 'MZ', label: 'Mozambique', phone: '258' },
    { code: 'NA', label: 'Namibia', phone: '264' },
    { code: 'NC', label: 'New Caledonia', phone: '687' },
    { code: 'NE', label: 'Niger', phone: '227' },
    { code: 'NF', label: 'Norfolk Island', phone: '672' },
    { code: 'NG', label: 'Nigeria', phone: '234' },
    { code: 'NI', label: 'Nicaragua', phone: '505' },
    { code: 'NL', label: 'Netherlands', phone: '31' },
    { code: 'NO', label: 'Norway', phone: '47' },
    { code: 'NP', label: 'Nepal', phone: '977' },
    { code: 'NR', label: 'Nauru', phone: '674' },
    { code: 'NU', label: 'Niue', phone: '683' },
    { code: 'NZ', label: 'New Zealand', phone: '64' },
    { code: 'OM', label: 'Oman', phone: '968' },
    { code: 'PA', label: 'Panama', phone: '507' },
    { code: 'PE', label: 'Peru', phone: '51' },
    { code: 'PF', label: 'French Polynesia', phone: '689' },
    { code: 'PG', label: 'Papua New Guinea', phone: '675' },
    { code: 'PH', label: 'Philippines', phone: '63' },
    { code: 'PK', label: 'Pakistan', phone: '92' },
    { code: 'PL', label: 'Poland', phone: '48' },
    { code: 'PM', label: 'Saint Pierre and Miquelon', phone: '508' },
    { code: 'PN', label: 'Pitcairn', phone: '870' },
    { code: 'PR', label: 'Puerto Rico', phone: '1' },
    { code: 'PS', label: 'Palestine, State of', phone: '970' },
    { code: 'PT', label: 'Portugal', phone: '351' },
    { code: 'PW', label: 'Palau', phone: '680' },
    { code: 'PY', label: 'Paraguay', phone: '595' },
    { code: 'QA', label: 'Qatar', phone: '974' },
    { code: 'RE', label: 'Reunion', phone: '262' },
    { code: 'RO', label: 'Romania', phone: '40' },
    { code: 'RS', label: 'Serbia', phone: '381' },
    { code: 'RU', label: 'Russian Federation', phone: '7' },
    { code: 'RW', label: 'Rwanda', phone: '250' },
    { code: 'SA', label: 'Saudi Arabia', phone: '966' },
    { code: 'SB', label: 'Solomon Islands', phone: '677' },
    { code: 'SC', label: 'Seychelles', phone: '248' },
    { code: 'SD', label: 'Sudan', phone: '249' },
    { code: 'SE', label: 'Sweden', phone: '46' },
    { code: 'SG', label: 'Singapore', phone: '65' },
    { code: 'SH', label: 'Saint Helena', phone: '290' },
    { code: 'SI', label: 'Slovenia', phone: '386' },
    { code: 'SJ', label: 'Svalbard and Jan Mayen', phone: '47' },
    { code: 'SK', label: 'Slovakia', phone: '421' },
    { code: 'SL', label: 'Sierra Leone', phone: '232' },
    { code: 'SM', label: 'San Marino', phone: '378' },
    { code: 'SN', label: 'Senegal', phone: '221' },
    { code: 'SO', label: 'Somalia', phone: '252' },
    { code: 'SR', label: 'Suriname', phone: '597' },
    { code: 'SS', label: 'South Sudan', phone: '211' },
    { code: 'ST', label: 'Sao Tome and Principe', phone: '239' },
    { code: 'SV', label: 'El Salvador', phone: '503' },
    { code: 'SX', label: 'Sint Maarten (Dutch part)', phone: '1-721' },
    { code: 'SY', label: 'Syrian Arab Republic', phone: '963' },
    { code: 'SZ', label: 'Swaziland', phone: '268' },
    { code: 'TC', label: 'Turks and Caicos Islands', phone: '1-649' },
    { code: 'TD', label: 'Chad', phone: '235' },
    { code: 'TF', label: 'French Southern Territories', phone: '262' },
    { code: 'TG', label: 'Togo', phone: '228' },
    { code: 'TH', label: 'Thailand', phone: '66' },
    { code: 'TJ', label: 'Tajikistan', phone: '992' },
    { code: 'TK', label: 'Tokelau', phone: '690' },
    { code: 'TL', label: 'Timor-Leste', phone: '670' },
    { code: 'TM', label: 'Turkmenistan', phone: '993' },
    { code: 'TN', label: 'Tunisia', phone: '216' },
    { code: 'TO', label: 'Tonga', phone: '676' },
    { code: 'TR', label: 'Turkey', phone: '90' },
    { code: 'TT', label: 'Trinidad and Tobago', phone: '1-868' },
    { code: 'TV', label: 'Tuvalu', phone: '688' },
    { code: 'TW', label: 'Taiwan, Province of China', phone: '886' },
    { code: 'TZ', label: 'United Republic of Tanzania', phone: '255' },
    { code: 'UA', label: 'Ukraine', phone: '380' },
    { code: 'UG', label: 'Uganda', phone: '256' },
    { code: 'US', label: 'United States', phone: '1', suggested: true },
    { code: 'UY', label: 'Uruguay', phone: '598' },
    { code: 'UZ', label: 'Uzbekistan', phone: '998' },
    { code: 'VA', label: 'Holy See (Vatican City State)', phone: '379' },
    { code: 'VC', label: 'Saint Vincent and the Grenadines', phone: '1-784' },
    { code: 'VE', label: 'Venezuela', phone: '58' },
    { code: 'VG', label: 'British Virgin Islands', phone: '1-284' },
    { code: 'VI', label: 'US Virgin Islands', phone: '1-340' },
    { code: 'VN', label: 'Vietnam', phone: '84' },
    { code: 'VU', label: 'Vanuatu', phone: '678' },
    { code: 'WF', label: 'Wallis and Futuna', phone: '681' },
    { code: 'WS', label: 'Samoa', phone: '685' },
    { code: 'XK', label: 'Kosovo', phone: '383' },
    { code: 'YE', label: 'Yemen', phone: '967' },
    { code: 'YT', label: 'Mayotte', phone: '262' },
    { code: 'ZA', label: 'South Africa', phone: '27' },
    { code: 'ZM', label: 'Zambia', phone: '260' },
    { code: 'ZW', label: 'Zimbabwe', phone: '263' },
];
