import { Input, Textarea, Image, Button } from "@nextui-org/react";

export default function ContactUs() {
    return (
        <>
            <h1 className='text-2xl lg:text-6xl font-semibold text-center py-10'>Contáctanos</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="flex flex-col items-center justify-center w-full gap-4 lg:gap-4 px-1" id="hola">
                        <Input type="text" label="Nombres" />
                        <Input type="text" label="Apellidos" />
                        <Input type="email" label="Email" />
                        <Textarea
                            label="Mensaje"
                            placeholder="Dínos te gustaría saber aquí . . . "
                        />
                        <Button
                            radius="sm"
                            size="lg"
                            className="w-full bg-[#1E1E1E] text-white">
                            Enviar
                        </Button>
                    </div>
                <div className="hidden sm:grid place-content-center px-2">
                    <Image
                        alt="NextUI hero Image"
                        src="https://images.unsplash.com/photo-1623650430273-dbd48d9986c0?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        className="object-cover object-center w-full h-[650px]"
                    />
                </div>
            </div>
        </>
    );
}