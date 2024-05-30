import React from "react";
import Table from "./Table.jsx"
import { getAllPayment } from '../../api/apiFunctions.js'

export default function Payment() {
    const [paymentData, setPaymentData] = React.useState([]);
    const INITIAL_VISIBLE_COLUMNS = ["name", "status"];
    const columns = [
        { name: "Nombres", uid: "name", sortable: true },
        { name: "Estado", uid: "status", sortable: false },
    ];

    const cellValues = [
        {
            firstColumn: "name",
            firstValue: "`${item.budget_data.name}`",
            secondValue: "`${item.budget_data.patient_data.first_name} ${item.budget_data.patient_data.middle_name} ${item.budget_data.patient_data.first_lastname} ${item.budget_data.patient_data.second_lastname}`"
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
            setPaymentData((await getAllPayment()).data);
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
                showStatusDropdown={true}
                showColumnsDropdown={false}
                showAddButton={false}
                typeOfData={"Pagos"}
                axiosResponse={paymentData}
                fetchData={fetchData}
                INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
                columns={columns}
                cellValues={cellValues}
                sortedItem={sortedItem}
            />
        </>
    )
}