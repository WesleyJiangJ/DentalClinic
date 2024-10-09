import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getAllTreatment, getAllOdontogramToothCondition } from "../../api/apiFunctions";
import { Button, Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, useDisclosure } from "@nextui-org/react";
import SettingsModal from "./SettingsModal";

export default function Settings() {
    const navigate = useNavigate();
    const param = useParams();
    const location = useLocation();
    const [isLoading, setIsLoading] = React.useState(true);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [treatment, setTreatment] = React.useState([]);
    const [toothCondition, setToothCondition] = React.useState([]);

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