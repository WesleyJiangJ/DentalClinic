import React from "react";
import Table from "./Table";
import { getAllPersonal } from '../../api/apiFunctions.js'

export default function Personal() {
    const [personalData, setPersonalData] = React.useState([]);
    const INITIAL_VISIBLE_COLUMNS = ["full_name", "status"];
    const columns = [
        { name: "Nombres", uid: "full_name", sortable: true },
        { name: "Celular", uid: "phone_number", sortable: true },
        { name: "Estado", uid: "status", sortable: false },
    ];
    const cellValues = [
        {
            firstColumn: "full_name",
            firstValue: "`${item.first_name} ${item.middle_name} ${item.first_lastname} ${item.second_lastname}`",
            secondValue: "`${item.email}`"
        },
        {
            secondColum: "phone_number",
            firstValue: "`${item.phone_number}`"
        },
        {
            thirdColumn: "status",
            firstValue: "`${item.status}`"
        }
    ];
    const sortedItem = {
        first: "`${a.first_name} ${a.middle_name} ${a.first_lastname} ${a.second_lastname}`",
        second: "`${b.first_name} ${b.middle_name} ${b.first_lastname} ${b.second_lastname}`"
    }
    const fetchData = async () => {
        try {
            setPersonalData((await getAllPersonal()).data);
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
                value={"Personal"}
                showDropdown={true}
                typeOfData={"Usuarios"}
                axiosResponse={personalData}
                fetchData={fetchData}
                INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
                columns={columns}
                cellValues={cellValues}
                sortedItem={sortedItem}
            />
        </>
    );
}