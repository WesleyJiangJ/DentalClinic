import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

export default function AboutUs() {
    const doctor = [
        {
            text: 'Dra. Ana María López',
            speciality: 'Ortodoncia y estética dental',
            image: 'https://i.pravatar.cc/?img=47',
            alt: 'Odontología General Image'

        },
        {
            text: 'Dr. Carlos Alberto Pérez',
            speciality: 'Implantología y prótesis dental',
            image: 'https://i.pravatar.cc/?img=68',
            alt: 'Odontopediatría Image'
        },
        {
            text: 'Dra. Elena Fernández',
            speciality: 'Odontopediatría y prevención dental',
            image: 'https://i.pravatar.cc/?img=43',
            alt: 'Ortodoncia Image'
        },
        {
            text: 'Dr. Jorge Luis Rodríguez',
            speciality: 'Cirugía oral y maxilofacial',
            image: 'https://i.pravatar.cc/?img=13',
            alt: 'Cirugía Oral y Maxilofacial Image'
        },
        {
            text: 'Dra. Laura García',
            speciality: 'Endodoncia y odontología restauradora',
            image: 'https://i.pravatar.cc/?img=27',
            alt: 'Test I'
        },
    ]
    return (
        <>
            <h1 className='text-2xl lg:text-6xl font-semibold text-center py-10'>Nuestro Equipo</h1>
            <p className="text-center">En "Nombre de la Clínica", nos enorgullecemos de contar con un equipo de profesionales
                altamente calificados y dedicados a proporcionar la mejor atención dental. Nuestros
                especialistas combinan años de experiencia y educación continua para ofrecer tratamientos
                de vanguardia en un ambiente cálido y acogedor. Desde ortodoncia hasta endodoncia,
                cada miembro de nuestro equipo está comprometido con tu sonrisa saludable y tu bienestar.
                ¡Ven y conoce a los expertos que harán que tu visita al dentista sea una experiencia excepcional!
            </p>
            <div className='flex flex-col md:flex-row flex-auto mt-4 justify-center'>
                {doctor.map((doctors, index) => (
                    <Card
                        shadow="sm"
                        key={index}
                        className="m-2 items-center">
                        <CardBody className="overflow-visible p-0">
                            <Image
                                shadow="sm"
                                // radius="lg"
                                width="100%"
                                alt={doctors.alt}
                                className="w-full object-cover h-[500px] rounded-b-none"
                                src={doctors.image}
                            />
                        </CardBody>
                        <CardFooter className="text-small justify-between">
                            <b>{doctors.text}</b>
                            <p className="text-default-500 text-right">{doctors.speciality}</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    );
}