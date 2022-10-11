import React, { useEffect, useState } from "react";

const CONSO_WATER = 15;
const WATER_PRICE = 4.3;
const DEFAULT_PERSONS_NUMBER = 1;
const DEFAULT_SHOWER_TIME = 12;

const DEFAULT_PERSONS: number[] = Array.from<number>({
  length: DEFAULT_PERSONS_NUMBER,
}).fill(DEFAULT_SHOWER_TIME);

const ShowerByYear = 365;

const PriceWaterPerLiter = (priceWaterPerCubicMeter: number) =>
  priceWaterPerCubicMeter / 1000;

type FormulaAmountOfSavingType = {
  actualShowerTimePerDayForAll: number;
  priceWaterPerCubicMeter: number;
  isWaterPriceFetched?: boolean;
  wantedTimePerShower: number;
  numberOfPersons: number;
  ConsoWaterPerMinInLiter: number;
};

const getAmountOfSaving = ({
  actualShowerTimePerDayForAll,
  priceWaterPerCubicMeter,
  wantedTimePerShower,
  numberOfPersons,
  ConsoWaterPerMinInLiter,
}: FormulaAmountOfSavingType): number => {
  return (
    (actualShowerTimePerDayForAll - wantedTimePerShower * numberOfPersons) *
    ConsoWaterPerMinInLiter *
    ShowerByYear *
    PriceWaterPerLiter(priceWaterPerCubicMeter)
  );
};

