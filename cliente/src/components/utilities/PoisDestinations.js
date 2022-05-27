import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    POIS_DESTINATIONS,
    POIS_DESTINATIONS_AVAILABLE,
} from '../../constants';
import { PoiDestinationCard } from './PoiDestinationCard';
import { AiOutlineArrowDown } from 'react-icons/ai';

export const PoisDestinations = ({ destinationLocationCode }) => {
    const [pois, setPois] = useState([]);
    const [currentCity, setCurrentCity] = useState('');

    useEffect(() => {
        setPois([]);
        if (POIS_DESTINATIONS_AVAILABLE.includes(destinationLocationCode)) {
            const city = POIS_DESTINATIONS.filter((city) =>
                city.iataCodes.includes(destinationLocationCode)
            );
            setCurrentCity(city[0].name);
            const apiCall = async () => {
                const { data } = await axios.get(
                    `${process.env.REACT_APP_NODE_URL}/poisDestination`,
                    {
                        params: {
                            north: city[0].north,
                            south: city[0].south,
                            west: city[0].west,
                            east: city[0].east,
                        },
                    }
                );

                if (data) {
                    setPois(data?.data?.data);
                }
            };
            apiCall();
        }
        return setPois([]);
    }, [destinationLocationCode]);

    return (
        <div id='pois-container'>
            <div>
                Tours y actividades en <b>{currentCity}</b>
                <div>
                    <AiOutlineArrowDown className='arrow-icon-poi' />
                </div>
            </div>

            {pois.map((poi) => (
                <PoiDestinationCard
                    key={poi.id}
                    name={poi.name}
                    description={poi.shortDescription}
                    image={poi.pictures[0]}
                    bookingLink={poi.bookingLink}
                    price={poi.price.amount}
                />
            ))}
        </div>
    );
};
