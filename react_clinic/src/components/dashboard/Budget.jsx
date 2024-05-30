import React from "react";
import Table from "./Table.jsx"
import { getAllBudget } from '../../api/apiFunctions.js'

export default function Budget() {
    const [budgetData, setBudgetData] = React.useState([]);
    const INITIAL_VISIBLE_COLUMNS = ["name", "status"];
    const columns = [
        { name: "Nombres", uid: "name", sortable: true },
        { name: "Estado", uid: "status", sortable: false },
    ];

    const cellValues = [
        {
            firstColumn: "name",
            firstValue: "`${item.name}`",
            secondValue: "`${item.patient_data.first_name} ${item.patient_data.middle_name} ${item.patient_data.first_lastname} ${item.patient_data.second_lastname}`"
        },
        {
            secondColumn: "",
            firstValue: ""
        },
        {
            thirdColumn: "status",
            firstValue: "`${item.status}`"
        }
    ];
    const sortedItem = {
        first: "`${a.name}`",
        second: "`${b.name}`"
    }
    const fetchData = async () => {
        try {
            setBudgetData((await getAllBudget()).data.filter(budget => budget.status === true));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    
    React.useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Table
                value={"Pagos"}
                showStatusDropdown={false}
                showColumnsDropdown={false}
                showAddButton={true}
                typeOfData={"Presupuestos"}
                axiosResponse={budgetData}
                fetchData={fetchData}
                INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
                columns={columns}
                cellValues={cellValues}
                sortedItem={sortedItem}
            />
        </>
    )
}