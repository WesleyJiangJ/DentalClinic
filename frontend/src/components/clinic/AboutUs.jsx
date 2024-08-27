import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

export default function AboutUs() {
    const doctor = [
        {
            text: 'Dra. Ana María López',
            speciality: 'Ortodoncia y estética dental',
            image: 'https://img.freepik.com/free-photo/beautiful-dentist-working-dental-clinic_1157-28579.jpg?t=st=1724801317~exp=1724804917~hmac=d674602bc6ef9c9e8c04945887dc29dafdd0baff24b252d01cac73400632c877&w=1380',
            alt: 'Odontología General Image'

        },
        {
            text: 'Dr. Carlos Alberto Pérez',
            speciality: 'Implantología y prótesis dental',
            image: 'https://img.freepik.com/free-photo/stomatologist-doctor-explaining-proper-dental-hygiene-patient-holding-sample-human-jaw_158595-7678.jpg?t=st=1724801125~exp=1724804725~hmac=247c6547169bec775887a706644374087a970297d56e42199a091f510ccbe6a8&w=1380',
            alt: 'Odontopediatría Image'
        },
        {
            text: 'Dra. Elena Fernández',
            speciality: 'Odontopediatría y prevención dental',
            image: 'https://img.freepik.com/free-photo/female-dentist-white-uniform-looking-camera-posing_651396-1699.jpg?t=st=1724801286~exp=1724804886~hmac=944c1ed0ed98b036c968bdd8416e4a630e9a1eb3e2d75387282b53ec19126ff3&w=1380',
            alt: 'Ortodoncia Image'
        },
        {
            text: 'Dr. Jorge Luis Rodríguez',
            speciality: 'Cirugía oral y maxilofacial',
            image: 'https://img.freepik.com/free-photo/confident-dentist-stomatology-cabinet-with-orange-equiptment-wearing-dental-uniform-medical-specialist-oral-hygiene-wearing-lab-coat-looking-camera-dentistry-office_482257-16216.jpg?t=st=1724801346~exp=1724804946~hmac=a0a60976c537d8cca75874a037d9873fd9baffee0ed21da9b09ba52639e2c62e&w=1380',
            alt: 'Cirugía Oral y Maxilofacial Image'
        },
    ]
    return (
        <div className="flex flex-col gap-2">
            <h1 className='text-2xl md:text-6xl font-semibold text-center my-10'>Nuestro Equipo</h1>
            <p className="text-center mb-10">
                En nuestra clínica dental, nos enorgullecemos de contar con un equipo de profesionales
                altamente calificados y dedicados a proporcionar la mejor atención dental. Nuestros
                especialistas combinan años de experiencia y educación continua para ofrecer tratamientos
                de vanguardia en un ambiente cálido y acogedor. Desde ortodoncia hasta endodoncia,
                cada miembro de nuestro equipo está comprometido con tu sonrisa saludable y tu bienestar.
                ¡Ven y conoce a los expertos que harán que tu visita al dentista sea una experiencia excepcional!
            </p>
            <div className='flex flex-col md:flex-row flex-auto justify-center'>
                {doctor.map((doctors, index) => (
                    <Card
                        shadow="sm"
                        radius="sm"
                        key={index}
                        className="m-2 items-center">
                        <CardBody className="overflow-visible p-0">
                            <Image
                                shadow="sm"
                                radius="sm"
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
        </div>
    );
}