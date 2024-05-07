import Table from "./Table"
import { getAllBudget } from '../../api/apiFunctions.js'

export default function Payments() {
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

    return (
        <>
            <Table
                value={"Pagos"}
                showDropdown={false}
                typeOfData={"Presupuestos"}
                axiosResponse={getAllBudget()}
                INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
                columns={columns}
                cellValues={cellValues}
                sortedItem={sortedItem}
            />
        </>
    )
}