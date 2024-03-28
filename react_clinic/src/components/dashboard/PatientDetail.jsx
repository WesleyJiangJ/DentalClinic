import { Avatar, Button, Divider, Tabs, Tab, Card, CardBody, Textarea, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input } from "@nextui-org/react";
import { Typography } from "@material-tailwind/react";

export default function PatientDetail() {
    return (
        <div className="h-[88vh] overflow-scroll">
            <div className="flex flex-col md:flex-row gap-2 mb-2">
                <div className="flex flex-col bg-[#F2F5F8] p-5 rounded">
                    <Avatar src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?cs=srgb&dl=pexels-simon-robben-614810.jpg&fm=jpg" className="w-60 h-60 text-large mb-5 m-auto" />
                    <Typography className="m-auto" variant="h4">Wesley Jiang</Typography>
                    <Typography className="m-auto mb-5" variant="paragraph">wesley@gmail.com</Typography>
                    <Button
                        className="bg-[#1E1E1E] text-white"
                        radius="sm"
                        size="lg">
                        Enviar Mensaje
                    </Button>
                </div>

                <div className="flex flex-col bg-[#F2F5F8] p-5 rounded w-full">
                    <div className="flex flex-row ">
                        <div className="flex-1">
                            <p className="text-small font-bold text-foreground/80 my-4">Género</p>
                            <h3 className="font-semibold text-foreground/90 my-4">Másculino</h3>
                        </div>
                        <div className="flex-1">
                            <p className="text-small font-bold text-foreground/80 my-4">Fecha de Nacimiento</p>
                            <h3 className="font-semibold text-foreground/90 my-4">01/01/2000</h3>
                        </div>
                        <div className="flex-1">
                            <p className="text-small font-bold text-foreground/80 my-4">Celular</p>
                            <h3 className="font-semibold text-foreground/90 my-4">+505 89765121</h3>
                        </div>
                    </div>

                    <Divider className="my-5" orientation="horizontal" />

                    <div className="flex flex-row">
                        <div className="flex-1">
                            <p className="text-small font-bold text-foreground/80 my-4">Dirección</p>
                            <h3 className="font-semibold text-foreground/90 my-4">5th Avenue</h3>
                        </div>
                        <div className="flex-1">
                            <p className="text-small font-bold text-foreground/80 my-4">Ciudad</p>
                            <h3 className="font-semibold text-foreground/90 my-4">Manhattan</h3>
                        </div>
                        <div className="flex-1">
                            <p className="text-small font-bold text-foreground/80 my-4">Ocupación</p>
                            <h3 className="font-semibold text-foreground/90 my-4">Ingeniero</h3>
                        </div>
                    </div>

                    <Divider className="my-5" orientation="horizontal" />

                    <div className="flex flex-row">
                        <div className="flex-1">
                            <p className="text-small font-bold text-foreground/80 my-4">Estado</p>
                            <h3 className="font-semibold text-foreground/90 my-4">Activo</h3>
                        </div>
                        <div className="flex-1">
                            <p className="text-small font-bold text-foreground/80 my-4">Contacto de Emergencia</p>
                            <h3 className="font-semibold text-foreground/90 my-4">Lucia Rodriugez</h3>
                        </div>
                        <div className="flex-1">
                            <p className="text-small font-bold text-foreground/80 my-4">Celular</p>
                            <h3 className="font-semibold text-foreground/90 my-4">+505 22337880</h3>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col bg-[#F2F5F8] p-5 rounded w-full md:w-1/2">
                    <div className="flex justify-between">
                        <Typography className="mb-2" variant="h5">Notas</Typography>
                        <Typography className="mb-2" variant="paragraph">Ver todo</Typography>
                    </div>
                    <Textarea
                        size="md"
                        radius="sm"
                        minRows={7}
                        className="w-full mb-2"
                        placeholder="Escribe aquí . . . "
                    />
                    <Button
                        className="bg-[#1E1E1E] text-white mb-2"
                        size="lg"
                        radius="sm">
                        Guardar
                    </Button>
                    <Table
                        hideHeader
                        aria-label="Files Table"
                        radius="sm"
                        shadow="none"
                        className="h-[7rem]">
                        <TableHeader>
                            <TableColumn>Name</TableColumn>
                            <TableColumn>Actions</TableColumn>
                        </TableHeader>
                        <TableBody>
                            <TableRow key="1">
                                <TableCell>File 1</TableCell>
                                <TableCell>Ver</TableCell>
                            </TableRow>
                            <TableRow key="2">
                                <TableCell>File 2</TableCell>
                                <TableCell>Ver</TableCell>
                            </TableRow>
                            <TableRow key="3">
                                <TableCell>File 3</TableCell>
                                <TableCell>Ver</TableCell>
                            </TableRow>
                            <TableRow key="4">
                                <TableCell>File 4</TableCell>
                                <TableCell>Ver</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 h-[22.5rem]">
                <div className="flex flex-col bg-[#F2F5F8] p-5 rounded w-full">
                    <Tabs
                        aria-label="Options"
                        color="primary"
                        classNames={{ cursor: "bg-[#1E1E1E] rounded-md" }}
                        fullWidth
                        size="md">
                        <Tab key="photos" title="Citas Pendientes">
                            <Card
                                radius="sm"
                                shadow="none">
                                <CardBody>
                                    Citas Pendientes
                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key="music" title="Citas Realizadas">
                            <Card
                                radius="sm"
                                shadow="none">
                                <CardBody>
                                    Citas Realizadas
                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key="videos" title="¿Historial Médico?">
                            <Card
                                radius="sm"
                                shadow="none">
                                <CardBody>
                                    ¿Historial Médico?
                                </CardBody>
                            </Card>
                        </Tab>
                    </Tabs>
                </div>
                <div className="flex flex-col bg-[#F2F5F8] p-5 rounded w-full md:w-1/2">
                    <Typography variant="h5">Archivos</Typography>
                    <Input
                        type="file"
                        radius="sm"
                        className="mb-2"
                    />
                    <Table
                        hideHeader
                        aria-label="Files Table"
                        radius="sm"
                        shadow="none"
                        className="h-[7rem]">
                        <TableHeader>
                            <TableColumn>Name</TableColumn>
                            <TableColumn>Actions</TableColumn>
                        </TableHeader>
                        <TableBody>
                            <TableRow key="1">
                                <TableCell>File 1</TableCell>
                                <TableCell>Ver</TableCell>
                            </TableRow>
                            <TableRow key="2">
                                <TableCell>File 2</TableCell>
                                <TableCell>Ver</TableCell>
                            </TableRow>
                            <TableRow key="3">
                                <TableCell>File 3</TableCell>
                                <TableCell>Ver</TableCell>
                            </TableRow>
                            <TableRow key="4">
                                <TableCell>File 4</TableCell>
                                <TableCell>Ver</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                </div>
            </div>
        </div>
    );
}
