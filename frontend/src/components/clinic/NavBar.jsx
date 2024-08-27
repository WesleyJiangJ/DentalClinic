import React from "react";
import { Link } from 'react-scroll';
import { Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenuItem, NavbarMenu, NavbarContent, NavbarItem, Button, useDisclosure } from "@nextui-org/react";
import LoginModal from "./LoginModal";

export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const menuItems = [
        "Inicio",
        "Especialidades",
        "Nosotros",
        "Contactenos",
        "Ubicanos",
    ];

    return (
        <Navbar
            isBordered
            isBlurred={false}
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
            </NavbarContent>

            <NavbarContent className="sm:hidden pr-3" justify="center">
                <NavbarBrand>
                    <Link
                        to="Inicio"
                        smooth={true}
                        duration={500}
                        offset={-50}
                        className="font-bold text-inherit cursor-pointer">
                        Clínica Dental
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-16" justify="center">
                <NavbarBrand>
                    <Link
                        to="Inicio"
                        smooth={true}
                        duration={500}
                        offset={-50}
                        className="font-bold text-inherit cursor-pointer">
                        Clínica Dental
                    </Link>
                </NavbarBrand>
                <NavbarItem>
                    <Link
                        to="Inicio" smooth={true} duration={500} offset={-50} className="cursor-pointer">
                        Inicio
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link to="Especialidades" smooth={true} duration={500} offset={-50} className="cursor-pointer">
                        Especialidades
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link to="Nosotros" smooth={true} duration={500} offset={-50} className="cursor-pointer">
                        Nosotros
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link to="Contactenos" smooth={true} duration={500} offset={-50} className="cursor-pointer">
                        Contáctanos
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link to="Ubicanos" smooth={true} duration={500} offset={-50} className="cursor-pointer">
                        Ubícanos
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Button
                        color="primary"
                        radius="sm"
                        onPress={onOpen}>
                        Login
                    </Button>
                </NavbarItem>
            </NavbarContent>
            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            className="w-full cursor-pointer"
                            color="foreground"
                            to={item}
                            smooth={true}
                            duration={500}
                            size="lg">
                            {item}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
            <LoginModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            />
        </Navbar>
    );
}