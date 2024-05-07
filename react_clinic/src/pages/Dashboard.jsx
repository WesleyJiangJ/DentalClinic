import React from 'react'
import DashboardContext from '../components/dashboard/DashboardContext.js';
import SideBar from '../components/dashboard/SideBar.jsx';
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Outlet, useLocation } from 'react-router-dom';

export default function Dashboard() {
    const location = useLocation();
    const [isToggled, setToggled] = React.useState(true);
    const { titles } = React.useContext(DashboardContext);

    const toggleButton = () => {
        setToggled(!isToggled);
    };

    // Function to get the title according to the url
    const getTitle = () => {
        const { pathname } = location;
        // Separates the path into segments and filters out the gaps
        const sections = pathname.split('/').filter(section => section !== '');
        console.log(sections)
        if (sections.length > 1) {
            const section = sections[1];
            switch (section) {
                case 'patient':
                    return titles.patient;
                case 'appointment':
                    return titles.appointment;
                case 'payments':
                    return titles.payments;
                case 'personal':
                    return titles.personal;
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
            <div className='flex'>
                <SideBar collapsed={isToggled} />
                <div className="flex flex-col w-full">
                    <div className='flex flex-row h-16 items-center bg-[rgb(249,249,249)]'>
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
                            <p className='flex items-center justify-end'>Profile</p>
                        </div>
                    </div>

                    <div className='p-4'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
}