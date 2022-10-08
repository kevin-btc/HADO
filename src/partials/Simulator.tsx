import React, { useEffect, useState } from "react";

const CONSO_WATER = 15;
const PRICE_WATER = 4.3;
const DEFAULT_PERSONS_NUMBER = 1;
const DEFAULT_SHOWER_TIME = 12;

const DEFAULT_PERSONS: number[] = Array.from<number>({
  length: DEFAULT_PERSONS_NUMBER,
}).fill(DEFAULT_SHOWER_TIME);

const ShowerByYear = 365;

const PriceWaterPerLiter = (PriceWaterPerCubicMeter: number) =>
  PriceWaterPerCubicMeter / 1000;

type FormulaAmountOfSavingType = {
  actualShowerTimePerDayForAll: number;
  PriceWaterPerCubicMeter: number;
  wantedTimePerShower: number;
  numberOfPersons: number;
  ConsoWaterPerMinInLiter: number;
};

const getAmountOfSaving = ({
  actualShowerTimePerDayForAll,
  PriceWaterPerCubicMeter,
  wantedTimePerShower,
  numberOfPersons,
  ConsoWaterPerMinInLiter,
}: FormulaAmountOfSavingType): number => {
  return (
    (actualShowerTimePerDayForAll - wantedTimePerShower * numberOfPersons) *
    ConsoWaterPerMinInLiter *
    ShowerByYear *
    PriceWaterPerLiter(PriceWaterPerCubicMeter)
  );
};

const Simulator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [data, setData] = useState<FormulaAmountOfSavingType>({
    wantedTimePerShower: 8,
    actualShowerTimePerDayForAll: 42,
    numberOfPersons: DEFAULT_PERSONS_NUMBER,
    PriceWaterPerCubicMeter: PRICE_WATER,
    ConsoWaterPerMinInLiter: CONSO_WATER,
  });

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

  return (
    <section id="simulator" className="beta-test mt-6">
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
          >
            {/* Background illustration */}
            <div
              className="absolute right-0 bottom-0 pointer-events-none hidden lg:block"
              aria-hidden="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                id="Capa_1"
                x="0px"
                y="0px"
                width="371.409px"
                height="371.409px"
                viewBox="0 0 371.409 371.409"
                // style={{ enableBackground: "new 0 0 371.409 371.409" }}
              >
                <g>
                  <path d="M270.265,149.448c-36.107-47.124-70.38-78.948-73.439-141.372c0-1.836-0.612-3.06-1.836-4.284   c-0.612-3.06-3.672-4.896-6.732-3.06c-3.672,0-6.731,2.448-6.731,6.732c-77.112,83.232-207.468,294.372-43.452,354.959   c74.052,27.541,157.896-9.791,172.584-90.576C318.614,228.396,295.969,182.497,270.265,149.448z M138.686,323.256   c-17.748-10.404-28.764-31.211-34.272-49.572c-2.448-9.18-3.672-18.359-3.06-27.539c3.672-15.912,8.568-31.213,14.076-46.512   c3.06,13.463,9.18,26.928,17.748,36.719c19.584,21.422,59.364,34.273,70.38,61.201c6.732,16.523-19.584,30.6-30.6,34.271   C161.33,335.496,148.477,329.377,138.686,323.256z" />
                </g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
              </svg>
            </div>

            <div className="relative flex flex-col lg:flex-row justify-between items-center">
              {/* CTA content */}
              <div className="text-center lg:text-left lg:max-w-xl">
                <h3 className="h3 text-white mb-2">Simulateur</h3>

                {/* CTA form */}
                <form className="w-full lg:w-auto" id="contact-form">
                  <div className="flex flex-col justify-center max-w-xs mx-auto sm:max-w-md lg:mx-0">
                    <div className="mb-4">
                      <label
                        className="block text-gray-400 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        Nombre de personne dans votre foyer
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="number"
                        value={data.numberOfPersons}
                        onChange={(event) => {
                          event.preventDefault();
                          const value = Number(event.target.value);

                          if (value >= 0 && value < 10) {
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
                      />
                    </div>

                    {persons.map((person, id) => {
                      return (
                        <div className="mb-4">
                          <label
                            className="block text-gray-400 text-sm font-bold mb-2"
                            htmlFor="name"
                          >
                            Temps de douche actuel personne {id + 1}
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="number"
                            value={person}
                            onChange={(event) => {
                              const newPersons = [...persons];
                              newPersons[id] = Number(event.target.value);
                              setPersons(newPersons);
                            }}
                          />
                        </div>
                      );
                    })}
                    <div className="mb-4">
                      <label
                        className="block text-gray-400 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        Durée de douche souhaité
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="number"
                        value={data.wantedTimePerShower}
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
                        Prix de l'eau au m3
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="number"
                        value={data.PriceWaterPerCubicMeter}
                        onChange={(event) => {
                          event.preventDefault();
                          setData((prev) => ({
                            ...prev,
                            PriceWaterPerCubicMeter: Number(event.target.value),
                          }));
                        }}
                      />
                      <h6 className="h6 text-slate-300 mb-2 text-xs italic font-light">
                        *4.3€ est la moyenne française.
                      </h6>
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-400 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        Économies estimées :{getAmountOfSaving(data).toFixed(2)}
                        €
                      </label>
                    </div>
                    <h6 className="h6 text-slate-300 mb-2 text-xs italic font-light">
                      *Pour une moyenne d'une douche par jour par personne.
                    </h6>
                    {/* <div className="mb-4">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="grid-state"
                      >
                        Dans quel région habitez vous ?
                      </label>
                      <div className="relative">
                        <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-400 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                          <option>Picardie</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-400 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        Dans quel région habitez vous ?
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="number"
                        placeholder="3"
                      />
                    </div> */}
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