const Simulator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [locations, setLocations] = useState<string[] | undefined>([]);
  const [selectedLocation, setSelectedLocation] = useState<
    string | undefined
  >();
  const [data, setData] = useState<FormulaAmountOfSavingType>({
    wantedTimePerShower: 8,
    actualShowerTimePerDayForAll: 42,
    numberOfPersons: DEFAULT_PERSONS_NUMBER,
    priceWaterPerCubicMeter: WATER_PRICE,
    isWaterPriceFetched: undefined,
    ConsoWaterPerMinInLiter: CONSO_WATER,
  });

  const [isToggle, setIsToggle] = useState<boolean>(false);

  const [persons, setPersons] = useState<number[]>(DEFAULT_PERSONS);

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      actualShowerTimePerDayForAll: persons?.reduce?.(
        (prev, current) => prev + current,
        0
      ),
    }));
  }, [persons]);

  const getWaterPrice = () => {
    return fetch(
      `https://eau.selectra.info/token-tool/handlerequest/submit/prix_eau_commune?field-0=${selectedLocation}`
    )
      .then((res) => res.json())
      .then((res) => {
        const re = new RegExp(/<td>(?<waterPrice>.*)<\/td>\s*<\/tr>/i);
        const waterPrice = parseFloat(
          re
            ?.exec?.(res.response)
            ?.groups?.waterPrice.replace(",", ".") as string
        );

        const isNaNWaterPrice = isNaN(waterPrice);

        setData((prev) => ({
          ...prev,
          priceWaterPerCubicMeter: isNaNWaterPrice ? WATER_PRICE : waterPrice,
          isWaterPriceFetched: !isNaNWaterPrice,
        }));
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (selectedLocation) {
      getWaterPrice();
    }
  }, [selectedLocation]);

  const getLocation = (search: string) => {
    return fetch(
      `https://eau.selectra.info/token-tool/handlerequest/autocomplete/prix_eau_commune?content=${search}&index=field-0`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res?.length) {
          setIsToggle(true);
          return setLocations(res);
        }
        setLocations([]);
      })
      .catch((err) => console.error(err));
  };

  const debounce = (func: Function) => {
    let timer: number | undefined;

    return (args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(args);
      }, 1000);
    };
  };

  const updateLocation = debounce((search: string) => getLocation(search));

  return (
    <section id="simulator" className="mt-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
          <h2 className="h2 mb-4">Combien economiseriez vous ?</h2>
          <p className="text-xl text-gray-600">
            Voici un petit simulateur qui en fonction de votre foyer vous
            estimera vos économies en eau et financière
          </p>
        </div>
        <div className="pb-12 md:pb-20">
          {/* CTA box */}
          <div
            className="relative bg-gray-900 rounded py-10 px-8 md:py-16 md:px-12 shadow-2xl overflow-hidden"
            data-aos="zoom-y-out"
            // style={{ overflow: "visible" }}
          >
            {/* Background illustration */}
            <div
              className="absolute right-20 top-20 pointer-events-none hidden lg:block"
              aria-hidden="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                x="0px"
                y="0px"
                width="371.409px"
                height="371.409px"
                viewBox="0 0 371.409 371.409"
              >
                <g>
                  <path d="M270.265,149.448c-36.107-47.124-70.38-78.948-73.439-141.372c0-1.836-0.612-3.06-1.836-4.284   c-0.612-3.06-3.672-4.896-6.732-3.06c-3.672,0-6.731,2.448-6.731,6.732c-77.112,83.232-207.468,294.372-43.452,354.959   c74.052,27.541,157.896-9.791,172.584-90.576C318.614,228.396,295.969,182.497,270.265,149.448z M138.686,323.256   c-17.748-10.404-28.764-31.211-34.272-49.572c-2.448-9.18-3.672-18.359-3.06-27.539c3.672-15.912,8.568-31.213,14.076-46.512   c3.06,13.463,9.18,26.928,17.748,36.719c19.584,21.422,59.364,34.273,70.38,61.201c6.732,16.523-19.584,30.6-30.6,34.271   C161.33,335.496,148.477,329.377,138.686,323.256z" />
                </g>
              </svg>
            </div>

            <div className="relative flex flex-col lg:flex-row justify-between items-center">
              {/* CTA content */}
              <div className="text-center lg:text-left lg:max-w-xl">
                <h3 className="h3 text-white mb-2">Simulateur d'économie</h3>

                {/* CTA form */}
                <form className="w-full lg:w-auto">
                  <div className="flex flex-col justify-center max-w-xs mx-auto sm:max-w-md lg:mx-0">
                    <div className="mb-4">
                      <label
                        className="block text-gray-400 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        Combien de personnes êtes vous chez vous ?
                      </label>

                      <div className="relative">
                        <select
                          onChange={(event) => {
                            event.preventDefault();
                            const value = Number(event.currentTarget.value);
                            if (value > 0 && value <= 10) {
                              setData((prev) => ({
                                ...prev,
                                numberOfPersons: Number(event.target.value),
                              }));

                              if (value > persons.length) {
                                const newPersons = Array(
                                  value - persons.length
                                ).fill(0);

                                newPersons.unshift(...persons);
                                setPersons(newPersons);
                              } else if (value < persons.length) {
                                const newPersons = Array(value).fill(0);

                                setPersons(
                                  newPersons.map((val, i) => {
                                    if (persons[i]) {
                                      return persons[i];
                                    } else {
                                      return 0;
                                    }
                                  })
                                );
                              }
                            } else {
                              throw new Error("Doit être entre 1 et 10");
                            }
                          }}
                          className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-400 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        >
                          <option value={1}>1 personne</option>
                          <option value={2}>2 personnes</option>
                          <option value={3}>3 personnes</option>
                          <option value={4}>4 personnes</option>
                          <option value={5}>5 personnes</option>
                          <option value={6}>6 personnes</option>
                          <option value={7}>7 personnes</option>
                          <option value={8}>8 personnes</option>
                          <option value={9}>9 personnes</option>
                          <option value={10}>10 personnes</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-400 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        Combien de minutes chaque personne prend sous la douche
                        ?
                      </label>
                      <div
                        className={`grid grid-rows-${
                          data.numberOfPersons > 1 ? "2" : "1"
                        } grid-flow-col gap-5`}
                      >
                        {persons.map((person, id) => {
                          return (
                            <input
                              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="name"
                              type="number"
                              value={person.toString()}
                              onChange={(event) => {
                                const newPersons = [...persons];
                                newPersons[id] = Number(event.target.value);
                                setPersons(newPersons);
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-400 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        Entrez votre ville pour connaitre le prix du m3 d'eau ?
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className="p-2 pl-8 rounded border shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          placeholder="Code postal / ville"
                          onChange={(event) => {
                            updateLocation(event.target.value);
                          }}
                          onClick={() => {
                            setIsToggle((prev) => !prev);
                          }}
                        />
                        <svg
                          className="w-4 h-4 absolute left-2.5 top-3.5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        <div className="absolute top-10">
                          <ul
                            className="bg-white border border-gray-100 w-full mt-2 "
                            style={{ maxHeight: "300px", overflow: "scroll" }}
                          >
                            {isToggle &&
                              locations?.map((location: string) => {
                                return (
                                  <li
                                    key={location}
                                    id={location}
                                    className="pl-8 pr-2 py-1 border-b-2 border-gray-100 relative cursor-pointer hover:bg-yellow-50 hover:text-gray-900"
                                    onClick={() => {
                                      setSelectedLocation(location);
                                      setIsToggle(false);
                                    }}
                                  >
                                    <svg
                                      className="stroke-current absolute w-4 h-4 left-2 top-2"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                      />
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                    </svg>
                                    {selectedLocation?.split?.(" ")[0] ===
                                    location
                                      ? `${location}  -  ${selectedLocation}`
                                      : location}
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {data.isWaterPriceFetched === false && (
                      <div className="mb-2">
                        <label
                          className="block text-red-400 text-sm font-bold mb-3"
                          htmlFor="name"
                        >
                          Le prix au m3 n'est pas renseigné pour votre ville !
                          <br />
                        </label>
                        <p className="block text-gray-400 text-sm font-bold mb-2">
                          Vous pouvez insérer ci dessous le prix au m3 de l'eau
                          en regardant sur votre facture ou laisser la moyenne
                          national.
                        </p>

                        <input
                          className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="name"
                          type="number"
                          value={data.priceWaterPerCubicMeter.toString()}
                          min={0.5}
                          max={50}
                          onChange={(event) => {
                            event.preventDefault();
                            setData((prev) => ({
                              ...prev,
                              priceWaterPerCubicMeter: Number(
                                event.target.value
                              ),
                            }));
                          }}
                        />
                        <h6 className="h6 text-slate-300 mb-2 text-xs italic font-light">
                          * 4.3€ / m3 d'eau est le prix moyen en France.
                        </h6>
                      </div>
                    )}

                    <div className="mb-4">
                      <label
                        className="block text-gray-400 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        Combien de minutes aimeriez vous qu'une douche dure ?
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="number"
                        value={data.wantedTimePerShower.toString()}
                        onChange={(event) => {
                          event.preventDefault();
                          setData((prev) => ({
                            ...prev,
                            wantedTimePerShower: Number(event.target.value),
                          }));
                        }}
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-400 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        <a
                          href="https://www.ecoconso.be/fr/content/comment-calculer-la-consommation-en-eau-dune-douche#:~:text=Tenir%20le%20pommeau%20au%2Ddessus,pas%20jeter%20l'eau%20r%C3%A9colt%C3%A9e."
                          target="_blank"
                          rel="noopener noreferer"
                        >
                          Combien de litre d'eau votre douche consomme par
                          minute ? 🔗
                        </a>
                      </label>

                      <input
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="number"
                        value={data.ConsoWaterPerMinInLiter.toString()}
                        onChange={(event) => {
                          event.preventDefault();
                          setData((prev) => ({
                            ...prev,
                            ConsoWaterPerMinInLiter: Number(event.target.value),
                          }));
                        }}
                      />
                      <h6 className="h6 text-slate-300 mb-2 text-xs italic font-light">
                        *15 l./min est la consommation moyenne d'un pommeau
                      </h6>
                    </div>

                    {selectedLocation && data.priceWaterPerCubicMeter && (
                      <div className="mb-4">
                        <label className="block text-blue-400 text-sm uppercase font-bold mb-2">
                          {data.isWaterPriceFetched
                            ? `Prix de l'eau au m3 pour ${selectedLocation} : 
                          ${data.priceWaterPerCubicMeter} €`
                            : `Prix de l'eau au m3 : ${data.priceWaterPerCubicMeter} €`}
                        </label>
                        <label
                          className="block text-gray-400 text-sm font-bold mb-2 uppercase mt-4"
                          htmlFor="name"
                        >
                          Économies estimées :
                        </label>
                        <div className="block text-green-400 text-sm font-bold mb-2">
                          <div>
                            💰 {getAmountOfSaving(data).toFixed(2) || 0} € / an
                          </div>
                          <div>
                            💧{" "}
                            {getAmountOfSaving({
                              ...data,
                              priceWaterPerCubicMeter: 1000,
                            })}{" "}
                            Litres d'eau préservés / an
                          </div>
                        </div>
                      </div>
                    )}

                    <h6 className="h6 text-slate-300 mb-2 text-xs italic font-light">
                      * Pour une moyenne d'une douche par jour par personne.
                    </h6>
                    <h6 className="h6 text-slate-300 mb-2 text-xs italic font-light">
                      * Ce simulateur ne prend pas en compte les économies
                      électriques qui seront également faites.
                    </h6>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Simulator;
