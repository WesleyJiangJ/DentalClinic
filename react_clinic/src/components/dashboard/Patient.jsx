import { Button, useDisclosure } from "@nextui-org/react";
import NewPatientModal from "./NewPatientModal";

export default function Patient() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    return (
        <>
            <Button onPress={onOpen} color="primary">Open</Button>
            <NewPatientModal isOpen={isOpen} onOpenChange={onOpenChange} />
        </>
    );
}