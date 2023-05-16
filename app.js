const getTypeColor = (type) => {
  const normal = "#F5F5F5";
  return (
    {
      normal,
      fire: "#FDDFDF",
      grass: "#DEFDE0",
      electric: "#FCF7DE",
      ice: "#DEF3FD",
      water: "#DEF3FD",
      ground: "#F4E7DA",
      rock: "#D5D5D4",
      fairy: "#FCEAFF",
      poison: "#98D7A5",
      bug: "#F8D5A3",
      ghost: "#CAC0F7",
      dragon: "#97B3E6",
      psychic: "#EAEDA1",
      fighting: "#E6E0D4",
    }[type] || normal
  );
};

const getOnlyFulfilled = async ({ func, arr }) => {
  const promises = arr.map(func);
  const responses = await Promise.allSettled(promises);
  return responses.filter((response) => response.status === "fulfilled");
};

const getPokemonsType = async (pokeApiResults) => {
  const promises = await getOnlyFulfilled({
    arr: pokeApiResults,
    func: (result) => fetch(result.url),
  });
  const responses = await Promise.allSettled(promises); // allSettled espera todas as promises serem resolvidas, e resultado final de forma eficiente
  const fulfilled = responses.filter(
    (response) => response.status === "fulfilled"
  );
  const pokePromises = fulfilled.map((url) => url.value.json());
  const pokemons = await Promise.all(pokePromises);
  return pokemons.map((fulfilled) =>
    fulfilled.types.map((info) => info.type.name)
  );
};

const getPokemonsIds = (pokeApiResults) =>
  pokeApiResults.map(({ url }) => {
    const urlsArray = url.split("/");
    return urlsArray.at(urlsArray.length - 2);
  });

const getPokemonsImgs = async (ids) => {
  const promises = ids.map((id) => fetch(`./assets/img/${id}.png`));
  const responses = await Promise.allSettled(promises);
  const fulfilled = responses.filter(
    (response) => response.status === "fulfilled"
  );
  return fulfilled.map((response) => response.value.url);
};

const handlePageLoaded = async () => {
  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=15&offset=0"
    );

    if (!response.ok) {
      throw Error("Não foi possível obter as informações");
    }

    const { results: pokeApiResults } = await response.json();
    const types = await getPokemonsType(pokeApiResults);
    const ids = getPokemonsIds(pokeApiResults);
    const imgs = await getPokemonsImgs(ids);

    console.log(imgs);
  } catch (error) {
    console.log("Algo deu errado:", error);
  }
};

handlePageLoaded();
