import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getAllTreatment, getAllOdontogramToothCondition, exportDatabase, importDatabase } from "../../api/apiFunctions";
import { Button, Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, useDisclosure } from "@nextui-org/react";
import { PlusIcon, ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import SettingsModal from "./SettingsModal";
import { sweetAlert, sweetToast } from "./Alerts";

export default function Settings() {
    const navigate = useNavigate();
    const param = useParams();
    const location = useLocation();
    const [isLoading, setIsLoading] = React.useState(true);
    const [isLoadingExport, setIsLoadingExport] = React.useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [treatment, setTreatment] = React.useState([]);
    const [toothCondition, setToothCondition] = React.useState([]);
    const [file, setFile] = React.useState(null);

    React.useEffect(() => {
        loadTreatments();
        modifyURL();
    }, []);

    const loadTreatments = async () => {
        const treatment = (await getAllTreatment()).data;
        const tooth = (await getAllOdontogramToothCondition()).data;
        setTreatment(treatment);
        setToothCondition(tooth);
        setIsLoading(false);
    }

    const modifyURL = () => {
        const currentPath = location.pathname;
        const newPath = currentPath.split(`/modal/${param.id}`).filter((segment) => segment !== param.id && segment !== param.slug).join('');
        navigate(newPath);
    }

    const handleImport = async () => {
        if (file) {
            await importDatabase(file)
                .then(() => {
                    loadTreatments();
                });
        } else {
            sweetToast('error', 'Por favor selecciona un archivo de respaldo');
        }
    };

    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center w-full h-full">
                    <Spinner size='lg' />
                </div>
            ) : (
                <Tabs
                    aria-label="Options"
                    color="primary"
                    radius="sm"
                    fullWidth>
                    <Tab key="treatments" title="Tratamientos">
                        <Tables
                            isOpen={isOpen}
                            onOpen={onOpen}
                            columns={[{ name: "Tratamiento", uid: "firstColumn" }, { name: "Precio", uid: "secondColumn" }]}
                            data={treatment}
                            navigate={navigate}
                            onOpenChange={onOpenChange}
                            displayValues='T'
                            loadTreatments={loadTreatments}
                            param={param}
                            modifyURL={modifyURL}
                        />
                    </Tab>
                    <Tab key="odontogram" title="Odontograma">
                        <Tables
                            isOpen={isOpen}
                            onOpen={onOpen}
                            columns={[{ name: "Condición", uid: "firstColumn" }, { name: "Color", uid: "secondColumn" }]}
                            data={toothCondition}
                            navigate={navigate}
                            onOpenChange={onOpenChange}
                            displayValues='OD'
                            loadTreatments={loadTreatments}
                            param={param}
                            modifyURL={modifyURL}
                        />
                    </Tab>
                    <Tab key="database" title="Base de Datos">
                        <div>
                            <h1 className="my-2">Exportar</h1>
                            <Button
                                color="primary"
                                size="lg"
                                radius="sm"
                                fullWidth
                                isLoading={isLoadingExport}
                                endContent={<ArrowUpTrayIcon className="w-5 h-5" />}
                                onClick={async () => {
                                    await sweetAlert('¿Deseas exportar la base de datos?', '', 'question', 'success', 'Los datos se han exportado correctamente');
                                    setIsLoadingExport(true);
                                    exportDatabase().then(() => setIsLoadingExport(false)).finally(() => setIsLoadingExport(false));
                                }}>
                                Exportar base de datos
                            </Button>
                        </div>
                        <div>
                            <h1 className="my-2">Importar</h1>
                            <div className="flex flex-row gap-2">
                                <input
                                    className="w-full bg-sidebar rounded-sm"
                                    type="file"
                                    onChange={(e) => {
                                        setFile(e.target.files[0]);
                                    }}
                                />
                                <Button
                                    color="primary"
                                    size='lg'
                                    radius="sm"
                                    isIconOnly
                                    onClick={async () => {
                                        await sweetAlert('¿Deseas restaurar la base de datos?', '', 'question', 'success', 'Los datos se han importado correctamente');
                                        setIsLoading(true);
                                        handleImport().then(() => setIsLoading(false));
                                    }}>
                                    <PlusIcon className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            )}
        </>
    )
}

function Tables({ isOpen, onOpen, columns, data, navigate, onOpenChange, displayValues, loadTreatments, param, modifyURL }) {
    return (
        <>
            <Table
                aria-label="Table"
                radius="sm"
                selectionMode="single"
                shadow="none"
                onRowAction={(key) => {
                    navigate(`modal/${key}`);
                    onOpenChange(true);
                }}>
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={"No hubieron resultados"}>
                    {data.map((field) => (
                        <TableRow key={field.id} className="cursor-pointer">
                            <TableCell>{displayValues === 'T' ? field.name : field.condition_name}</TableCell>
                            <TableCell>{displayValues === 'T' ? `C$${parseFloat(field.price).toLocaleString()}` : <p style={{ color: field.color }}>{field.color}</p>}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Button
                className="w-full mt-2"
                color="primary"
                radius="sm"
                size="lg"
                onPress={onOpen}>
                {displayValues === 'T' ? "Nuevo Tratamiento" : "Nueva Condición Dental"}
            </Button>
            <SettingsModal isOpen={isOpen} onOpenChange={onOpenChange} loadTreatments={loadTreatments} param={param} modifyURL={modifyURL} displayValues={displayValues} />
        </>
    );
}