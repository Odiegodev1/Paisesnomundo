import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import Logo from "../assets/Logo.svg";

function About() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);

  useEffect(() => {
    fetch(`https://restcountries.com/v3.1/alpha/${code}`)
      .then((response) => response.json())
      .then((data) => {
        const countryData = data[0];
        setCountry({
          name: countryData.translations.por?.common || countryData.name.common,
          flag: countryData.flags.svg,
          capital: countryData.capital?.[0] || "Não disponível",
          continent: countryData.region,
          population: countryData.population.toLocaleString(),
          languages: Object.values(countryData.languages || {}).join(", "),
          borders: countryData.borders || [],
        });

        if (countryData.borders) {
          fetch(`https://restcountries.com/v3.1/alpha?codes=${countryData.borders.join(",")}`)
            .then((res) => res.json())
            .then((borderData) => {
              setBorderCountries(
                borderData.map((borderCountry) => ({
                  name: borderCountry.translations.por?.common || borderCountry.name.common,
                  flag: borderCountry.flags.svg,
                  code: borderCountry.cca3,
                }))
              );
            });
        }
      })
      .catch((error) => console.error("Erro ao buscar país:", error));
  }, [code]);

  return (
    <main className="w-full h-[1100px] bg-zinc-800">
      <header className="h-14 px-56 bg-zinc-700 border-b-2 border-zinc-600 flex items-center p-8 gap-4 text-zinc-200">
        <img src={Logo} className="w-10" alt="Logo" />
        <h1 className="text-xl text-center font-bold">Países pelo Mundo</h1>
      </header>

      {country ? (
        <div className="mt-20">
          <h1 className="text-4xl font-bold text-zinc-200 text-center">{country.name}</h1>

          <section className="flex flex-col px-56 py-8">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-zinc-200 cursor-pointer"
            >
              <IoIosArrowRoundBack /> Voltar
            </button>

            <div className="flex gap-10 mt-10">
              <form className="px-10 flex flex-col gap-2 text-xl font-bold text-zinc-200">
                <label>
                  🏙️ Capital: <span className="text-md font-normal">{country.capital}</span>
                </label>
                <label>
                  🗺️ Continente: <span className="text-md font-normal">{country.continent}</span>
                </label>
                <label>
                  👨‍👩‍👧‍👦 População: <span className="text-md font-normal">{country.population}</span>
                </label>
                <label>
                  🗣️ Línguas faladas: <span className="text-md font-normal">{country.languages}</span>
                </label>
              </form>

              <img
                src={country.flag}
                alt={`Bandeira de ${country.name}`}
                className="w-1/2 mt-10 border-2 border-zinc-600 rounded-lg"
              />
            </div>

            {/* Países que fazem fronteira */}
            <div className="mt-20">
              <h1 className="text-2xl font-semibold text-zinc-200">Países que fazem fronteira</h1>
              <div className="grid grid-cols-5 gap-8 mt-10">
                {borderCountries.length > 0 ? (
                  borderCountries.map((border) => (
                    <div key={border.code} className="flex flex-col items-center">
                      <img
                        src={border.flag}
                        alt={`Bandeira de ${border.name}`}
                        className="w-24 h-16 object-cover border border-zinc-600 rounded-md"
                      />
                      <p className="text-zinc-200 font-bold">{border.name}</p>
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
