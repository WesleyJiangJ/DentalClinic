import { Element } from "react-scroll";
import NavBar from '../components/clinic/NavBar.jsx';
import Speciality from '../components/clinic/Speciality.jsx';
import AboutUs from "../components/clinic/AboutUs.jsx";
import ContactUs from "../components/clinic/ContactUs.jsx";
import FindUs from "../components/clinic/FindUs.jsx";
import Footer from "../components/clinic/Footer.jsx";

export default function Clinic() {
    return (
        <div className="flex flex-col">
            <NavBar />
            <Element name='Inicio' className="relative">
                <img
                    className="w-full object-cover h-auto"
                    src="../images/Main.jpeg"
                    alt="Cover Image"
                />
                <div className="absolute w-2/4 top-10 pl-1 lg:pl-10 lg:top-1/4">
                    <h1 className="text-blue-100 font-semibold text-sm lg:text-3xl">Cuidado Dental</h1>
                    <h1 className="text-white font-semibold text-sm lg:text-4xl">Expertos en cuidado dental, brindando motivos para sonreír</h1>
                </div>
            </Element>
            <div className="flex flex-col gap-2 p-5">
                <Element name='Especialidades'>
                    <Speciality />
                </Element>
                <Element name='Nosotros'>
                    <AboutUs />
                </Element>
                <Element name='Contactenos'>
                    <ContactUs />
                </Element>
                <Element name='Ubicanos'>
                    <FindUs />
                </Element>
            </div>
            <Footer />
        </div>
    )
}