import {
    DirectionsRenderer,
    DirectionsService,
} from '@react-google-maps/api'
import React, { useEffect, useState } from 'react'

export const RotaGoogleMap = ({ destino, origem, onRouteReceived }) => {
    const [response, setResponse] = useState(null)

    useEffect(() => {
        if (destino !== null || origem !== null) {
            setResponse(null)
        }
    }, [destino, origem])

    const directionsCallback = (result, status) => {
        if (status === 'OK' && response === null) {
            const { duration, distance } = result.routes[0].legs[0]
            onRouteReceived({
                isSet: true,
                duracaoText: duration.text,
                distanciaText: distance.text,
                duracaoValue: duration.value,
                distanciaValue: distance.value,
            })
            setResponse(result)
        }
    }

    return (
        <>
            {
                (
                    destino !== null
                    && origem !== null
                ) && (
                    <DirectionsService
                        // required
                        options={{
                            destination: { lat: destino.LATITUDE, lng: destino.LONGITUDE },
                            origin: { lat: origem.LATITUDE, lng: origem.LONGITUDE },
                            travelMode: 'DRIVING',
                            provideRouteAlternatives: false,
                            region: 'PT',
                        }}
                        // required
                        // Não é permitida cache
                        // https://cloud.google.com/maps-platform/terms#3.-license.
                        // https://cloud.google.com/maps-platform/terms/maps-service-terms#1.-directions-api
                        callback={directionsCallback}
                    />
                )
            }

            {
                response !== null && (
                    <DirectionsRenderer
                        // required
                        options={{
                            directions: response,
                        }}
                    />
                )
            }
        </>
    )
}
