import React from "react";
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, useDisclosure, CardFooter } from "@nextui-org/react";
import { useParams, useNavigate } from "react-router-dom";
import OdontogramModal from "./OdontogramModal";
import { deleteOdontogram, getAllOdontogramToothCondition, getNotes, getOdontogram, getOdontogramTeeth } from "../../api/apiFunctions";
import { sweetAlert } from "./Alerts";
import Notes from "./Notes";

// F - Facial   - Up
// L - Lingual  - Down
// D - Distral  - Left
// M - Mesial   - Right
// O - Occlusal - Center

export default function Odontogram() {
    const param = useParams();
    const navigate = useNavigate();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [patient, setPatient] = React.useState([]);
    const [tooth, setTooth] = React.useState(0);
    const [condition, setCondition] = React.useState([]);
    const [notes, setNotes] = React.useState([]);
    const rightUpper = [18, 17, 16, 15, 14, 13, 12, 11];
    const rightUpperChildren = [55, 54, 53, 52, 51];
    const leftUpper = [21, 22, 23, 24, 25, 26, 27, 28];
    const leftUpperChildren = [61, 62, 63, 64, 65];
    const rightLower = [48, 47, 46, 45, 44, 43, 42, 41];
    const rightLowerChildren = [85, 84, 83, 82, 81];
    const leftLower = [31, 32, 33, 34, 35, 36, 37, 38];
    const leftLowerChildren = [71, 72, 73, 74, 75];

    const handleTooth = (value) => {
        setTooth(value);
    }

    const loadData = async () => {
        const res = (await getOdontogramTeeth(param.id, '')).data;
        const odontogram = (await getOdontogram(param.id, '')).data;
        const conditionRes = (await getAllOdontogramToothCondition()).data;
        setNotes((await getNotes('odontogram', param.id)).data);
        setCondition(conditionRes);
        setPatient({
            id_patient: odontogram[0].patient_data.id,
            name: odontogram[0].patient_data.first_name + ' ' + odontogram[0].patient_data.middle_name + ' ' + odontogram[0].patient_data.first_lastname + ' ' + odontogram[0].patient_data.second_lastname,
            birthdate: odontogram[0].patient_data.birthdate,
            odontogram_name: odontogram[0].name,
            date: odontogram[0].created_at
        });
        res.forEach((tooth) => {
            const pathElement = document.getElementById(`${tooth.surface}-${tooth.tooth_number}`);
            if (pathElement) {
                pathElement.setAttribute("fill", conditionRes.find(item => item.id === tooth.condition).color);
            }
        });
    }

    const deletedSurface = (id) => {
        const pathElement = document.getElementById(`${id}`);
        if (pathElement) {
            pathElement.setAttribute("fill", "#f2f5f8");
        }
    }

    const removeOdontogram = async () => {
        await sweetAlert('¿Deseas eliminar el odontograma?', '', 'question', 'success', 'Odontograma eliminado');
        await deleteOdontogram(param.id)
            .then(() => {
                navigate(`/dashboard/patient/detail/${patient.id_patient}`);
            })
    }

    const reloadData = () => {
        loadData();
    }

    React.useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            <div className="flex flex-col gap-5 items-center justify-center w-full h-full md:hidden">
                <h1 className="text-xl font-bold">Visualización no disponible en dispositivos móviles</h1>
                <p className="text-lg">Para ver el odontograma, accede desde otro dispositivo</p>
            </div>
            <div className='hidden md:flex flex-col h-full gap-5'>
                <div className="h-[60%] overflow-scroll">
                    <div className="flex flex-row gap-5">
                        <div className='flex flex-row'>
                            {
                                rightUpper.map((index) => (
                                    <div className={'flex flex-col'} key={index}>
                                        <h2 className={'flex justify-center'}>{index}</h2>
                                        <svg
                                            className={'cursor-pointer transform transition-transform duration-300 hover:scale-90'}
                                            onClick={() => {
                                                onOpen();
                                                setTooth(index);
                                            }}
                                            width="100%"
                                            height="100%"
                                            viewBox="0 0 249 249"
                                            version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                            xmlSpace="preserve"
                                            style={{
                                                fillRule: 'evenodd',
                                                clipRule: 'evenodd',
                                                strokeLinecap: 'round',
                                                strokeLinejoin: 'round',
                                                strokeMiterlimit: 1.5
                                            }}>
                                            <g>
                                                <path
                                                    id={`F-${index}`}
                                                    d="M158.262,66.487c0.789,3.501 -0.056,7.171 -2.297,9.974c-2.242,2.803 -5.636,4.435 -9.225,4.435c-13.153,0 -32.296,0 -45.449,0c-3.589,0 -6.983,-1.632 -9.224,-4.435c-2.242,-2.803 -3.087,-6.473 -2.297,-9.974c3.416,-15.151 8.689,-38.535 11.583,-51.369c1.215,-5.386 6,-9.212 11.522,-9.212c6.68,-0 15.601,-0 22.282,-0c5.522,-0 10.307,3.826 11.521,9.212c2.894,12.834 8.167,36.218 11.584,51.369Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`L-${index}`}
                                                    d="M158.262,181.545c0.789,-3.502 -0.056,-7.172 -2.297,-9.975c-2.242,-2.803 -5.636,-4.435 -9.225,-4.435c-13.153,0 -32.296,0 -45.449,0c-3.589,0 -6.983,1.632 -9.224,4.435c-2.242,2.803 -3.087,6.473 -2.297,9.975c3.416,15.15 8.689,38.535 11.583,51.368c1.215,5.387 6,9.213 11.522,9.213c6.68,-0 15.601,-0 22.282,-0c5.522,-0 10.307,-3.826 11.521,-9.213c2.894,-12.833 8.167,-36.218 11.584,-51.368Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`D-${index}`}
                                                    d="M66.487,89.77c3.501,-0.79 7.171,0.055 9.974,2.297c2.803,2.241 4.435,5.635 4.435,9.224c0,13.153 0,32.296 0,45.449c0,3.589 -1.632,6.983 -4.435,9.225c-2.803,2.241 -6.473,3.086 -9.974,2.297c-15.151,-3.417 -38.535,-8.69 -51.369,-11.584c-5.386,-1.214 -9.212,-5.999 -9.212,-11.521c-0,-6.681 -0,-15.602 -0,-22.282c-0,-5.522 3.826,-10.307 9.212,-11.522c12.834,-2.894 36.218,-8.167 51.369,-11.583Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`M-${index}`}
                                                    d="M181.545,89.77c-3.502,-0.79 -7.172,0.055 -9.975,2.297c-2.803,2.241 -4.435,5.635 -4.435,9.224c0,13.153 0,32.296 0,45.449c0,3.589 1.632,6.983 4.435,9.225c2.803,2.241 6.473,3.086 9.975,2.297c15.15,-3.417 38.535,-8.69 51.368,-11.584c5.387,-1.214 9.213,-5.999 9.213,-11.521c-0,-6.681 -0,-15.602 -0,-22.282c-0,-5.522 -3.826,-10.307 -9.213,-11.522c-12.833,-2.894 -36.218,-8.167 -51.368,-11.583Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`O-${index}`}
                                                    d="M149.612,86.52c3.156,0 6.182,1.254 8.414,3.486c2.231,2.231 3.485,5.258 3.485,8.413l0,51.193c0,3.156 -1.254,6.182 -3.485,8.414c-2.232,2.231 -5.258,3.485 -8.414,3.485l-51.193,0c-3.155,0 -6.182,-1.254 -8.413,-3.485c-2.232,-2.232 -3.486,-5.258 -3.486,-8.414l0,-51.193c0,-3.155 1.254,-6.182 3.486,-8.413c2.231,-2.232 5.258,-3.486 8.413,-3.486l51.193,0Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                            </g>
                                        </svg>
                                    </div>
                                ))
                            }
                        </div>
                        <div className='flex flex-row'>
                            {
                                leftUpper.map((index) => (
                                    <div className={'flex flex-col'} key={index}>
                                        <h2 className={'flex justify-center'}>{index}</h2>
                                        <svg
                                            className={'cursor-pointer transform transition-transform duration-300 hover:scale-90'}
                                            onClick={() => {
                                                onOpen();
                                                setTooth(index);
                                            }}
                                            width="100%"
                                            height="100%"
                                            viewBox="0 0 249 249"
                                            version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                            xmlSpace="preserve"
                                            style={{
                                                fillRule: 'evenodd',
                                                clipRule: 'evenodd',
                                                strokeLinecap: 'round',
                                                strokeLinejoin: 'round',
                                                strokeMiterlimit: 1.5
                                            }}>
                                            <g>
                                                <path
                                                    id={`F-${index}`}
                                                    d="M158.262,66.487c0.789,3.501 -0.056,7.171 -2.297,9.974c-2.242,2.803 -5.636,4.435 -9.225,4.435c-13.153,0 -32.296,0 -45.449,0c-3.589,0 -6.983,-1.632 -9.224,-4.435c-2.242,-2.803 -3.087,-6.473 -2.297,-9.974c3.416,-15.151 8.689,-38.535 11.583,-51.369c1.215,-5.386 6,-9.212 11.522,-9.212c6.68,-0 15.601,-0 22.282,-0c5.522,-0 10.307,3.826 11.521,9.212c2.894,12.834 8.167,36.218 11.584,51.369Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`L-${index}`}
                                                    d="M158.262,181.545c0.789,-3.502 -0.056,-7.172 -2.297,-9.975c-2.242,-2.803 -5.636,-4.435 -9.225,-4.435c-13.153,0 -32.296,0 -45.449,0c-3.589,0 -6.983,1.632 -9.224,4.435c-2.242,2.803 -3.087,6.473 -2.297,9.975c3.416,15.15 8.689,38.535 11.583,51.368c1.215,5.387 6,9.213 11.522,9.213c6.68,-0 15.601,-0 22.282,-0c5.522,-0 10.307,-3.826 11.521,-9.213c2.894,-12.833 8.167,-36.218 11.584,-51.368Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`D-${index}`}
                                                    d="M66.487,89.77c3.501,-0.79 7.171,0.055 9.974,2.297c2.803,2.241 4.435,5.635 4.435,9.224c0,13.153 0,32.296 0,45.449c0,3.589 -1.632,6.983 -4.435,9.225c-2.803,2.241 -6.473,3.086 -9.974,2.297c-15.151,-3.417 -38.535,-8.69 -51.369,-11.584c-5.386,-1.214 -9.212,-5.999 -9.212,-11.521c-0,-6.681 -0,-15.602 -0,-22.282c-0,-5.522 3.826,-10.307 9.212,-11.522c12.834,-2.894 36.218,-8.167 51.369,-11.583Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`M-${index}`}
                                                    d="M181.545,89.77c-3.502,-0.79 -7.172,0.055 -9.975,2.297c-2.803,2.241 -4.435,5.635 -4.435,9.224c0,13.153 0,32.296 0,45.449c0,3.589 1.632,6.983 4.435,9.225c2.803,2.241 6.473,3.086 9.975,2.297c15.15,-3.417 38.535,-8.69 51.368,-11.584c5.387,-1.214 9.213,-5.999 9.213,-11.521c-0,-6.681 -0,-15.602 -0,-22.282c-0,-5.522 -3.826,-10.307 -9.213,-11.522c-12.833,-2.894 -36.218,-8.167 -51.368,-11.583Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`O-${index}`}
                                                    d="M149.612,86.52c3.156,0 6.182,1.254 8.414,3.486c2.231,2.231 3.485,5.258 3.485,8.413l0,51.193c0,3.156 -1.254,6.182 -3.485,8.414c-2.232,2.231 -5.258,3.485 -8.414,3.485l-51.193,0c-3.155,0 -6.182,-1.254 -8.413,-3.485c-2.232,-2.232 -3.486,-5.258 -3.486,-8.414l0,-51.193c0,-3.155 1.254,-6.182 3.486,-8.413c2.231,-2.232 5.258,-3.486 8.413,-3.486l51.193,0Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                            </g>
                                        </svg>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="flex flex-row gap-5 mx-48">
                        <div className='flex flex-row'>
                            {
                                rightUpperChildren.map((index) => (
                                    <div className={'flex flex-col'} key={index}>
                                        <h2 className={'flex justify-center'}>{index}</h2>
                                        <svg
                                            className={'cursor-pointer transform transition-transform duration-300 hover:scale-90'}
                                            onClick={() => {
                                                onOpen();
                                                setTooth(index);
                                            }}
                                            width="100%"
                                            height="100%"
                                            viewBox="0 0 249 249"
                                            version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                            xmlSpace="preserve"
                                            style={{
                                                fillRule: 'evenodd',
                                                clipRule: 'evenodd',
                                                strokeLinecap: 'round',
                                                strokeLinejoin: 'round',
                                                strokeMiterlimit: 1.5
                                            }}>
                                            <g>
                                                <path
                                                    id={`F-${index}`}
                                                    d="M158.262,66.487c0.789,3.501 -0.056,7.171 -2.297,9.974c-2.242,2.803 -5.636,4.435 -9.225,4.435c-13.153,0 -32.296,0 -45.449,0c-3.589,0 -6.983,-1.632 -9.224,-4.435c-2.242,-2.803 -3.087,-6.473 -2.297,-9.974c3.416,-15.151 8.689,-38.535 11.583,-51.369c1.215,-5.386 6,-9.212 11.522,-9.212c6.68,-0 15.601,-0 22.282,-0c5.522,-0 10.307,3.826 11.521,9.212c2.894,12.834 8.167,36.218 11.584,51.369Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`L-${index}`}
                                                    d="M158.262,181.545c0.789,-3.502 -0.056,-7.172 -2.297,-9.975c-2.242,-2.803 -5.636,-4.435 -9.225,-4.435c-13.153,0 -32.296,0 -45.449,0c-3.589,0 -6.983,1.632 -9.224,4.435c-2.242,2.803 -3.087,6.473 -2.297,9.975c3.416,15.15 8.689,38.535 11.583,51.368c1.215,5.387 6,9.213 11.522,9.213c6.68,-0 15.601,-0 22.282,-0c5.522,-0 10.307,-3.826 11.521,-9.213c2.894,-12.833 8.167,-36.218 11.584,-51.368Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`D-${index}`}
                                                    d="M66.487,89.77c3.501,-0.79 7.171,0.055 9.974,2.297c2.803,2.241 4.435,5.635 4.435,9.224c0,13.153 0,32.296 0,45.449c0,3.589 -1.632,6.983 -4.435,9.225c-2.803,2.241 -6.473,3.086 -9.974,2.297c-15.151,-3.417 -38.535,-8.69 -51.369,-11.584c-5.386,-1.214 -9.212,-5.999 -9.212,-11.521c-0,-6.681 -0,-15.602 -0,-22.282c-0,-5.522 3.826,-10.307 9.212,-11.522c12.834,-2.894 36.218,-8.167 51.369,-11.583Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`M-${index}`}
                                                    d="M181.545,89.77c-3.502,-0.79 -7.172,0.055 -9.975,2.297c-2.803,2.241 -4.435,5.635 -4.435,9.224c0,13.153 0,32.296 0,45.449c0,3.589 1.632,6.983 4.435,9.225c2.803,2.241 6.473,3.086 9.975,2.297c15.15,-3.417 38.535,-8.69 51.368,-11.584c5.387,-1.214 9.213,-5.999 9.213,-11.521c-0,-6.681 -0,-15.602 -0,-22.282c-0,-5.522 -3.826,-10.307 -9.213,-11.522c-12.833,-2.894 -36.218,-8.167 -51.368,-11.583Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`O-${index}`}
                                                    d="M149.612,86.52c3.156,0 6.182,1.254 8.414,3.486c2.231,2.231 3.485,5.258 3.485,8.413l0,51.193c0,3.156 -1.254,6.182 -3.485,8.414c-2.232,2.231 -5.258,3.485 -8.414,3.485l-51.193,0c-3.155,0 -6.182,-1.254 -8.413,-3.485c-2.232,-2.232 -3.486,-5.258 -3.486,-8.414l0,-51.193c0,-3.155 1.254,-6.182 3.486,-8.413c2.231,-2.232 5.258,-3.486 8.413,-3.486l51.193,0Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                            </g>
                                        </svg>
                                    </div>
                                ))
                            }
                        </div>
                        <div className='flex flex-row'>
                            {
                                leftUpperChildren.map((index) => (
                                    <div className={'flex flex-col'} key={index}>
                                        <h2 className={'flex justify-center'}>{index}</h2>
                                        <svg
                                            className={'cursor-pointer transform transition-transform duration-300 hover:scale-90'}
                                            onClick={() => {
                                                onOpen();
                                                setTooth(index);
                                            }}
                                            width="100%"
                                            height="100%"
                                            viewBox="0 0 249 249"
                                            version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                            xmlSpace="preserve"
                                            style={{
                                                fillRule: 'evenodd',
                                                clipRule: 'evenodd',
                                                strokeLinecap: 'round',
                                                strokeLinejoin: 'round',
                                                strokeMiterlimit: 1.5
                                            }}>
                                            <g>
                                                <path
                                                    id={`F-${index}`}
                                                    d="M158.262,66.487c0.789,3.501 -0.056,7.171 -2.297,9.974c-2.242,2.803 -5.636,4.435 -9.225,4.435c-13.153,0 -32.296,0 -45.449,0c-3.589,0 -6.983,-1.632 -9.224,-4.435c-2.242,-2.803 -3.087,-6.473 -2.297,-9.974c3.416,-15.151 8.689,-38.535 11.583,-51.369c1.215,-5.386 6,-9.212 11.522,-9.212c6.68,-0 15.601,-0 22.282,-0c5.522,-0 10.307,3.826 11.521,9.212c2.894,12.834 8.167,36.218 11.584,51.369Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`L-${index}`}
                                                    d="M158.262,181.545c0.789,-3.502 -0.056,-7.172 -2.297,-9.975c-2.242,-2.803 -5.636,-4.435 -9.225,-4.435c-13.153,0 -32.296,0 -45.449,0c-3.589,0 -6.983,1.632 -9.224,4.435c-2.242,2.803 -3.087,6.473 -2.297,9.975c3.416,15.15 8.689,38.535 11.583,51.368c1.215,5.387 6,9.213 11.522,9.213c6.68,-0 15.601,-0 22.282,-0c5.522,-0 10.307,-3.826 11.521,-9.213c2.894,-12.833 8.167,-36.218 11.584,-51.368Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`D-${index}`}
                                                    d="M66.487,89.77c3.501,-0.79 7.171,0.055 9.974,2.297c2.803,2.241 4.435,5.635 4.435,9.224c0,13.153 0,32.296 0,45.449c0,3.589 -1.632,6.983 -4.435,9.225c-2.803,2.241 -6.473,3.086 -9.974,2.297c-15.151,-3.417 -38.535,-8.69 -51.369,-11.584c-5.386,-1.214 -9.212,-5.999 -9.212,-11.521c-0,-6.681 -0,-15.602 -0,-22.282c-0,-5.522 3.826,-10.307 9.212,-11.522c12.834,-2.894 36.218,-8.167 51.369,-11.583Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`M-${index}`}
                                                    d="M181.545,89.77c-3.502,-0.79 -7.172,0.055 -9.975,2.297c-2.803,2.241 -4.435,5.635 -4.435,9.224c0,13.153 0,32.296 0,45.449c0,3.589 1.632,6.983 4.435,9.225c2.803,2.241 6.473,3.086 9.975,2.297c15.15,-3.417 38.535,-8.69 51.368,-11.584c5.387,-1.214 9.213,-5.999 9.213,-11.521c-0,-6.681 -0,-15.602 -0,-22.282c-0,-5.522 -3.826,-10.307 -9.213,-11.522c-12.833,-2.894 -36.218,-8.167 -51.368,-11.583Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`O-${index}`}
                                                    d="M149.612,86.52c3.156,0 6.182,1.254 8.414,3.486c2.231,2.231 3.485,5.258 3.485,8.413l0,51.193c0,3.156 -1.254,6.182 -3.485,8.414c-2.232,2.231 -5.258,3.485 -8.414,3.485l-51.193,0c-3.155,0 -6.182,-1.254 -8.413,-3.485c-2.232,-2.232 -3.486,-5.258 -3.486,-8.414l0,-51.193c0,-3.155 1.254,-6.182 3.486,-8.413c2.231,-2.232 5.258,-3.486 8.413,-3.486l51.193,0Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                            </g>
                                        </svg>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="flex flex-row gap-5 mx-48">
                        <div className='flex flex-row'>
                            {
                                rightLowerChildren.map((index) => (
                                    <div className={'flex flex-col'} key={index}>
                                        <h2 className={'flex justify-center'}>{index}</h2>
                                        <svg
                                            className={'cursor-pointer transform transition-transform duration-300 hover:scale-90'}
                                            onClick={() => {
                                                onOpen();
                                                setTooth(index);
                                            }}
                                            width="100%"
                                            height="100%"
                                            viewBox="0 0 249 249"
                                            version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                            xmlSpace="preserve"
                                            style={{
                                                fillRule: 'evenodd',
                                                clipRule: 'evenodd',
                                                strokeLinecap: 'round',
                                                strokeLinejoin: 'round',
                                                strokeMiterlimit: 1.5
                                            }}>
                                            <g>
                                                <path
                                                    id={`F-${index}`}
                                                    d="M158.262,66.487c0.789,3.501 -0.056,7.171 -2.297,9.974c-2.242,2.803 -5.636,4.435 -9.225,4.435c-13.153,0 -32.296,0 -45.449,0c-3.589,0 -6.983,-1.632 -9.224,-4.435c-2.242,-2.803 -3.087,-6.473 -2.297,-9.974c3.416,-15.151 8.689,-38.535 11.583,-51.369c1.215,-5.386 6,-9.212 11.522,-9.212c6.68,-0 15.601,-0 22.282,-0c5.522,-0 10.307,3.826 11.521,9.212c2.894,12.834 8.167,36.218 11.584,51.369Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`L-${index}`}
                                                    d="M158.262,181.545c0.789,-3.502 -0.056,-7.172 -2.297,-9.975c-2.242,-2.803 -5.636,-4.435 -9.225,-4.435c-13.153,0 -32.296,0 -45.449,0c-3.589,0 -6.983,1.632 -9.224,4.435c-2.242,2.803 -3.087,6.473 -2.297,9.975c3.416,15.15 8.689,38.535 11.583,51.368c1.215,5.387 6,9.213 11.522,9.213c6.68,-0 15.601,-0 22.282,-0c5.522,-0 10.307,-3.826 11.521,-9.213c2.894,-12.833 8.167,-36.218 11.584,-51.368Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`D-${index}`}
                                                    d="M66.487,89.77c3.501,-0.79 7.171,0.055 9.974,2.297c2.803,2.241 4.435,5.635 4.435,9.224c0,13.153 0,32.296 0,45.449c0,3.589 -1.632,6.983 -4.435,9.225c-2.803,2.241 -6.473,3.086 -9.974,2.297c-15.151,-3.417 -38.535,-8.69 -51.369,-11.584c-5.386,-1.214 -9.212,-5.999 -9.212,-11.521c-0,-6.681 -0,-15.602 -0,-22.282c-0,-5.522 3.826,-10.307 9.212,-11.522c12.834,-2.894 36.218,-8.167 51.369,-11.583Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`M-${index}`}
                                                    d="M181.545,89.77c-3.502,-0.79 -7.172,0.055 -9.975,2.297c-2.803,2.241 -4.435,5.635 -4.435,9.224c0,13.153 0,32.296 0,45.449c0,3.589 1.632,6.983 4.435,9.225c2.803,2.241 6.473,3.086 9.975,2.297c15.15,-3.417 38.535,-8.69 51.368,-11.584c5.387,-1.214 9.213,-5.999 9.213,-11.521c-0,-6.681 -0,-15.602 -0,-22.282c-0,-5.522 -3.826,-10.307 -9.213,-11.522c-12.833,-2.894 -36.218,-8.167 -51.368,-11.583Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`O-${index}`}
                                                    d="M149.612,86.52c3.156,0 6.182,1.254 8.414,3.486c2.231,2.231 3.485,5.258 3.485,8.413l0,51.193c0,3.156 -1.254,6.182 -3.485,8.414c-2.232,2.231 -5.258,3.485 -8.414,3.485l-51.193,0c-3.155,0 -6.182,-1.254 -8.413,-3.485c-2.232,-2.232 -3.486,-5.258 -3.486,-8.414l0,-51.193c0,-3.155 1.254,-6.182 3.486,-8.413c2.231,-2.232 5.258,-3.486 8.413,-3.486l51.193,0Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                            </g>
                                        </svg>
                                    </div>
                                ))
                            }
                        </div>
                        <div className='flex flex-row'>
                            {
                                leftLowerChildren.map((index) => (
                                    <div className={'flex flex-col'} key={index}>
                                        <h2 className={'flex justify-center'}>{index}</h2>
                                        <svg
                                            className={'cursor-pointer transform transition-transform duration-300 hover:scale-90'}
                                            onClick={() => {
                                                onOpen();
                                                setTooth(index);
                                            }}
                                            width="100%"
                                            height="100%"
                                            viewBox="0 0 249 249"
                                            version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                            xmlSpace="preserve"
                                            style={{
                                                fillRule: 'evenodd',
                                                clipRule: 'evenodd',
                                                strokeLinecap: 'round',
                                                strokeLinejoin: 'round',
                                                strokeMiterlimit: 1.5
                                            }}>
                                            <g>
                                                <path
                                                    id={`F-${index}`}
                                                    d="M158.262,66.487c0.789,3.501 -0.056,7.171 -2.297,9.974c-2.242,2.803 -5.636,4.435 -9.225,4.435c-13.153,0 -32.296,0 -45.449,0c-3.589,0 -6.983,-1.632 -9.224,-4.435c-2.242,-2.803 -3.087,-6.473 -2.297,-9.974c3.416,-15.151 8.689,-38.535 11.583,-51.369c1.215,-5.386 6,-9.212 11.522,-9.212c6.68,-0 15.601,-0 22.282,-0c5.522,-0 10.307,3.826 11.521,9.212c2.894,12.834 8.167,36.218 11.584,51.369Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`L-${index}`}
                                                    d="M158.262,181.545c0.789,-3.502 -0.056,-7.172 -2.297,-9.975c-2.242,-2.803 -5.636,-4.435 -9.225,-4.435c-13.153,0 -32.296,0 -45.449,0c-3.589,0 -6.983,1.632 -9.224,4.435c-2.242,2.803 -3.087,6.473 -2.297,9.975c3.416,15.15 8.689,38.535 11.583,51.368c1.215,5.387 6,9.213 11.522,9.213c6.68,-0 15.601,-0 22.282,-0c5.522,-0 10.307,-3.826 11.521,-9.213c2.894,-12.833 8.167,-36.218 11.584,-51.368Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`D-${index}`}
                                                    d="M66.487,89.77c3.501,-0.79 7.171,0.055 9.974,2.297c2.803,2.241 4.435,5.635 4.435,9.224c0,13.153 0,32.296 0,45.449c0,3.589 -1.632,6.983 -4.435,9.225c-2.803,2.241 -6.473,3.086 -9.974,2.297c-15.151,-3.417 -38.535,-8.69 -51.369,-11.584c-5.386,-1.214 -9.212,-5.999 -9.212,-11.521c-0,-6.681 -0,-15.602 -0,-22.282c-0,-5.522 3.826,-10.307 9.212,-11.522c12.834,-2.894 36.218,-8.167 51.369,-11.583Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`M-${index}`}
                                                    d="M181.545,89.77c-3.502,-0.79 -7.172,0.055 -9.975,2.297c-2.803,2.241 -4.435,5.635 -4.435,9.224c0,13.153 0,32.296 0,45.449c0,3.589 1.632,6.983 4.435,9.225c2.803,2.241 6.473,3.086 9.975,2.297c15.15,-3.417 38.535,-8.69 51.368,-11.584c5.387,-1.214 9.213,-5.999 9.213,-11.521c-0,-6.681 -0,-15.602 -0,-22.282c-0,-5.522 -3.826,-10.307 -9.213,-11.522c-12.833,-2.894 -36.218,-8.167 -51.368,-11.583Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`O-${index}`}
                                                    d="M149.612,86.52c3.156,0 6.182,1.254 8.414,3.486c2.231,2.231 3.485,5.258 3.485,8.413l0,51.193c0,3.156 -1.254,6.182 -3.485,8.414c-2.232,2.231 -5.258,3.485 -8.414,3.485l-51.193,0c-3.155,0 -6.182,-1.254 -8.413,-3.485c-2.232,-2.232 -3.486,-5.258 -3.486,-8.414l0,-51.193c0,-3.155 1.254,-6.182 3.486,-8.413c2.231,-2.232 5.258,-3.486 8.413,-3.486l51.193,0Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                            </g>
                                        </svg>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="flex flex-row gap-5">
                        <div className='flex flex-row'>
                            {
                                rightLower.map((index) => (
                                    <div className={'flex flex-col'} key={index}>
                                        <h2 className={'flex justify-center'}>{index}</h2>
                                        <svg
                                            className={'cursor-pointer transform transition-transform duration-300 hover:scale-90'}
                                            onClick={() => {
                                                onOpen();
                                                setTooth(index);
                                            }}
                                            width="100%"
                                            height="100%"
                                            viewBox="0 0 249 249"
                                            version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                            xmlSpace="preserve"
                                            style={{
                                                fillRule: 'evenodd',
                                                clipRule: 'evenodd',
                                                strokeLinecap: 'round',
                                                strokeLinejoin: 'round',
                                                strokeMiterlimit: 1.5
                                            }}>
                                            <g>
                                                <path
                                                    id={`F-${index}`}
                                                    d="M158.262,66.487c0.789,3.501 -0.056,7.171 -2.297,9.974c-2.242,2.803 -5.636,4.435 -9.225,4.435c-13.153,0 -32.296,0 -45.449,0c-3.589,0 -6.983,-1.632 -9.224,-4.435c-2.242,-2.803 -3.087,-6.473 -2.297,-9.974c3.416,-15.151 8.689,-38.535 11.583,-51.369c1.215,-5.386 6,-9.212 11.522,-9.212c6.68,-0 15.601,-0 22.282,-0c5.522,-0 10.307,3.826 11.521,9.212c2.894,12.834 8.167,36.218 11.584,51.369Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`L-${index}`}
                                                    d="M158.262,181.545c0.789,-3.502 -0.056,-7.172 -2.297,-9.975c-2.242,-2.803 -5.636,-4.435 -9.225,-4.435c-13.153,0 -32.296,0 -45.449,0c-3.589,0 -6.983,1.632 -9.224,4.435c-2.242,2.803 -3.087,6.473 -2.297,9.975c3.416,15.15 8.689,38.535 11.583,51.368c1.215,5.387 6,9.213 11.522,9.213c6.68,-0 15.601,-0 22.282,-0c5.522,-0 10.307,-3.826 11.521,-9.213c2.894,-12.833 8.167,-36.218 11.584,-51.368Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`D-${index}`}
                                                    d="M66.487,89.77c3.501,-0.79 7.171,0.055 9.974,2.297c2.803,2.241 4.435,5.635 4.435,9.224c0,13.153 0,32.296 0,45.449c0,3.589 -1.632,6.983 -4.435,9.225c-2.803,2.241 -6.473,3.086 -9.974,2.297c-15.151,-3.417 -38.535,-8.69 -51.369,-11.584c-5.386,-1.214 -9.212,-5.999 -9.212,-11.521c-0,-6.681 -0,-15.602 -0,-22.282c-0,-5.522 3.826,-10.307 9.212,-11.522c12.834,-2.894 36.218,-8.167 51.369,-11.583Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`M-${index}`}
                                                    d="M181.545,89.77c-3.502,-0.79 -7.172,0.055 -9.975,2.297c-2.803,2.241 -4.435,5.635 -4.435,9.224c0,13.153 0,32.296 0,45.449c0,3.589 1.632,6.983 4.435,9.225c2.803,2.241 6.473,3.086 9.975,2.297c15.15,-3.417 38.535,-8.69 51.368,-11.584c5.387,-1.214 9.213,-5.999 9.213,-11.521c-0,-6.681 -0,-15.602 -0,-22.282c-0,-5.522 -3.826,-10.307 -9.213,-11.522c-12.833,-2.894 -36.218,-8.167 -51.368,-11.583Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`O-${index}`}
                                                    d="M149.612,86.52c3.156,0 6.182,1.254 8.414,3.486c2.231,2.231 3.485,5.258 3.485,8.413l0,51.193c0,3.156 -1.254,6.182 -3.485,8.414c-2.232,2.231 -5.258,3.485 -8.414,3.485l-51.193,0c-3.155,0 -6.182,-1.254 -8.413,-3.485c-2.232,-2.232 -3.486,-5.258 -3.486,-8.414l0,-51.193c0,-3.155 1.254,-6.182 3.486,-8.413c2.231,-2.232 5.258,-3.486 8.413,-3.486l51.193,0Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                            </g>
                                        </svg>
                                    </div>
                                ))
                            }
                        </div>
                        <div className='flex flex-row'>
                            {
                                leftLower.map((index) => (
                                    <div className={'flex flex-col'} key={index}>
                                        <h2 className={'flex justify-center'}>{index}</h2>
                                        <svg
                                            className={'cursor-pointer transform transition-transform duration-300 hover:scale-90'}
                                            onClick={() => {
                                                onOpen();
                                                setTooth(index);
                                            }}
                                            width="100%"
                                            height="100%"
                                            viewBox="0 0 249 249"
                                            version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                            xmlSpace="preserve"
                                            style={{
                                                fillRule: 'evenodd',
                                                clipRule: 'evenodd',
                                                strokeLinecap: 'round',
                                                strokeLinejoin: 'round',
                                                strokeMiterlimit: 1.5
                                            }}>
                                            <g>
                                                <path
                                                    id={`F-${index}`}
                                                    d="M158.262,66.487c0.789,3.501 -0.056,7.171 -2.297,9.974c-2.242,2.803 -5.636,4.435 -9.225,4.435c-13.153,0 -32.296,0 -45.449,0c-3.589,0 -6.983,-1.632 -9.224,-4.435c-2.242,-2.803 -3.087,-6.473 -2.297,-9.974c3.416,-15.151 8.689,-38.535 11.583,-51.369c1.215,-5.386 6,-9.212 11.522,-9.212c6.68,-0 15.601,-0 22.282,-0c5.522,-0 10.307,3.826 11.521,9.212c2.894,12.834 8.167,36.218 11.584,51.369Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`L-${index}`}
                                                    d="M158.262,181.545c0.789,-3.502 -0.056,-7.172 -2.297,-9.975c-2.242,-2.803 -5.636,-4.435 -9.225,-4.435c-13.153,0 -32.296,0 -45.449,0c-3.589,0 -6.983,1.632 -9.224,4.435c-2.242,2.803 -3.087,6.473 -2.297,9.975c3.416,15.15 8.689,38.535 11.583,51.368c1.215,5.387 6,9.213 11.522,9.213c6.68,-0 15.601,-0 22.282,-0c5.522,-0 10.307,-3.826 11.521,-9.213c2.894,-12.833 8.167,-36.218 11.584,-51.368Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`D-${index}`}
                                                    d="M66.487,89.77c3.501,-0.79 7.171,0.055 9.974,2.297c2.803,2.241 4.435,5.635 4.435,9.224c0,13.153 0,32.296 0,45.449c0,3.589 -1.632,6.983 -4.435,9.225c-2.803,2.241 -6.473,3.086 -9.974,2.297c-15.151,-3.417 -38.535,-8.69 -51.369,-11.584c-5.386,-1.214 -9.212,-5.999 -9.212,-11.521c-0,-6.681 -0,-15.602 -0,-22.282c-0,-5.522 3.826,-10.307 9.212,-11.522c12.834,-2.894 36.218,-8.167 51.369,-11.583Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`M-${index}`}
                                                    d="M181.545,89.77c-3.502,-0.79 -7.172,0.055 -9.975,2.297c-2.803,2.241 -4.435,5.635 -4.435,9.224c0,13.153 0,32.296 0,45.449c0,3.589 1.632,6.983 4.435,9.225c2.803,2.241 6.473,3.086 9.975,2.297c15.15,-3.417 38.535,-8.69 51.368,-11.584c5.387,-1.214 9.213,-5.999 9.213,-11.521c-0,-6.681 -0,-15.602 -0,-22.282c-0,-5.522 -3.826,-10.307 -9.213,-11.522c-12.833,-2.894 -36.218,-8.167 -51.368,-11.583Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                                <path
                                                    id={`O-${index}`}
                                                    d="M149.612,86.52c3.156,0 6.182,1.254 8.414,3.486c2.231,2.231 3.485,5.258 3.485,8.413l0,51.193c0,3.156 -1.254,6.182 -3.485,8.414c-2.232,2.231 -5.258,3.485 -8.414,3.485l-51.193,0c-3.155,0 -6.182,-1.254 -8.413,-3.485c-2.232,-2.232 -3.486,-5.258 -3.486,-8.414l0,-51.193c0,-3.155 1.254,-6.182 3.486,-8.413c2.231,-2.232 5.258,-3.486 8.413,-3.486l51.193,0Z"
                                                    fill="#f2f5f8"
                                                    stroke="#1E1E1E"
                                                />
                                            </g>
                                        </svg>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className={'flex flex-row h-[40%] gap-2'}>
                    <div className="flex flex-col gap-2 w-2/3">
                        <Card
                            radius="sm"
                            fullWidth
                            className="h-1/2">
                            <CardHeader>
                                <p className="font-bold text-large">Información</p>
                            </CardHeader>
                            <CardBody className="gap-2">
                                <p className="text-lg font-medium">Paciente</p>
                                <p className="text-medium">{patient.name}</p>
                            </CardBody>
                        </Card>
                        <Card
                            radius="sm"
                            fullWidth
                            className="h-1/2">
                            <CardBody className="flex justify-center text-center">
                                <p className="text-lg font-medium">{patient.odontogram_name}</p>
                            </CardBody>
                            <CardFooter className="gap-2">
                                <Button color='danger' variant="flat" radius="sm" size="lg" fullWidth onClick={() => removeOdontogram()}>Eliminar</Button>
                            </CardFooter>
                        </Card>
                    </div>
                    <Notes backgroundColor={''} from={'OD'} loadData={loadData} notes={notes} />
                    <Card
                        radius="sm"
                        fullWidth>
                        <CardHeader>
                            <p className="font-bold text-large">Leyenda</p>
                        </CardHeader>
                        <CardBody>
                            <Table
                                aria-label="Table"
                                radius="sm"
                                hideHeader
                                shadow="none">
                                <TableHeader>
                                    <TableColumn>Condición</TableColumn>
                                    <TableColumn></TableColumn>
                                </TableHeader>
                                <TableBody emptyContent={"No hubieron resultados"}>
                                    {condition.map((field) => (
                                        <TableRow key={field.id}>
                                            <TableCell>{field.condition_name}</TableCell>
                                            <TableCell className="flex justify-center">
                                                <svg
                                                    width="50"
                                                    height="25"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="0" y="0" width="50" height="25" fill={field.color} rx='2' />
                                                </svg></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>
                </div>
            </div>
            <OdontogramModal isOpen={isOpen} onOpenChange={onOpenChange} param={param} tooth={tooth} handleTooth={handleTooth} reloadData={reloadData} deletedSurface={deletedSurface} />
        </>
    );
}