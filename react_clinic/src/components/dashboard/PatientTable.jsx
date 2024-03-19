import React from "react";
import { getAllPatients } from '../../api/patient_api.js'
import NewPatientModal from "./NewPatientModal.jsx";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    Pagination,
    Select,
    SelectItem,
    Tooltip,
    useDisclosure,
} from "@nextui-org/react";
import { PlusIcon, MagnifyingGlassIcon, ChevronDownIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid'

const statusColorMap = {
    true: "success",
    false: "danger",
};

const INITIAL_VISIBLE_COLUMNS = ["full_name", "phone_number", "status", "actions"];

const columns = [
    { name: "Nombres", uid: "full_name", sortable: true },
    { name: "Celular", uid: "phone_number", sortable: true },
    { name: "Estado", uid: "status", sortable: true },
    { name: "Acciones", uid: "actions" },
];

const statusOptions = [
    { name: "Activo", uid: "true" },
    { name: "Inactivo", uid: "false" },
];

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function PatientTable() {
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "full_name",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const [users, setPatientData] = React.useState([])
    const loadPatients = async () => {
        const res = await getAllPatients();
        setPatientData(res.data);
        console.log("Loaded")
    };

    React.useEffect(() => {
        loadPatients();
    }, []);

    const updateTable = async () => {
        console.log("Updated")
        await loadPatients();
    };

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.first_name.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredUsers = filteredUsers.filter((user) =>
                Array.from(statusFilter).includes(user.status.toString()),
                console.log(statusFilter)
            );
        }

        return filteredUsers;
    }, [users, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage) == 0 ? 1 : Math.ceil(filteredItems.length / rowsPerPage);
    // console.log(pages)

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = `${a.first_name} ${a.middle_name} ${a.first_lastname} ${a.second_lastname}`;
            const second = `${b.first_name} ${b.middle_name} ${b.first_lastname} ${b.second_lastname}`;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];
        switch (columnKey) {
            case "full_name":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{user.first_name} {user.middle_name} {user.first_lastname} {user.second_lastname}</p>
                        <p className="text-bold text-tiny text-default-400">{user.email}</p>
                    </div>
                );
            case "phone_number":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">+505 {cellValue}</p>
                    </div>
                );
            case "status":
                const statusText = cellValue ? "Activo" : "Inactivo";
                return (
                    <Chip className="capitalize" color={statusColorMap[user.status]} size="sm" variant="flat">
                        {statusText}
                    </Chip>
                );
            case "actions":
                // return (
                //     <div className="relative flex justify-end items-center gap-2">
                //         <Dropdown>
                //             <DropdownTrigger>
                //                 <Button isIconOnly size="sm" variant="light">
                //                     <EllipsisVerticalIcon className="w-5 h-5" />
                //                 </Button>
                //             </DropdownTrigger>
                //             <DropdownMenu>
                //                 <DropdownItem>Ver</DropdownItem>
                //                 <DropdownItem>Editar</DropdownItem>
                //                 <DropdownItem>Eliminar</DropdownItem>
                //             </DropdownMenu>
                //         </Dropdown>
                //     </div>
                // );
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Details">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EyeIcon className="w-5 h-5" />
                            </span>
                        </Tooltip>
                        <Tooltip content="Edit user">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <PencilIcon className="w-5 h-5" />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete user">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                <TrashIcon className="w-5 h-5" />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    // const onNextPage = React.useCallback(() => {
    //     if (page < pages) {
    //         setPage(page + 1);
    //     }
    // }, [page, pages]);

    // const onPreviousPage = React.useCallback(() => {
    //     if (page > 1) {
    //         setPage(page - 1);
    //     }
    // }, [page]);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full"
                        size="sm"
                        placeholder="Buscar"
                        startContent={<MagnifyingGlassIcon className="w-5 h-5" />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button size="lg" radius="sm" endContent={<ChevronDownIcon className="w-5 h-5" />} variant="flat">
                                    Estado
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button size="lg" radius="sm" endContent={<ChevronDownIcon className="w-5 h-5" />} variant="flat">
                                    Columnas
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button onPress={onOpen} size="lg" className="bg-[#1E1E1E] text-white" radius="sm" endContent={<PlusIcon className="w-5 h-5" />}>
                            Nuevo
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Usuarios: {users.length}</span>
                    <label className="flex items-center text-default-400 text-small">
                        <Select
                            label="Filas"
                            onChange={onRowsPerPageChange}
                            defaultSelectedKeys={'5'}
                            className="w-20"
                            radius="sm"
                        >
                            <SelectItem key="5" value="5">5</SelectItem>
                            <SelectItem key="10" value="10">10</SelectItem>
                            <SelectItem key="15" value="15">15</SelectItem>
                        </Select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onRowsPerPageChange,
        users.length,
        onSearchChange,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex m-auto ">
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    page={page}
                    total={pages}
                    onChange={setPage}
                    classNames={{ cursor: "bg-[#1E1E1E] shadow-none rounded-md" }}
                />
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    return (
        <>
            <Table
                radius="sm"
                aria-label="Patient Table"
                isHeaderSticky
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    // wrapper: "max-h-[382px]",
                    wrapper: "h-[66vh]",
                }}
                selectedKeys={selectedKeys}
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            // align={column.uid === "actions" ? "center" : "start"}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={"No se encontraron pacientes"} items={sortedItems}>
                    {(item) => (
                        <TableRow key={item.email}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <NewPatientModal isOpen={isOpen} onOpenChange={onOpenChange} updateTable={updateTable} />
        </>
    );
}