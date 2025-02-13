import { useState, useEffect } from "react";
import Logo from "../assets/Logo.svg";
import { useNavigate } from "react-router-dom";

function Home() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [sortByPopulation, setSortByPopulation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.map((country) => ({
          name: country.translations.por?.common || country.name.common,
          flag: country.flags.svg,
          code: country.cca3,
          population: country.population,
        }));

        setCountries(formattedData);
      })
      .catch((error) => console.error("Erro ao buscar países:", error));
  }, []);

  const filteredCountries = countries
    .filter((country) =>
      country.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (sortByPopulation ? b.population - a.population : 0));

  return (
    <main className="w-full h-full bg-zinc-800">
      <header className="h-14 px-56 bg-zinc-700 border-b-2 border-zinc-600 flex items-center p-8 gap-4 text-zinc-200">
        <img src={Logo} className="w-10" />
        <h1 className="text-xl text-center font-bold">Países pelo Mundo</h1>
      </header>

      <div className="px-56 mt-10 flex gap-4">
        <input
          type="text"
          placeholder="Pesquisar país..."
          className="p-2 rounded-md w-80 bg-zinc-700 text-zinc-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
       
      </div>

      <div className="grid grid-cols-5 px-56 gap-8 py-8 mt-10">
        {filteredCountries.map((country) => (
          <button
            key={country.code}
            onClick={() => navigate(`/about/${country.code}`)}
            className="flex flex-col items-center cursor-pointer"
          >
            <img
              src={country.flag}
              className="w-24 h-16 object-cover rounded-md hover:scale-110 transition-all duration-500"
            />
            <p className="text-zinc-200 font-bold text-sm">{country.name}</p>
          </button>
        ))}
      </div>
    </main>
  );
}

export default Home;
