import { useState, useEffect, Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import './css/city-search.css';

export default function CitySearch({ label, setInput, input }) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = open && options.length === 0;
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        if (inputText.length > 0) {
            const apiCall = async () => {
                const { data } = await axios.get(
                    `${process.env.REACT_APP_NODE_URL}/citySearch`,
                    {
                        params: {
                            keyword: inputText,
                            view: 'LIGHT',
                        },
                    }
                );

                const cities = data.data.data?.map((city) => {
                    return {
                        detailedName: city.detailedName,
                        iataCode: city.iataCode,
                        cityName: city.address.cityName,
                        airportName: city.name,
                        countryCode: city.address.countryCode,
                    };
                });
                setOptions(cities);
            };

            const timer = setTimeout(() => {
                apiCall();
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setOptions([]);
        }
    }, [inputText]);

    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    return (
        <Autocomplete
            style={{
                width: 300,
            }}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            getOptionSelected={(option, value) =>
                option?.detailedName === value?.detailedName
            }
            getOptionLabel={(option) => option.detailedName}
            options={options}
            onChange={(e) => {
                const label = e.target.innerText;
                if (label) {
                    const o = options.find(
                        (option) => option.detailedName === label
                    );

                    setInput({
                        city: o?.iataCode,
                        country: o?.countryCode,
                        cityName: o?.cityName,
                    });
                }
            }}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    onChange={(e) => {
                        setInputText(e.target.value);
                    }}
                    required
                    autoComplete='false'
                    label={label}
                    variant='filled'
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <Fragment>
                                {loading ? (
                                    <CircularProgress
                                        color='inherit'
                                        size={15}
                                    />
                                ) : null}
                                {params.InputProps.endAdornment}
                            </Fragment>
                        ),
                    }}
                />
            )}
        />
    );
}
