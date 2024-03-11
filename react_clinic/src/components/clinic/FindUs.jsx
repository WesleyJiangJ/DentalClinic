import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";

export default function FindUs() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    });
    const center = useMemo(() => ({ lat: 12.136389, lng: -86.251389 }), []);
    return (
        <>
            <h1 className='text-2xl lg:text-6xl font-semibold text-center py-10'>¿Dónde encontrarnos?</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div>
                    {!isLoaded ? (
                        <h1>Loading...</h1>
                    ) : (
                        <GoogleMap
                            mapContainerClassName="w-full h-[650px] rounded-lg"
                            center={center}
                            zoom={10}
                        />
                    )}
                </div>
                <div className="grid place-content-center">
                    <p className="text-center p-5 text-md lg:text-2xl">
                        DentalCare Smile Center
                        123 Calle de la Sonrisa Feliz,
                        Ciudad Alegre, Estado de Bienestar,
                        Código Postal: 12345,
                        País de las Sonrisas.
                    </p>
                </div>
            </div>
        </>
    );
}