import React from "react";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form"
import { Button, Card, CardHeader, CardBody, Textarea, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { PlusIcon, ArrowPathIcon, TrashIcon } from "@heroicons/react/24/solid"
import { sweetAlert, sweetToast } from "./Alerts";
import { deleteNote, getNote, postNote } from "../../api/apiFunctions";

export default function Notes({ backgroundColor, from, loadData, notes }) {
    const param = useParams();
    const [noteID, setNoteID] = React.useState('');
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            name: '',
            content: '',
            object_id: parseInt(param.id),
            content_type: (from === 'PT' ? 10 : from === 'PS' ? 12 : 15) // Content Type: Patient = 10, Personal = 12 & Odontogram Teeth = 15
        }
    });

    const onSubmit = async (data) => {
        sweetToast('success', 'Nota guardada');
        await postNote(data)
            .then(() => {
                loadData();
                reset();
            })
            .catch((error) => {
                console.error('Error: ', error);
            })
    }
    return (
        <Card
            radius="sm"
            className={`h-full ${backgroundColor}`}
            fullWidth>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader className="flex flex-col gap-2">
                    <div className="flex flex-row justify-between w-full">
                        <p className="font-bold text-large">Notas</p>
                        <div className="flex flex-row gap-2">
                            {noteID.length > 0 &&
                                <>
                                    <Button
                                        isIconOnly
                                        variant="light"
                                        color="danger"
                                        radius="sm"
                                        size="sm"
                                        onClick={async () => {
                                            await sweetAlert('¿Desea eliminar la nota?', '', 'warning', 'success', 'Nota Eliminada');
                                            await deleteNote(noteID)
                                                .then(() => {
                                                    loadData();
                                                    reset({ name: '', content: '', object_id: parseInt(param.id), content_type: (from === 'PT' ? 10 : from === 'PS' ? 12 : 15) });
                                                    setNoteID('');
                                                })
                                                .catch((error) => {
                                                    console.error('Error: ', error);
                                                })
                                        }}>
                                        <TrashIcon className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        isIconOnly
                                        variant="light"
                                        color="primary"
                                        radius="sm"
                                        size="sm"
                                        onClick={() => {
                                            reset({ name: '', content: '', object_id: parseInt(param.id), content_type: (from === 'PT' ? 10 : from === 'PS' ? 12 : 15) });
                                            setNoteID('');
                                        }}>
                                        <ArrowPathIcon className="w-5 h-5" />
                                    </Button>
                                </>
                            }
                            {!noteID.length > 0 &&
                                <Button
                                    isIconOnly
                                    color="primary"
                                    variant="light"
                                    radius="sm"
                                    size="sm"
                                    type="submit">
                                    <PlusIcon className="w-5 h-5" />
                                </Button>
                            }
                        </div>
                    </div>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                label='Nombre'
                                variant="underlined"
                                maxLength={64}
                                isInvalid={errors.name ? true : false}
                                isReadOnly={noteID.length > 0}
                            />
                        )}
                    />
                    <Controller
                        name="content"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                label="Nota"
                                placeholder="Escribe aquí . . ."
                                variant="underlined"
                                minRows={2}
                                maxRows={2}
                                maxLength={256}
                                isInvalid={errors.content ? true : false}
                                isReadOnly={noteID.length > 0}
                            />
                        )}
                    />
                </CardHeader>
            </form>
            <CardBody>
                <Table
                    hideHeader
                    aria-label="Notes Table"
                    radius="sm"
                    shadow="none"
                    className="h-full"
                    selectionMode="single"
                    onRowAction={async (key) => {
                        reset(...(await getNote((from === 'PT' ? 'patient' : from === 'PS' ? 'personal' : 'odontogram'), param.id, key)).data);
                        setNoteID(key);
                    }}>
                    <TableHeader>
                        <TableColumn></TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No se encontraron notas"}>
                        {notes.map((note) =>
                            <TableRow key={note.id} className="cursor-pointer">
                                {() =>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <p className="text-bold text-sm capitalize truncate max-w-xs">{note.name}</p>
                                            <p className="text-bold text-sm capitalize text-default-400 truncate max-w-xs">{note.content}</p>
                                        </div>
                                    </TableCell>
                                }
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardBody>
        </Card>
    );
}