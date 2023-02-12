import React, { useState, useEffect } from 'react';
import PokemonList from './PokemonList';
import Pagination from './Pagination';
import axios from 'axios';

function App() {
  const [pokemon, setPokemon] = useState([])
  const [currentPageUrl, setCurrentPageUrl] = useState('https://pokeapi.co/api/v2/pokemon')
  const [nextPageUrl, setNextPageUrl] = useState()
  const [prevPageUrl, setPrevPageUrl] = useState()
  const [loading,setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    let cancel
    // to set cancel to a new cancelToken any time our request runs (cancel old request)
    axios.get(currentPageUrl, {
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(response => {
      setLoading(false)
      setNextPageUrl(response.data.next)
      setPrevPageUrl(response.data.previous)
      setPokemon(response.data.results.map(poke => poke.name))
    })

    // to allow to cancel previous request in order to run new request ->
    return () => cancel()
  }, [currentPageUrl])

  function gotoNextPage() {
    setCurrentPageUrl(nextPageUrl)
  }

  function gotoPrevPage() {
    setCurrentPageUrl(prevPageUrl)
  }

  if (loading) return 'Loading...'

  return (
    <>
    <PokemonList pokemon={pokemon} />
    <Pagination 
      gotoNextPage = {nextPageUrl ? gotoNextPage : null}
      gotoPrevPage = {prevPageUrl ? gotoPrevPage : null}
    />
    </>
  );
}

export default App;
