import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input, Textarea, Image, Button } from "@nextui-org/react";
import { postEmail } from '../../api/apiFunctions';
import { sweetToast} from '../dashboard/Alerts'

export default function ContactUs() {
    const [loading, setLoading] = React.useState(false);
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            name: '',
            lastname: '',
            email: '',
            message: '',
        }
    });

    const onSubmit = async (data) => {
        setLoading(true);
        await postEmail(data)
            .then((response) => {
                reset();
                sweetToast(response.data.status, response.data.message);
                setLoading(false);
            })
    }
    return (
        <>
            <h1 className='text-2xl md:text-6xl font-semibold text-center py-10'>Contáctanos</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col items-center justify-center w-full gap-4">
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="text"
                                    radius="sm"
                                    label="Nombres"
                                    isInvalid={errors.name ? true : false}
                                />
                            )}
                        />
                        <Controller
                            name="lastname"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="text"
                                    radius="sm"
                                    label="Apellidos"
                                    isInvalid={errors.lastname ? true : false}
                                />
                            )}
                        />
                        <Controller
                            name="email"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="email"
                                    radius="sm"
                                    label="Email"
                                    isInvalid={errors.email ? true : false}
                                />
                            )}
                        />
                        <Controller
                            name="message"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    radius="sm"
                                    label="Mensaje"
                                    placeholder="Dínos te gustaría saber . . . "
                                    isInvalid={errors.message ? true : false}
                                />
                            )}
                        />
                        <Button
                            radius="sm"
                            size="lg"
                            color="primary"
                            fullWidth
                            isLoading={loading}
                            type='submit'>
                            Enviar
                        </Button>
                    </div>
                </form>
                <div className="hidden sm:flex items-center justify-center w-full h-full px-2">
                    <Image
                        alt="Image"
                        src="../images/ContactUs.jpeg"
                        className="object-cover object-center w-full"
                    />
                </div>
            </div>
        </>
    );
}