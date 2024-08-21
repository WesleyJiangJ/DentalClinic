import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, CheckboxGroup, Checkbox, Textarea } from "@nextui-org/react";
import { getMedicalHistory, postMedicalHistory, putMedicalHistory } from "../../api/apiFunctions";
import { sweetAlert, sweetToast } from "./Alerts";

export default function MedicalHistory({ isOpen, onOpenChange, id_patient, reloadData }) {
    const [medicalHistoryRes, setMedicalHistoryRes] = React.useState([]);
    const [id, setID] = React.useState('');
    const [observation, setObservation] = React.useState('');
    const [record, setRecord] = React.useState({
        allergies: false,
        pathological: false,
        pharmacological: false,
        hospitalitazation: false,
        surgical: false,
        transfusion: false,
        radiotherapy: false,
        chemotherapy: false,
        habit: false,
    });
    const [prevData, setPrevData] = React.useState({});
    const antecedentesDict = [
        { label: "Alergias", value: "allergies" },
        { label: "Patológico", value: "pathological" },
        { label: "Farmacológico", value: "pharmacological" },
        { label: "Hospitalización", value: "hospitalitazation" },
        { label: "Cirugía", value: "surgical" },
        { label: "Transfusión", value: "transfusion" },
        { label: "Radioterapia", value: "radiotherapy" },
        { label: "Quimioterapia", value: "chemotherapy" },
        { label: "Hábito", value: "habit" },
    ];
    const handleRecordChange = (selectedValues) => {
        const updatedRecord = {
            allergies: false,
            pathological: false,
            pharmacological: false,
            hospitalitazation: false,
            surgical: false,
            transfusion: false,
            radiotherapy: false,
            chemotherapy: false,
            habit: false,
        };
        // Assign true to all checkboxes
        selectedValues.forEach((value) => {
            updatedRecord[value] = true;
        });
        setRecord(updatedRecord);
    };

    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = (await getMedicalHistory(id_patient)).data[0];
        if (res) {
            setID(res.id);
            setRecord({
                allergies: res.allergies,
                pathological: res.pathological,
                pharmacological: res.pharmacological,
                hospitalitazation: res.hospitalitazation,
                surgical: res.surgical,
                transfusion: res.transfusion,
                radiotherapy: res.radiotherapy,
                chemotherapy: res.chemotherapy,
                habit: res.habit,
            })
            setMedicalHistoryRes(res);
            setObservation(res.observation);
            setPrevData({ ...res });
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        const data = {
            id_patient,
            ...record,
            observation
        }
        let changes = new Set();
        for (const key in prevData) {
            if (prevData[key] !== data[key]) {
                if (key === "allergies") {
                    changes.add("alergias");
                }
                else if (key === "pathological") {
                    changes.add("patológico");
                }
                else if (key === 'pharmacological') {
                    changes.add("farmacológico");
                }
                else if (key === 'hospitalitazation') {
                    changes.add("hospitalización");
                }
                else if (key === 'surgical') {
                    changes.add("cirugía");
                }
                else if (key === 'transfusion') {
                    changes.add("transfusion");
                }
                else if (key === 'radiotherapy') {
                    changes.add("radioterapia");
                }
                else if (key === 'chemotherapy') {
                    changes.add("quimioterapia");
                }
                else if (key === 'habit') {
                    changes.add("hábito");
                }
                else if (key === 'observation') {
                    changes.add("observación");
                }
            }
        }
        if (medicalHistoryRes.length === 0) {
            await postMedicalHistory(data)
                .then(() => {
                    sweetToast('success', 'Creado');
                    loadData();
                    reloadData();
                })
        }
        else
            if (changes.size > 0 || medicalHistoryRes.length > 0) {
                await sweetAlert("¿Confirmar cambios?", `¿Deseas modificar ${Array.from(changes).join(', ')}?`, "warning", "success", "Datos Actualizados");
                await putMedicalHistory(id, data)
                    .then(() => {
                        sweetToast('success', 'Actualizado');
                        loadData();
                        reloadData();
                    });
            }
            else {
                sweetToast('warning', 'No se realizaron modificaciones');
                onOpenChange(false);
            }
    }

    return (
        <>
            <Modal
                size='5xl'
                radius="sm"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                isDismissable={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={onSubmit}>
                                <ModalHeader className="flex flex-col gap-1">Historial Médico</ModalHeader>
                                <ModalBody className="flex flex-row gap-2">
                                    <CheckboxGroup
                                        orientation="vertical"
                                        label="Antecedentes"
                                        value={Object.keys(record).filter((key) => record[key])}
                                        onChange={handleRecordChange}>
                                        {antecedentesDict.map((antecedentes) => (
                                            <Checkbox key={antecedentes.value} value={antecedentes.value}>
                                                {antecedentes.label}
                                            </Checkbox>
                                        ))}
                                    </CheckboxGroup>
                                    <Textarea
                                        label="Observaciones"
                                        placeholder="Escriba aquí . . ."
                                        radius="sm"
                                        minRows={4}
                                        maxRows={4}
                                        maxLength={256}
                                        value={observation}
                                        onChange={(e) => setObservation(e.target.value)}
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="flat" onPress={onClose} radius="sm">
                                        Cerrar
                                    </Button>
                                    <Button color="primary" type="submit" radius="sm">
                                        {medicalHistoryRes.length !== 0 ? "Actualizar" : "Guardar"}
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}