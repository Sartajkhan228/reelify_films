import { useEffect, useState } from "react"
import Search from "./components/Search"



const API_BASE_URL = "https://api.themoviedb.org/3"

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


  const fetchApi = async () => {

    setIsLoading(true)
    setErrorMessage("")

    try {

      const endPoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endPoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Error getting data");

      }
      const data = await response.json()
      console.log(data)

      if (data.response === "false") {
        setErrorMessage({ value: data.Error || 'failed to fetch movies' })
        setMovieList([])
        return;
      }
      console.log(data)
    } catch (error) {
      console.log(error)

    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {

    fetchApi()
  }, [])


  return (

    <main>
      <div className="pattern" />

      <div className="wrapper">

        <header>
          <img src="./hero-img.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>


        </header>

        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />




      </div>
    </main>
  )
}

export default App