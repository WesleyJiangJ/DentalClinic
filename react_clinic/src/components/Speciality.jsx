import { Carousel, Typography } from "@material-tailwind/react";

export default function Speciality() {
    const specialties = [
        {
            text: 'Odontología General',
            image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            alt: 'Odontología General Image'

        },
        {
            text: 'Odontopediatría',
            image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            alt: 'Odontopediatría Image'
        },
        {
            text: 'Ortodoncia',
            image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            alt: 'Ortodoncia Image'
        },
        {
            text: 'Cirugía Oral y Maxilofacial',
            image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            alt: 'Cirugía Oral y Maxilofacial Image'
        },
        {
            text: 'Test',
            image: 'https://images.unsplash.com/photo-1682686578615-39549501dd08?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            alt: 'Test I'
        },
    ]

    return (
        <>
            <h1 className='text-2xl lg:text-6xl font-semibold text-center py-10'>Especialidades</h1>
            <Carousel autoplay loop className="rounded-xl w-full h-[450px] lg:h-[750px] mt-3">
                {specialties.map((s, index) => (
                    <div key={index} className="relative h-full w-full">
                        <img
                            src={s.image}
                            alt={s.alt}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/50">
                            <div className="w-3/4 text-center md:w-2/4">
                                <Typography
                                    variant="h1"
                                    color="white"
                                    className="mb-4 text-2xl md:text-4xl lg:text-5xl"
                                >
                                    {s.text}
                                </Typography>
                                <Typography
                                    variant="lead"
                                    color="white"
                                    className="mb-12 opacity-80 text-md lg:text-xl"
                                >
                                    It is not so much for its beauty that the forest makes a claim
                                    upon men&apos;s hearts, as for that subtle something, that quality
                                    of air that emanation from old trees, that so wonderfully changes
                                    and renews a weary spirit.
                                </Typography>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </>
    );
}