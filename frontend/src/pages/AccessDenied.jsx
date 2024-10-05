import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function AccessDenied() {
    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen bg-primary">
            <div className="flex flex-row items-center">
                <ExclamationTriangleIcon className="w-20 h-20 text-white" />
                <h1 className="text-5xl text-white">Acceso denegado</h1>
            </div>
            <p className="text-xl text-white">No tienes permisos para acceder a esta página</p>
        </div>
    );
}