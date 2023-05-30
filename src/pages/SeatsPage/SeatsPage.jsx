import styled from "styled-components"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";


const BASE_URL = "https://mock-api.driven.com.br/api/v8/cineflex/"

export default function SeatsPage({ setBooking }) {

    const [seats, setSeats] = useState(undefined);
    const [footer, setFooter] = useState(undefined);
    const [movie, setMovie] = useState({});
    const [name, setName] = useState("");
    const [cpf, setCpf] = useState("");

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const promise = axios.get(`https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${id}/seats`);

        promise.then(({ data }) => {
            const selected = [];

            data.seats.forEach((seat) => {
                selected.push({ ...seat, isSelected: false });
            });
            setSeats(selected);

            setFooter({
                posterURL: data.movie.posterURL,
                title: data.movie.title,
                weekday: data.day.weekday,
                time: data.name
            });

            setMovie({
                title: data.movie.title,
                date: data.day.date,
                time: data.name
            });
        });
    }, []);

    if (seats === undefined) {
        return <>Carregando...</>;
    }

    function select(seat, i) {
        if (!seat.isAvailable) {
            alert("Esse assento não está disponível");
            return;
        }
        const temp = [...seats];

        temp[i].isSelected = !seat.isSelected;
        setSeats(temp);
    }

    function handleSubmit(e) {
        e.preventDefault();
        const idsSelected = [];
        const seatsSelected = [];

        seats.forEach((seat) => {
            if (seat.isSelected) {
                idsSelected.push(seat.id);
                seatsSelected.push(seat.name);
            }
        });

        if (idsSelected.length === 0) {
            alert("Selecione pelo menos 1 assento!");
            return;
        }

        setBooking({
            movie,
            seats: seatsSelected,
            client: { name, cpf }
        });

        const response = axios.post("https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many", {
            ids: idsSelected,
            name: name,
            cpf: cpf
        });

        response.then(() => navigate("/sucesso"));
        response.catch((err) => console.log(err.data));
    }

    return (
        <PageContainer>
            Selecione o(s) assento(s)

            <SeatsContainer>
                {seats.map((seat, i) => (
                    <SeatItem disabled={!seat.isAvailable} isSelected={seat.isSelected} key={seat.id}>
                        <span disabled={!seat.isAvailable} onClick={(() => select(seat, i))} data-test="seat">
                            {seat.name}
                        </span>
                    </SeatItem>
                ))}
            </SeatsContainer>

            <CaptionContainer>
                <CaptionItem >
                    <CaptionCircle background="#1AAE9E" border="#0E7D71" />
                    Selecionado
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle background="#C3CFD9" border="#7B8B99" />
                    Disponível
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle background="#FBE192" border="#F7C52B" />
                    Indisponível
                </CaptionItem>
            </CaptionContainer>

            <FormContainer onSubmit={handleSubmit} >
                <label htmlFor="name">Nome do Comprador:</label>
                <input 
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Digite seu nome..."
                    required
                    data-test="client-name"
                />

                <label htmlFor="cpf">CPF do Comprador:</label>
                <input 
                    id="cpf"
                    type="number"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="Digite seu CPF..."
                    required
                    data-test="client-cpf"
                />

                <button type="submit" data-test="book-seat-btn"> Reservar Assento(s) </button>

            </FormContainer>

            <FooterContainer data-test="footer">
                <div>
                    <img src={footer.posterURL} alt={footer.title} />
                </div>
                <div>
                    <p>{footer.title}</p>
                    <p>{footer.weekday} - {footer.time}</p>
                </div>
            </FooterContainer>

        </PageContainer>
    )
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    text-align: center;
    color: #293845;
    margin-top: 30px;
    padding-bottom: 120px;
    padding-top: 70px;
`
const SeatsContainer = styled.div`
    width: 330px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`
const FormContainer = styled.form`
    width: calc(100vw - 40px); 
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 20px 0;
    font-size: 18px;
    button {
        align-self: center;
    }
    input {
        width: calc(100vw - 60px);
    }
`
const CaptionContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 300px;
    justify-content: space-between;
    margin: 20px;
`
const CaptionCircle = styled.div`
    border: 1px ${({ border }) => border};       
    background-color:${({ background }) => background};  
    height: 25px;
    width: 25px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const CaptionItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
`
const SeatItem = styled.div`
    border: 1px ${({ disabled, isSelected }) => disabled ? "#F7C52B" : isSelected ? "#0E7D71" : "#7B8B99"};
    background-color: ${({ disabled, isSelected }) => disabled ? "#FBE192" : isSelected ? "#1AAE9E" : "#C3CFD9"};
    height: 25px;
    width: 25px;
    border-radius: 25px;
    font-family: 'Roboto';
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;

    &:disabled {
        border: #F7C52B;
        background-color: #FBE192;
    }
`
const FooterContainer = styled.div`
    width: 100%;
    height: 120px;
    background-color: #C3CFD9;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    position: fixed;
    bottom: 0;

    div:nth-child(1) {
        box-shadow: 0px 2px 4px 2px #0000001A;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        margin: 12px;
        img {
            width: 50px;
            height: 70px;
            padding: 8px;
        }
    }

    div:nth-child(2) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        p {
            text-align: left;
            &:nth-child(2) {
                margin-top: 10px;
            }
        }
    }
`