import React from 'react'
import SideBar from '../components/dashboard/SideBar.jsx';
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Outlet } from 'react-router-dom';

export default function Dashboard() {
    const [isToggled, setToggled] = React.useState(true);
    const [title, setTitle] = React.useState('Dashboard');

    const toggleButton = () => {
        setToggled(!isToggled);
    };
    return (
        <>
            <div className='flex'>
                <SideBar collapsed={isToggled} onTitleChange={setTitle} />
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
                            <p className='flex items-center justify-center'>{title}</p>
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