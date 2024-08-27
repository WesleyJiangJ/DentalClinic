import { Carousel, Typography } from "@material-tailwind/react";

export default function Speciality() {
    const specialties = [
        {
            text: 'Odontología General',
            image: '../images/GeneralDentistry.jpeg',
            alt: 'GeneralDentistry Image',
            description: 'La odontología general se encarga del cuidado integral de tu salud bucal, desde la prevención hasta el tratamiento de enfermedades comunes como caries y gingivitis.'
        },
        {
            text: 'Odontopediatría',
            image: '../images/Odontopediatria.jpeg',
            alt: 'Odontopediatría Image',
            description: 'Especializada en el cuidado dental de los más pequeños, la odontopediatría ofrece tratamientos adaptados a las necesidades de los niños, asegurando su bienestar desde temprana edad.'
        },
        {
            text: 'Ortodoncia',
            image: '../images/Orthodontics.jpeg',
            alt: 'Orthodontics Image',
            description: 'La ortodoncia se enfoca en corregir problemas de alineación y mordida, utilizando aparatos que te ayudarán a lograr una sonrisa recta y saludable.'
        },
        {
            text: 'Cirugía Oral y Maxilofacial',
            image: '../images/OralMaxillofacialSurgery.jpeg',
            alt: 'Oral and Maxillofacial Surgery Image',
            description: 'Esta especialidad trata problemas más complejos que afectan la boca, mandíbula y cara, realizando desde extracciones de muelas del juicio hasta cirugías reconstructivas.'
        },
    ];

    return (
        <div className="flex flex-col gap-2 h-screen">
            <h1 className='text-2xl md:text-6xl font-semibold text-center my-10'>Especialidades</h1>
            <Carousel autoplay loop transition={{ duration: 2 }} className="rounded-xl w-full">
                {specialties.map((item, index) => (
                    <div key={index} className="relative h-full w-full">
                        <img
                            src={item.image}
                            alt={item.alt}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/30">
                            <div className="w-3/4 text-center md:w-2/4">
                                <Typography
                                    variant="h1"
                                    color="white"
                                    className="mb-4 text-2xl md:text-4xl lg:text-5xl">
                                    {item.text}
                                </Typography>
                                <Typography
                                    variant="lead"
                                    color="white"
                                    className="mb-12 opacity-80 text-md lg:text-xl">
                                    {item.description}
                                </Typography>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}