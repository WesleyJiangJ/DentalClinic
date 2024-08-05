import { Element } from "react-scroll";
import NavBar from '../components/clinic/NavBar.jsx';
import Speciality from '../components/clinic/Speciality.jsx';
import AboutUs from "../components/clinic/AboutUs.jsx";
import ContactUs from "../components/clinic/ContactUs.jsx";
import FindUs from "../components/clinic/FindUs.jsx";
import Footer from "../components/clinic/Footer.jsx";

export default function Clinic() {
    return (
        <>
            <NavBar />
            <Element name='Inicio' className="relative">
                <img
                    className="w-full object-cover h-auto"
                    src="https://images.unsplash.com/photo-1610021685072-9906775314c9?q=80&w=3107&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Cover Image"
                />
                <div className="absolute w-2/4 top-10 pl-1 lg:pl-10 lg:top-1/4">
                    <h1 className="text-blue-100 font-semibold text-sm lg:text-3xl">Cuidado Dental</h1>
                    <h1 className="text-white font-semibold text-sm lg:text-4xl">Expertos en cuidado dental, brindando motivos para sonreír</h1>
                </div>
            </Element>

            <Element name='Especialidades' className="grid m-4">
                <Speciality />
            </Element>

            <Element name='Nosotros' className="grid m-4">
                <AboutUs />
            </Element>

            <Element name='Contactenos' className="grid m-4">
                <ContactUs />
            </Element>

            <Element name='Ubicanos' className="grid m-4">
                <FindUs />
            </Element>

            <Footer/>
        </>
    )
}