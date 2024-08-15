import React from "react";
import { Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Autocomplete, AutocompleteItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Textarea } from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form"
import { getAllOdontogramToothCondition, getOdontogramTeeth, odontogramSurfaceTeethDelete, postOdontogramTeeth } from "../../api/apiFunctions";
import { TrashIcon } from "@heroicons/react/24/outline"
import { sweetToast } from "./Alerts";

export default function OdontogramModal({ isOpen, onOpenChange, param, tooth, handleTooth, reloadData, deletedSurface }) {
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            tooth_number: '',
            condition: '',
            observation: ''
        }
    });
    const [toothSurface, setToothSurface] = React.useState('');
    const [color, setColor] = React.useState('#F2F5F8');
    const [lingualColor, setLingualColor] = React.useState('');
    const [facialColor, setFacialColor] = React.useState('');
    const [mesialColor, setMesialColor] = React.useState('');
    const [distralColor, setDistralColor] = React.useState('');
    const [occlusalColor, setOcclusalColor] = React.useState('');
    const [toothRes, setToothRes] = React.useState([]);
    const [condition, setCondition] = React.useState([]);

    const onSubmit = async (data) => {
        await postOdontogramTeeth({ id_odontogram: param.id, tooth_number: tooth, surface: toothSurface[0], observation: data.observation, condition: data.condition })
            .then(() => {
                loadData();
                reset();
                setToothSurface('');
                setColor('#F2F5F8');
                reloadData();
            })
            .catch((error) => console.log(error))
    }

    const loadData = async () => {
        try {
            const res = (await getOdontogramTeeth(param.id, tooth)).data;
            const conditionRes = (await getAllOdontogramToothCondition()).data;
            setToothRes(res);
            setCondition(conditionRes);

            if (res.length > 0) {
                res.forEach(element => {
                    const color = conditionRes.find(item => item.id === element.condition)?.color || '#F2F5F8';
                    if (element.surface === 'F') {
                        setFacialColor(color);
                    } else if (element.surface === 'L') {
                        setLingualColor(color);
                    } else if (element.surface === 'O') {
                        setOcclusalColor(color);
                    } else if (element.surface === 'D') {
                        setDistralColor(color);
                    } else if (element.surface === 'M') {
                        setMesialColor(color);
                    }
                });
            }
        } catch (error) {
            console.error("Error loading data", error);
        }
    };

    const deleteSurface = async (id, surface) => {
        await odontogramSurfaceTeethDelete(id)
            .then(() => {
                if (surface === 'F') {
                    setFacialColor('');
                } else if (surface === 'L') {
                    setLingualColor('');
                } else if (surface === 'O') {
                    setOcclusalColor('');
                } else if (surface === 'D') {
                    setDistralColor('');
                } else if (surface === 'M') {
                    setMesialColor('');
                }
                loadData();
                sweetToast('success', 'Hecho');
                deletedSurface(`${surface}-${tooth}`);
            })
    }

    React.useEffect(() => {
        if (tooth !== 0) {
            loadData();
        }
    }, [tooth]);

    return (
        <>
            <Modal
                backdrop="blur"
                size="5xl"
                radius="sm"
                isOpen={isOpen}
                onOpenChange={() => {
                    onOpenChange();
                    setToothSurface('');
                    setColor('#F2F5F8');
                    setLingualColor('');
                    setFacialColor('');
                    setOcclusalColor('');
                    setMesialColor('');
                    setDistralColor('');
                    handleTooth(0);
                }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Diente {tooth}</ModalHeader>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <ModalBody>
                                    <div className="flex flex-row">
                                        <div>
                                            <svg
                                                width="100%"
                                                height="100%"
                                                viewBox="0 0 249 249"
                                                version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                xmlSpace="preserve"
                                                style={{
                                                    fillRule: 'evenodd',
                                                    clipRule: 'evenodd',
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round',
                                                    strokeMiterlimit: 1.5
                                                }}>
                                                <g>
                                                    <path
                                                        id={`F-${tooth}`}
                                                        onClick={() => facialColor ? '' : setToothSurface(`Facial`)}
                                                        className="cursor-pointer duration-300 hover:scale-90 origin-top"
                                                        d="M158.262,66.487c0.789,3.501 -0.056,7.171 -2.297,9.974c-2.242,2.803 -5.636,4.435 -9.225,4.435c-13.153,0 -32.296,0 -45.449,0c-3.589,0 -6.983,-1.632 -9.224,-4.435c-2.242,-2.803 -3.087,-6.473 -2.297,-9.974c3.416,-15.151 8.689,-38.535 11.583,-51.369c1.215,-5.386 6,-9.212 11.522,-9.212c6.68,-0 15.601,-0 22.282,-0c5.522,-0 10.307,3.826 11.521,9.212c2.894,12.834 8.167,36.218 11.584,51.369Z"
                                                        fill={facialColor ? facialColor : toothSurface === "Facial" ? color : '#F2F5F8'}
                                                        stroke="#1E1E1E"
                                                    />

                                                    <path
                                                        id={`L-${tooth}`}
                                                        onClick={() => lingualColor ? '' : setToothSurface(`Lingual`)}
                                                        className="cursor-pointer duration-300 hover:scale-90 origin-bottom"
                                                        d="M158.262,181.545c0.789,-3.502 -0.056,-7.172 -2.297,-9.975c-2.242,-2.803 -5.636,-4.435 -9.225,-4.435c-13.153,0 -32.296,0 -45.449,0c-3.589,0 -6.983,1.632 -9.224,4.435c-2.242,2.803 -3.087,6.473 -2.297,9.975c3.416,15.15 8.689,38.535 11.583,51.368c1.215,5.387 6,9.213 11.522,9.213c6.68,-0 15.601,-0 22.282,-0c5.522,-0 10.307,-3.826 11.521,-9.213c2.894,-12.833 8.167,-36.218 11.584,-51.368Z"
                                                        fill={lingualColor ? lingualColor : toothSurface === "Lingual" ? color : '#F2F5F8'}
                                                        stroke="#1E1E1E"
                                                    />
                                                    <path
                                                        id={`D-${tooth}`}
                                                        onClick={() => distralColor ? '' : setToothSurface(`Distral`)}
                                                        className="cursor-pointer duration-300 hover:scale-90 origin-left"
                                                        d="M66.487,89.77c3.501,-0.79 7.171,0.055 9.974,2.297c2.803,2.241 4.435,5.635 4.435,9.224c0,13.153 0,32.296 0,45.449c0,3.589 -1.632,6.983 -4.435,9.225c-2.803,2.241 -6.473,3.086 -9.974,2.297c-15.151,-3.417 -38.535,-8.69 -51.369,-11.584c-5.386,-1.214 -9.212,-5.999 -9.212,-11.521c-0,-6.681 -0,-15.602 -0,-22.282c-0,-5.522 3.826,-10.307 9.212,-11.522c12.834,-2.894 36.218,-8.167 51.369,-11.583Z"
                                                        fill={distralColor ? distralColor : toothSurface === "Distral" ? color : '#F2F5F8'}
                                                        stroke="#1E1E1E"
                                                    />
                                                    <path
                                                        id={`M-${tooth}`}
                                                        onClick={() => mesialColor ? '' : setToothSurface(`Mesial`)}
                                                        className="cursor-pointer duration-300 hover:scale-90 origin-right"
                                                        d="M181.545,89.77c-3.502,-0.79 -7.172,0.055 -9.975,2.297c-2.803,2.241 -4.435,5.635 -4.435,9.224c0,13.153 0,32.296 0,45.449c0,3.589 1.632,6.983 4.435,9.225c2.803,2.241 6.473,3.086 9.975,2.297c15.15,-3.417 38.535,-8.69 51.368,-11.584c5.387,-1.214 9.213,-5.999 9.213,-11.521c-0,-6.681 -0,-15.602 -0,-22.282c-0,-5.522 -3.826,-10.307 -9.213,-11.522c-12.833,-2.894 -36.218,-8.167 -51.368,-11.583Z"
                                                        fill={mesialColor ? mesialColor : toothSurface === "Mesial" ? color : '#F2F5F8'}
                                                        stroke="#1E1E1E"
                                                    />
                                                    <path
                                                        id={`O-${tooth}`}
                                                        onClick={() => occlusalColor ? '' : setToothSurface(`Occlusal`)}
                                                        className="cursor-pointer duration-300 hover:scale-90 origin-center"
                                                        d="M149.612,86.52c3.156,0 6.182,1.254 8.414,3.486c2.231,2.231 3.485,5.258 3.485,8.413l0,51.193c0,3.156 -1.254,6.182 -3.485,8.414c-2.232,2.231 -5.258,3.485 -8.414,3.485l-51.193,0c-3.155,0 -6.182,-1.254 -8.413,-3.485c-2.232,-2.232 -3.486,-5.258 -3.486,-8.414l0,-51.193c0,-3.155 1.254,-6.182 3.486,-8.413c2.231,-2.232 5.258,-3.486 8.413,-3.486l51.193,0Z"
                                                        fill={occlusalColor ? occlusalColor : toothSurface === "Occlusal" ? color : '#F2F5F8'}
                                                        stroke="#1E1E1E"
                                                    />
                                                </g>
                                            </svg>
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <h1 className="text-center">{toothSurface === '' ? 'Selecciona una cara' : toothSurface}</h1>
                                            {
                                                toothSurface !== '' && (
                                                    <>
                                                        <Controller
                                                            name="condition"
                                                            control={control}
                                                            rules={{ required: true }}
                                                            render={({ field }) => (
                                                                <Autocomplete
                                                                    {...field}
                                                                    label="Seleccione una Opción"
                                                                    defaultItems={condition}
                                                                    variant="underlined"
                                                                    onSelectionChange={value => {
                                                                        field.onChange({
                                                                            target: { value }
                                                                        });
                                                                        setColor(condition.find(item => item.id === parseInt(value)).color);
                                                                    }}
                                                                    onBlur={field.onBlur}
                                                                    isInvalid={errors.condition ? true : false}>
                                                                    {(data) => <AutocompleteItem key={data.id} value={data.condition_name} startContent={<Chip style={{ backgroundColor: data.color }} variant="solid" />}>{`${data.condition_name}`}</AutocompleteItem>}
                                                                </Autocomplete>
                                                            )}>
                                                        </Controller>
                                                        <svg width="100%" height="20" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="100%" height="5" x="0" y="5" rx="1" ry="1" fill={color ? color : ''} />
                                                        </svg>
                                                        <Controller
                                                            name="observation"
                                                            control={control}
                                                            rules={{ required: false }}
                                                            render={({ field }) => (
                                                                <Textarea
                                                                    {...field}
                                                                    label='Observaciones'
                                                                    size="md"
                                                                    radius="sm"
                                                                    minRows={7}
                                                                    className="w-full mb-2"
                                                                    placeholder="Escribe aquí . . . "
                                                                />
                                                            )}>
                                                        </Controller>
                                                    </>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <Table
                                        aria-label="Table"
                                        shadow="none"
                                        fullWidth
                                        className="h-80"
                                        isHeaderSticky>
                                        <TableHeader>
                                            <TableColumn>Superficie</TableColumn>
                                            <TableColumn>Condiciones</TableColumn>
                                            <TableColumn>Observaciones</TableColumn>
                                            <TableColumn></TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            {toothRes.map((field) => (
                                                <TableRow key={field.id}>
                                                    <TableCell className="w-1/6">{field.surface === 'F' ? 'Facial' : field.surface === 'D' ? 'Distral' : field.surface === 'M' ? 'Mesial' : field.surface === 'L' ? 'Lingual' : 'Occlusal'}</TableCell>
                                                    <TableCell className="w-1/5">{condition.find(item => item.id === field.condition).condition_name}</TableCell>
                                                    <TableCell className="w-1/2">{field.observation}</TableCell>
                                                    <TableCell className="w-1/12" onClick={() => deleteSurface(field.id, field.surface)}>
                                                        <TrashIcon className="w-5 h-5 cursor-pointer" color="red" />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" radius="sm" onPress={onClose}>
                                        Cerrar
                                    </Button>
                                    <Button color="primary" radius="sm" type="submit">
                                        Guardar
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}