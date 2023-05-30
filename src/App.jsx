import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components"
import HomePage from "./pages/HomePage/HomePage"
import SeatsPage from "./pages/SeatsPage/SeatsPage"
import SessionsPage from "./pages/SessionsPage/SessionsPage"
import SuccessPage from "./pages/SuccessPage/SuccessPage"
import { useEffect, useState} from "react";
import axios from "axios";

export default function App() {

    const [booking, setBooking] = useState({});

    axios.defaults.headers.common['Authorization'] = 'sAwbRikZWy1X8Gq5i3i8wx8V';
    
    return (
        <BrowserRouter>
           <NavContainer>CINEFLEX</NavContainer>
            <Routes>
                 <Route  path= "/" element= {<HomePage />}/> 
                 <Route  path= "/sessoes/:id" element= {<SessionsPage /> }/>
                 <Route path="/assentos/:id" element={<SeatsPage setBooking={setBooking} />} />
                 <Route path="/sucesso" element={<SuccessPage  booking={booking}/>} />
           </Routes>

        </BrowserRouter>
    )
}

const NavContainer = styled.div`
    width: 100%;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #C3CFD9;
    color: #E8833A;
    font-family: 'Roboto', sans-serif;
    font-size: 34px;
    position: fixed;
    top: 0;
    a {
        text-decoration: none;
        color: #E8833A;
    }
`
