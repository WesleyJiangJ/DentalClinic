import React from 'react'
import DashboardContext from '../components/dashboard/DashboardContext.js';
import SideBar from '../components/dashboard/SideBar.jsx';
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Outlet, useLocation } from 'react-router-dom';

export default function Dashboard() {
    const location = useLocation();
    const [isToggled, setToggled] = React.useState(true);
    const [name, setName] = React.useState('');
    const { titles } = React.useContext(DashboardContext);

    const toggleButton = () => {
        setToggled(!isToggled);
    };

    React.useEffect(() => {
        setName(localStorage.getItem('name'));
    }, [name]);

    // Function to get the title according to the url
    const getTitle = () => {
        const { pathname } = location;
        // Separates the path into segments and filters out the gaps
        const sections = pathname.split('/').filter(section => section !== '');
        if (sections.length > 1) {
            const section = sections[1];
            switch (section) {
                case 'patient':
                    return titles.patient;
                case 'appointment':
                    return titles.appointment;
                case 'budget':
                    return titles.budget;
                case 'payment':
                    return titles.payment;
                case 'personal':
                    return titles.personal;
                case 'reports':
                    return titles.reports;
                case 'settings':
                    return titles.settings;
                default:
                    return titles.dashboard;
            }
        }
        return titles.dashboard;
    };
    return (
        <>
            <div className='flex h-[100vh]'>
                <SideBar collapsed={isToggled} />
                <div className="flex flex-col w-full">
                    <div className='hidden md:flex flex-row h-16 items-center bg-[rgb(249,249,249)]'>
                        <div className='mx-4 grow hidden md:flex'>
                            <button
                                className='flex items-center'
                                onClick={toggleButton}>
                                {isToggled ? <Bars3Icon className="h-8 w-8 stroke-2" /> : <XMarkIcon className="h-8 w-8 stroke-2" />}
                            </button>
                        </div>
                        <div className="grow">
                            <p className='flex items-center justify-center'>{getTitle()}</p>
                        </div>
                        <div className="mx-4 grow">
                        <p className='flex items-center justify-end'>{name}</p>
                        </div>
                    </div>

                    <div className='h-full p-2 overflow-auto'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
}