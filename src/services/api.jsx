import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.headers.common['Authorization'] = 'sAwbRikZWy1X8Gq5i3i8wx8V';

const BASE_URL = "https://mock-api.driven.com.br/api/v8/cineflex/movies"

function getMovies () {
    const [movies, setMovies] = useState([]);

    useEffect ( () => {
        const promise = axios.get (`${BASE_URL}`);
        promise.then ( response => setMovies (response.data));
    }, []) ;

    return movies
}

const api = {
    getMovies, 
}

export default api;