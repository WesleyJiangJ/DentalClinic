import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getAllTreatment } from "../../api/apiFunctions";
import { Button, Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, useDisclosure } from "@nextui-org/react";
import TreatmentModal from "./TreatmentModal";

export default function Settings() {
    const navigate = useNavigate();
    const param = useParams();
    const location = useLocation();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [treatment, setTreatment] = React.useState([]);

    const columns = [
        { name: "Tratamiento", uid: "treatment" },
        { name: "Precio", uid: "price" },
    ];

    React.useEffect(() => {
        loadTreatments();
    }, []);

    const loadTreatments = async () => {
        setTreatment((await getAllTreatment()).data);
    }

    const modifyURL = () => {
        const currentPath = location.pathname;
        const newPath = currentPath.split(`/treatment/${param.id}`).filter((segment) => segment !== param.id && segment !== param.slug).join('');
        navigate(newPath);
    }

    const renderCell = React.useCallback((treatments, columnKey) => {
        const cellValue = treatments[columnKey];
        switch (columnKey) {
            case "treatment":
                return (
                    <p className="text-bold text-small capitalize">{treatments.name}</p>
                );
            case "price":
                return (
                    <p className="text-bold text-small capitalize">C${treatments.price}</p>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <>
            <Tabs
                aria-label="Options"
                color="primary"
                classNames={{ cursor: "bg-[#1E1E1E] rounded-md" }}
                fullWidth>
                <Tab key="treatments" title="Tratamientos">
                    <Table
                        aria-label="Treatments Table"
                        radius="sm"
                        selectionMode="single"
                        onRowAction={(key) => {
                            navigate(`treatment/${key}`);
                            onOpenChange(true);
                        }}>
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody emptyContent={"No hubieron resultados"} items={treatment}>
                            {(item) => (
                                <TableRow key={item.id}>
                                    {(columnKey) =>
                                        <TableCell className="cursor-pointer">
                                            {renderCell(item, columnKey)}
                                        </TableCell>
                                    }
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <Button
                        className="w-full bg-[#1E1E1E] text-white mt-2"
                        radius="sm"
                        size="lg"
                        onPress={onOpen}>
                        Nuevo Tratamiento
                    </Button>
                </Tab>
            </Tabs>
            <TreatmentModal isOpen={isOpen} onOpenChange={onOpenChange} loadTreatments={loadTreatments} param={param} modifyURL={modifyURL} />
        </>
    )
}