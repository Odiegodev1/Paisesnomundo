import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import Logo from "../assets/Logo.svg";

interface Country {
  name: string;
  flag: string;
  capital: string;
  continent: string;
  population: string;
  languages: string;
  borders: string[];
}

interface BorderCountry {
  name: string;
  flag: string;
  code: string;
}

function About() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState<Country | null>(null);
  const [borderCountries, setBorderCountries] = useState<BorderCountry[]>([]);

  useEffect(() => {
    fetch(`https://restcountries.com/v3.1/alpha/${code}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data || data.length === 0) return;

        const countryData = data[0];

        const newCountry: Country = {
          name: countryData.translations?.por?.common || countryData.name.common,
          flag: countryData.flags?.svg || "",
          capital: countryData.capital?.[0] || "Não disponível",
          continent: countryData.region || "Não disponível",
          population: countryData.population ? countryData.population.toLocaleString() : "Desconhecida",
          languages: countryData.languages ? Object.values(countryData.languages).join(", ") : "Não disponível",
          borders: countryData.borders || [],
        };

        setCountry(newCountry);

        if (newCountry.borders.length > 0) {
          fetch(`https://restcountries.com/v3.1/alpha?codes=${newCountry.borders.join(",")}`)
            .then((res) => res.json())
            .then((borderData) => {
              const formattedBorders: BorderCountry[] = borderData.map((borderCountry: any) => ({
                name: borderCountry.translations?.por?.common || borderCountry.name.common,
                flag: borderCountry.flags?.svg || "",
                code: borderCountry.cca3 || "",
              }));

              setBorderCountries(formattedBorders);
            })
            .catch((error) => console.error("Erro ao buscar países de fronteira:", error));
        }
      })
      .catch((error) => console.error("Erro ao buscar país:", error));
  }, [code]);

  return (
    <main className="w-full min-h-screen bg-zinc-800">
      <header className="h-14 px-4 md:px-20 lg:px-56 bg-zinc-700 border-b-2 border-zinc-600 flex items-center p-8 gap-4 text-zinc-200">
        <img src={Logo} className="w-10" alt="Logo" />
        <h1 className="text-lg md:text-xl text-center font-bold">Países pelo Mundo</h1>
      </header>

      {country ? (
        <div className="mt-10 px-4 md:px-20 lg:px-56">
          <h1 className="text-2xl md:text-4xl font-bold text-zinc-200 text-center">{country.name}</h1>

          <section className="flex flex-col py-8">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-zinc-200 cursor-pointer mb-6"
            >
              <IoIosArrowRoundBack /> Voltar
            </button>

            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
              <div className="flex flex-col gap-2 text-lg md:text-xl font-bold text-zinc-200">
                <p>🏙️ Capital: <span className="text-md font-normal">{country.capital}</span></p>
                <p>🗺️ Continente: <span className="text-md font-normal">{country.continent}</span></p>
                <p>👨‍👩‍👧‍👦 População: <span className="text-md font-normal">{country.population}</span></p>
                <p>🗣️ Línguas faladas: <span className="text-md font-normal">{country.languages}</span></p>
              </div>

              <img
                src={country.flag}
                alt={`Bandeira de ${country.name}`}
                className="w-full md:w-1/2 border-2 border-zinc-600 rounded-lg"
              />
            </div>

            {/* Países que fazem fronteira */}
            <div className="mt-10">
              <h1 className="text-xl md:text-2xl font-semibold text-zinc-200">Países que fazem fronteira</h1>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 mt-6 md:mt-10">
                {borderCountries.length > 0 ? (
                  borderCountries.map((border) => (
                    <div key={border.code} className="flex flex-col items-center">
                      <img
                        src={border.flag}
                        alt={`Bandeira de ${border.name}`}
                        className="w-20 h-12 md:w-24 md:h-16 object-cover border border-zinc-600 rounded-md"
                      />
                      <p className="text-zinc-200 font-bold text-sm md:text-base">{border.name}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-200">Nenhuma fronteira</p>
                )}
              </div>
            </div>
          </section>
        </div>
      ) : (
        <p className="text-center text-zinc-200 mt-20">Carregando...</p>
      )}
    </main>
  );
}

export default About;
