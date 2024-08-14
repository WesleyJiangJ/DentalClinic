import React from "react";
import { Card, CardBody, CardHeader, useDisclosure } from "@nextui-org/react";
import { useParams } from "react-router-dom";
import OdontogramModal from "./OdontogramModal";
import { getOdontogram, getOdontogramTeeth, getSpecificPatient } from "../../api/apiFunctions";

// F - Facial   - Up
// L - Lingual  - Down
// D - Distral  - Left
// M - Mesial   - Right
// O - Occlusal - Center

export default function Odontogram() {
    const param = useParams();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [patient, setPatient] = React.useState([]);
    const [tooth, setTooth] = React.useState(0);
    const rightUpper = [18, 17, 16, 15, 14, 13, 12, 11];
    const rightUpperChildren = [55, 54, 53, 52, 51];
    const leftUpper = [21, 22, 23, 24, 25, 26, 27, 28];
    const leftUpperChildren = [61, 62, 63, 64, 65];
    const rightLower = [48, 47, 46, 45, 44, 43, 42, 41];
    const rightLowerChildren = [85, 84, 83, 82, 81];
    const leftLower = [31, 32, 33, 34, 35, 36, 37, 38];
    const leftLowerChildren = [71, 72, 73, 74, 75];

    const condition = [
        { key: 0, value: "Diente sano", color: "#F2F5F8" },
        { key: 1, value: "Caries", color: "#FF0000" },
        { key: 2, value: "Restauración", secondaryName: "Obturación", color: "#FFFF00" },
        { key: 3, value: "Endodoncia", color: "#00FF00" },
        { key: 4, value: "Extracción", color: "#808080" },
        { key: 5, value: "Fractura", color: "#800080" },
        { key: 6, value: "Absceso", color: "#FFA500" },
        { key: 7, value: "Retracción gingival", color: "#00FFFF" },
        { key: 8, value: "Diente impactado", color: "#008080" },
        { key: 9, value: "Supernumerario", color: "#FF1493" },
        { key: 10, value: "Maloclusión", color: "#800000" },
        { key: 11, value: "Movilidad", color: "#FF4500" },
        { key: 12, value: "Erupción dental", color: "#40E0D0" },
        { key: 13, value: "Quiste dental", color: "#DA70D6" },
        { key: 14, value: "Manchas o decoloraciones", color: "#D2691E" },
        { key: 15, value: "Hipoplasia del esmalte", color: "#B0E0E6" },
        { key: 16, value: "Sensibilidad dental", color: "#8B4513" },
        { key: 17, value: "Desgaste dental", color: "#A9A9A9" },
        { key: 18, value: "Erosión dental", color: "#008B8B" },
        { key: 19, value: "Recesión gingival", color: "#2E8B57" },
        { key: 20, value: "Hipertrofia gingival", color: "#FFD700" },
        { key: 21, value: "Lesiones mucosas orales", color: "#8A2BE2" },
        { key: 22, value: "Bruxismo", color: "#FF6347" },
        { key: 23, value: "Trastornos de la ATM", color: "#6A5ACD" },
        { key: 24, value: "Cierre de diastemas", color: "#00FF7F" },
        { key: 25, value: "Anomalías dentales", color: "#9932CC" },
        { key: 26, value: "Restos radiculares", color: "#8B0000" },
        { key: 27, value: "Amelogénesis imperfecta", color: "#FFDAB9" }
    ];

    const handleTooth = (value) => {
        setTooth(value);
    }

    const loadData = async () => {
        const res = (await getOdontogramTeeth(param.id, '')).data;
        const odontogram = (await getOdontogram(param.id, '')).data;
        setPatient({
            name: odontogram[0].patient_data.first_name + ' ' + odontogram[0].patient_data.middle_name + ' ' + odontogram[0].patient_data.first_lastname + ' ' + odontogram[0].patient_data.second_lastname,
            birthdate: odontogram[0].patient_data.birthdate
        });
        res.forEach((tooth) => {
            const pathElement = document.getElementById(`${tooth.surface}-${tooth.tooth_number}`);
            if (pathElement) {
                pathElement.setAttribute("fill", condition.find(item => item.key === tooth.status).color);
            }
        });
    }

    const deletedSurface = (id) => {
        const pathElement = document.getElementById(`${id}`);
        if (pathElement) {
            pathElement.setAttribute("fill", "#f2f5f8");
        }
    }

    const reloadData = () => {
        loadData();
    }

    React.useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            <div className='flex flex-col h-full gap-5'>
                <div className="flex flex-row gap-5">
                    <div className='flex flex-row'>
                        {
                            rightUpper.map((index) => (
                                <div className={'flex flex-col'} key={index}>
                                    <h2 className={'flex justify-center'}>{index}</h2>
                                    <svg
                                        className={'cursor-pointer transform transition-transform duration-300 hover:scale-110'}
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
                                        className={'cursor-pointer transform transition-transform duration-300 hover:scale-110'}
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
                                        className={'cursor-pointer transform transition-transform duration-300 hover:scale-110'}
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
                                        className={'cursor-pointer transform transition-transform duration-300 hover:scale-110'}
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
                                        className={'cursor-pointer transform transition-transform duration-300 hover:scale-110'}
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
                                        className={'cursor-pointer transform transition-transform duration-300 hover:scale-110'}
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
                                        className={'cursor-pointer transform transition-transform duration-300 hover:scale-110'}
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
                                        className={'cursor-pointer transform transition-transform duration-300 hover:scale-110'}
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
                <div className={'flex flex-row h-full gap-2'}>
                    <Card
                        radius="sm"
                        className="w-2/5">
                        <CardHeader>
                            <p className="font-bold text-large">Paciente</p>
                        </CardHeader>
                        <CardBody className="gap-2">
                            <p className="text-medium">{patient.name}</p>
                            <p className="text-medium">{patient.birthdate}</p>
                        </CardBody>
                    </Card>
                    <Card
                        radius="sm"
                        fullWidth>
                        <CardHeader>
                            <p className="font-bold text-large">Notas</p>
                        </CardHeader>
                        <CardBody></CardBody>
                    </Card>
                    <Card
                        radius="sm"
                        fullWidth>
                        <CardHeader>
                            <p className="font-bold text-large">Leyenda</p>
                        </CardHeader>
                        <CardBody></CardBody>
                    </Card>
                </div>
            </div>
            <OdontogramModal isOpen={isOpen} onOpenChange={onOpenChange} param={param.id} tooth={tooth} handleTooth={handleTooth} reloadData={reloadData} deletedSurface={deletedSurface} />
        </>
    );
}