export default function FindUs() {
    return (
        <div className="h-1/2">
            <h1 className='text-2xl md:text-6xl font-semibold text-center py-10'>¿Dónde puedes encontrarnos?</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="h-[50rem]">
                    <iframe
                        className="w-full h-full rounded-md"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19748.861899799846!2d-86.18673272921484!3d12.139179228051324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f73fbfc3f69cac7%3A0x23fd903b3fad5c5a!2sAeropuerto%20Internacional%20Augusto%20C.%20Sandino!5e0!3m2!1ses-419!2sni!4v1724800016566!5m2!1ses-419!2sni"
                        allow="fullscreen"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
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
        </div>
    );
}