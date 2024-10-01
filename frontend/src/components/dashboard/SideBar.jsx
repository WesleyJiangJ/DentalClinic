import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { sweetAlert } from './Alerts.js';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { HomeIcon, UserIcon, CalendarDaysIcon, BanknotesIcon, UserGroupIcon, CogIcon, ArrowLeftStartOnRectangleIcon, CreditCardIcon, DocumentTextIcon } from "@heroicons/react/24/solid";

export default function SideBar({ collapsed, userGroup }) {
    const navigate = useNavigate();
    const menuItemStyles = {
        button: {
            "&:hover": {
                backgroundColor: "#1E1E1E !important",
                color: "white",
            },
        }
    }
    const getActiveStyles = ({ isActive }) => ({
        backgroundColor: isActive ? '#1E1E1E' : '',
        color: isActive ? 'white' : '',
    });

    return (
        <>
            <Sidebar
                collapsed={collapsed}
                className='h-[100vh]'
                backgroundColor='rgb(249,249,249)'>
                <div className="mb-2 p-4 flex">
                    <svg className="w-8 h-8 m-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
                    </svg>
                </div>
                <Menu menuItemStyles={menuItemStyles}>
                    <MenuItem
                        icon={<HomeIcon className="h-5 w-5" />}
                        component={<NavLink to="" end style={getActiveStyles} />}>
                        Dashboard
                    </MenuItem>
                    <MenuItem
                        icon={<UserIcon className="h-5 w-5" />}
                        component={<NavLink to="patient" style={getActiveStyles} />}>
                        Pacientes
                    </MenuItem>
                    <MenuItem
                        icon={<CalendarDaysIcon className="h-5 w-5" />}
                        component={<NavLink to="appointment" style={getActiveStyles} />}>
                        Citas
                    </MenuItem>
                    <SubMenu label="Pagos" icon={<BanknotesIcon className="h-5 w-5" />}>
                        <MenuItem
                            icon={<CreditCardIcon className="h-5 w-5" />}
                            component={<NavLink to="budget" style={getActiveStyles} />}>
                            Presupuestos
                        </MenuItem>
                        <MenuItem
                            icon={<DocumentTextIcon className="h-5 w-5" />}
                            component={<NavLink to="payment" style={getActiveStyles} />}>
                            Pagos
                        </MenuItem>
                    </SubMenu>
                </Menu>
                <Menu menuItemStyles={menuItemStyles}>
                    <MenuItem
                        icon={<UserGroupIcon className="h-5 w-5" />}
                        component={<NavLink to="personal" style={getActiveStyles} />}>
                        Personal
                    </MenuItem>
                    <MenuItem
                        icon={<DocumentTextIcon className="h-5 w-5" />}
                        component={<NavLink to="reports" style={getActiveStyles} />}>
                        Reportes
                    </MenuItem>
                    <MenuItem
                        icon={<CogIcon className="h-5 w-5" />}
                        component={<NavLink to="settings" style={getActiveStyles} />}>
                        Ajustes
                    </MenuItem>
                    <MenuItem
                        icon={<ArrowLeftStartOnRectangleIcon className="h-5 w-5" />}
                        onClick={async () => {
                            await sweetAlert('¿Estás seguro que deseas cerrar sesión?', '', 'question', 'success', `Hasta luego, ${localStorage.getItem('name')}`);
                            localStorage.clear();
                            navigate('/');
                        }}>
                        Logout
                    </MenuItem>
                </Menu>
            </Sidebar>
        </>
    );
}