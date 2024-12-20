import React from "react";
import { useNavigate, useParams } from 'react-router-dom'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, Chip, Pagination, Select, SelectItem, Spinner, useDisclosure } from "@nextui-org/react";
import { PlusIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import UserModal from "./UserModal.jsx";
import BudgetModal from "./BudgetModal.jsx";
import PaymentModal from "./PaymentModal.jsx"

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Tables({ value, showStatusDropdown, showColumnsDropdown, showAddButton, typeOfData, axiosResponse, fetchData, INITIAL_VISIBLE_COLUMNS, columns, statusColorMap, statusOptions, cellValues, sortedItem }) {
    const param = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(true);
    const [axiosData, setAxiosData] = React.useState([])
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState(new Set([true.toString()]));
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: cellValues[0].firstValue,
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    React.useEffect(() => {
        if (param.id) {
            modifyURL();
        }
        loadData();
    }, [axiosResponse]);

    const loadData = async () => {
        setAxiosData(axiosResponse);
        setIsLoading(false);
    };

    const updateTable = () => {
        fetchData();
    }

    const modifyURL = () => {
        const currentPath = location.pathname;
        const newPath = currentPath.split(`/detail/${param.id}`).filter((segment) => segment !== param.id && segment !== param.slug).join('');
        navigate(newPath);
    }

    const filteredItems = React.useMemo(() => {
        let filteredData = [...axiosData];

        if (hasSearchFilter) {
            filteredData = filteredData.filter((item) =>
                eval(cellValues[0].firstValue).toLowerCase().includes(filterValue.toLowerCase()) ||
                eval(cellValues[0].secondValue).toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredData = filteredData.filter((item) =>
                Array.from(statusFilter).includes(eval(cellValues[2].firstValue).toString()),
            );
        }

        return filteredData;
    }, [axiosData, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage) == 0 ? 1 : Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = eval(`${sortedItem.first}`);
            const second = eval(`${sortedItem.second}`);
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = React.useCallback((item, columnKey) => {
        const cellValue = item[columnKey];
        switch (columnKey) {
            case cellValues[0].firstColumn:
                return (
                    <div className="flex flex-col my-2">
                        <p className="text-bold text-small capitalize">{eval(`${cellValues[0].firstValue}`)}</p>
                        <p className="text-bold text-tiny text-default-500">{eval(`${cellValues[0].secondValue}`)}</p>
                    </div>
                );
            case cellValues[1].secondColumn:
                return (
                    <div className="flex flex-col my-2">
                        <p className="text-bold text-small capitalize">{eval(`${cellValues[1].firstValue}`)}</p>
                    </div>
                );
            case cellValues[2].thirdColumn:
                const statusText = cellValue ? cellValues[2].secondValue.first : cellValues[2].secondValue.second;
                return (
                    <Chip className="capitalize my-2" color={statusColorMap[cellValue]} size="sm" variant="flat">
                        {statusText}
                    </Chip>
                );
            default:
                return cellValue;
        }
    }, []);

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
                <div className={`flex justify-between items-end ${showAddButton || showStatusDropdown ? 'gap-3' : ''}`}>
                    <Input
                        isClearable
                        className="w-full"
                        size="sm"
                        label="Buscar"
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="hidden md:flex gap-3">
                        <>
                            {showStatusDropdown &&
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
                                        onSelectionChange={setStatusFilter}>
                                        {statusOptions.map((status) => (
                                            <DropdownItem key={status.uid} className="capitalize">
                                                {capitalize(status.name)}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            }
                            {showColumnsDropdown &&
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
                                        onSelectionChange={setVisibleColumns}>
                                        {columns.map((column) => (
                                            <DropdownItem key={column.uid} className="capitalize">
                                                {capitalize(column.name)}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            }
                        </>
                        {showAddButton &&
                            <Button
                                onPress={onOpen}
                                size="lg"
                                color="primary"
                                radius="sm"
                                endContent={<PlusIcon className="w-5 h-5" />}>
                                Nuevo
                            </Button>
                        }
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-500 text-small">{typeOfData}: {axiosData.length}</span>
                    <label className="flex items-center text-default-400 text-small">
                        <Select
                            label="Filas"
                            onChange={onRowsPerPageChange}
                            defaultSelectedKeys="all"
                            className="w-20"
                            radius="sm">
                            <SelectItem key="20" value="20">20</SelectItem>
                            <SelectItem key="60" value="60">60</SelectItem>
                            <SelectItem key="80" value="80">80</SelectItem>
                            <SelectItem key="100" value="100">100</SelectItem>
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
        axiosData.length,
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
                    radius="sm"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center w-full h-full">
                    <Spinner size='lg' />
                </div>
            ) : (
                <>
                    <Table
                        shadow="none"
                        radius="sm"
                        aria-label="Table"
                        isHeaderSticky
                        bottomContent={bottomContent}
                        bottomContentPlacement="outside"
                        classNames={{ wrapper: "h-[66vh]" }}
                        selectedKeys={selectedKeys}
                        sortDescriptor={sortDescriptor}
                        topContent={topContent}
                        topContentPlacement="outside"
                        onSelectionChange={setSelectedKeys}
                        onSortChange={setSortDescriptor}
                        selectionMode="single"
                        onRowAction={(key) => {
                            navigate(`detail/${key}`);
                            onOpenChange(true);
                        }}>
                        <TableHeader columns={headerColumns}>
                            {(column) => (
                                <TableColumn
                                    key={column.uid}
                                    allowsSorting={column.sortable}>
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody emptyContent={"No hubieron resultados"} items={sortedItems}>
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
                    {typeOfData === "Usuarios" &&
                        <UserModal isOpen={isOpen} onOpenChange={onOpenChange} updateTable={updateTable} value={value} />
                    }
                    {typeOfData === "Presupuestos" &&
                        <BudgetModal isOpen={isOpen} onOpenChange={onOpenChange} updateTable={updateTable} modifyURL={modifyURL} param={param} />
                    }
                    {typeOfData === "Pagos" &&
                        <PaymentModal isOpen={isOpen} onOpenChange={onOpenChange} updateTable={updateTable} modifyURL={modifyURL} param={param} />
                    }
                </>
            )}
        </>
    );
}