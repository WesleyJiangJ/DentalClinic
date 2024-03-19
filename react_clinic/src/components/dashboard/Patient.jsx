import React from "react";
import { useDisclosure } from "@nextui-org/react";
import NewPatientModal from "./NewPatientModal";
import PatientTable from "./PatientTable";

export default function Patient() {
    // const { isOpen, onOpen, onOpenChange } = useDisclosure();
    return (
        <>
            {/* <PatientTable onOpen={onOpen} /> */}
            <PatientTable />
            {/* <NewPatientModal isOpen={isOpen} onOpenChange={onOpenChange} /> */}
        </>
    );
}