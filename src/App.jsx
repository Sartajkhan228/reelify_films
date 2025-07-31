import { useEffect, useState } from "react"
import Search from "./components/Search"
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount } from "./appwrite";




const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {

  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [movieList, setMovieList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("")

  useDebounce(() => setDebounceSearchTerm(searchTerm), 1000, [searchTerm])

  const fetchApi = async (query = '') => {
    setIsLoading(true)
    setErrorMessage("")

    try {

      const endPoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;


      const response = await fetch(endPoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Error getting data");

      }
      const data = await response.json()

      if (!data.results || data.results.length === 0) {
        setErrorMessage('No movies found')
        setMovieList([])
        return;
      }

      setMovieList(data.results || [])

      if (query && data.results > 0) {
        await updateSearchCount(query, data.results[0])
      }
    } catch (error) {
      console.log(error)

    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {

    fetchApi(debounceSearchTerm)
  }, [debounceSearchTerm])


  return (

    <main>
      <div className="pattern" />

      <div className="wrapper">

        <header>
          <img src="./hero-img.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>


        </header>

        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />


        <section className="all-movies">
          <h2 className="my-[40px]">All Movies</h2>
          {isLoading ? (
            <div className="mt-18 mx-auto">
              <h1>Loading...</h1>
            </div>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {
                movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))
              }
            </ul>
          )}
        </section>

      </div>
    </main>
  )
}

export default App