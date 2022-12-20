///////// ARRAY Y OBJETOS [ GENEROS ] ////////////
const GenderList = [
  {
    id: 28,
    name: "Acción",
  },
  {
    id: 12,
    name: "Aventura",
  },
  {
    id: 16,
    name: "Animación",
  },
  {
    id: 35,
    name: "Comedia",
  },
  {
    id: 80,
    name: "Crimen",
  },
  {
    id: 99,
    name: "Documental",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Familia",
  },
  {
    id: 14,
    name: "Fantasía",
  },
  {
    id: 36,
    name: "Historia",
  },
  {
    id: 27,
    name: "Terror",
  },
  {
    id: 10402,
    name: "Música",
  },
  {
    id: 9648,
    name: "Misterio",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Ciencia ficción",
  },
  {
    id: 10770,
    name: "Película de TV",
  },
  {
    id: 53,
    name: "Suspense",
  },
  {
    id: 10752,
    name: "Bélica",
  },
  {
    id: 37,
    name: "Western",
  },
];

////////////////////////////////////////////////////////////////////////////
// DECLARACION CLASE PELICULA CON SUS METODOS
////////////////////////////////////////////////////////////////////////////
class Pelicula {
  //1) Constructor
  constructor(
    id,
    genres,
    title,
    poster_path,
    backdrop_path,
    release_date,
    overview,
    vote_average,
    vote_count,
    isFavourite
  ) {
    this.id = id;
    this.genres = genres;
    this.title = title;
    this.poster_path = poster_path;
    this.backdrop_path = backdrop_path;
    this.release_date = release_date;
    this.overview = overview;
    this.vote_average = vote_average;
    this.vote_count = vote_count;
    this.isFavourite = isFavourite;
  }
  //2) metodos
  Mostrar(container) {
    let card = `
      <div class="custom-card mb-3 col-sm-4 col-lg-3 d-flex flex-column position-relative overflow-hidden">
        <img
        src="${API_IMAGE_URL}/${this.poster_path}"
        alt="${this.title}"
        class="h-85 p-0 img-fluid img-thumbnail border-0"
        />
        <div class="h-15 w-100 m-auto row d-flex align-items-center bg-blue rounded-bottom">
          <span class="col">${this.title}</span>
          <span class="col col-lg-4">
            <i class="bi bi-star-fill"></i>
            ${this.vote_average}
          </span>
        </div>
        <div class="hover-div">
            <i class="bi ${
              this.isFavourite ? "bi-check-square-fill" : "bi-clock-fill"
            } custom-itext fs-2"
            onclick="handleFavourite(event, ${this.id})"></i>
            <p class="custom-fs">ver mas ta...</p>
        </div>
        <button onclick="handlePlay(${
          this.id
        })" class="custom-btn btn btn-primary">
            Play
        </button>
      </div>`;

    container.innerHTML += card;
  }
  CargarHero(container, index) {
    let item = `
        <div class="carousel-item ${index == 0 ? "active" : ""} h-100">
          <img
            src="${API_IMAGE_URL}/${this.backdrop_path}"
            class="d-block w-100"
            alt="..."
          />
          <div class="carousel-caption d-none d-md-block">

            <div>
              <h5>${this.title}</h5>
              <button onclick="handlePlay(${
                this.id
              })" class="custom-btn btn btn-primary">Play</button>
            </div>

            <p>${this.overview}</p>
          </div>
        </div>`;

    container.innerHTML += item;
  }
}

////////////////////////////////////////////////////////////////////////////
// DECLARACION DE VARIABLES y FUNCIONES
////////////////////////////////////////////////////////////////////////////
const API_KEY = "c2eba89255c9cfc122cd0c733700679b";
const API_URL = "https://api.themoviedb.org/3";
const API_IMAGE_URL = "https://image.tmdb.org/t/p/original";
const DEFAULT_PARAMS = {
  api_key: API_KEY,
  language: "es-ES",
};

const CarouselContainer = document.getElementById("itemsCarousel");
const PeliculasContainer = document.getElementById("peliculas");
const PlayContainer = document.getElementById("playMovie");
const submitSearch = document.getElementById("search");
const imputSearch = document.getElementById("imputSearch");
const PagesContainer = document.getElementById("pages");

let favouriteList = [];
let movieList = [];
let popularList = [];
let selectMovie = {};
let searchkey = "";
let currentQuery = {};

const sweetAlert = (icon, text) => {
  switch (icon) {
    case "spinner":
      Swal.fire({
        icon: "success",
        background: "#00000000",
      });
      break;

    case "error":
      Swal.fire({
        title: "Error",
        text: text,
        icon: "error",
        confirmButtonText: "Cerrar",
        timer: 3000,
        background: "#ffffff",
      });
      break;

    default:
      break;
  }
};

const newMovie = (
  {
    id,
    genres,
    title,
    poster_path,
    backdrop_path,
    release_date,
    overview,
    vote_average,
    vote_count,
    isFavourite,
  },
  lista
) => {
  let checkFavourite = isFavourite;

  if (!isFavourite) {
    checkFavourite =
      favouriteList?.some((peli) => peli.title == title) || false;
  }

  lista.push(
    new Pelicula(
      id,
      genres,
      title,
      poster_path,
      backdrop_path,
      release_date,
      overview,
      vote_average,
      vote_count,
      checkFavourite
    )
  );
};
const resetMovieList = () => {
  movieList = [];
};
const showList = (lista) => {
  const div = document.createElement("div");
  div.className = "row text-center";

  if (lista.length > 0) {
    lista.forEach((element) => {
      element.Mostrar(div);
    });

    PeliculasContainer.innerHTML = "";
    PeliculasContainer.appendChild(div);
  } else {
    sweetAlert("error", "No se encontraron resultados");
    PeliculasContainer.innerHTML = `<h3 class="text-bg-dark text-center">No se encontraron resultados 
                                    con los filtros ingresados</h3>`;
  }
};

const fetchPopularMovies = () => {
  // INVOCACION API POPULARES
  const APIquery =
    `${API_URL}/movie/popular?` +
    new URLSearchParams(DEFAULT_PARAMS).toString();

  const callMovies = async () => {
    const response = await fetch(APIquery);
    return response.json();
  };

  callMovies().then((data) => {
    if (data.results.length) {
      const Slice = data.results.slice(1, 6);

      PopularList = [];
      CarouselContainer.innerHTML = "";

      Slice.forEach((element, index) => {
        newMovie(element, PopularList);
        PopularList[index].CargarHero(CarouselContainer, index);
      });
    }
  });
};

const fetchMovies = (searchType, keyword, page) => {
  currentQuery = "";
  // SEARCHTYPE PUEDE SER: "search + keyword" / "discover + category / "URL" + route
  if (searchType == "discover" && keyword) {
    const { id } = GenderList.find((element) => element.name === keyword);
    keyword = id;
  }

  const params =
    searchType == "search"
      ? { query: keyword, ...DEFAULT_PARAMS }
      : keyword !== ""
      ? { with_genres: keyword, ...DEFAULT_PARAMS }
      : DEFAULT_PARAMS;

  let APIquery = "";

  if (searchType == "URL") {
    APIquery = keyword + page;
  } else {
    APIquery =
      `${API_URL}/${searchType}/movie?` +
      new URLSearchParams(params).toString();
  }

  // INVOCACION API PELICULAS
  const callMovies = async () => {
    const response = await fetch(APIquery);

    return response.json();
  };
  callMovies().then((data) => {
    currentQuery = {
      APIquery,
      APIpage: data.page,
      APItotalpage: data.total_pages,
    };
    // 1- GUARDAR RTA EN VARIABLE
    let MoviesResponse = [...data.results];

    for (let movie of MoviesResponse) {
      const genres = movie.genre_ids.map((genero) => {
        const { name } = GenderList.find((element) => element.id === genero);
        return name;
      });
      // 2- AGREGAR NUEVA PROPIEDAD
      movie.genres = genres;
    }

    // 3- PASAR POR LA CLASE Y AGREGAR A LISTA
    resetMovieList();
    MoviesResponse.forEach((movie) => {
      movie.poster_path && newMovie(movie, movieList);
    });

    // 4- RENDERIZAR
    showList(movieList);
    PagesContainer.innerHTML = `
      <i class="bi bi-caret-left-fill fs-1 custom-itext" onclick=handlePages("-")></i>
      <span class="fs-3">Pag ${currentQuery.APIpage} / ${currentQuery.APItotalpage}</span>
      <i class="bi bi-caret-right-fill fs-1 custom-itext" onclick=handlePages("+")></i>`;
  });
};

const fetchVideo = (id) => {
  const APIquery =
    `${API_URL}/movie/${id}/videos?` +
    new URLSearchParams(DEFAULT_PARAMS).toString();

  // INVOCACION API VIDEO
  const callVideo = async () => {
    const response = await fetch(APIquery);
    if (response.ok) {
      return response.json();
    } else {
      throw "Error en peticion";
    }
  };

  callVideo().then((data) => {
    // 1- GUARDAR VIDEO EN STORAGE
    if (data.results.length) {
      const trailer =
        data.results.find((video) =>
          video.name.toLowerCase().includes("tráiler oficial")
        ) || data.results[0];

      saveStorage("video", trailer);
      location.href = "./playmovie.html";
    } else {
      deleteStorage("video");
      console.log("mostrar modal de error");
    }
  });
};

const handlePages = (operator) => {
  const { APIquery, APIpage, APItotalpage } = currentQuery;
  const page = APIpage + 1;

  switch (operator) {
    case "+":
      if (page !== APItotalpage) {
        fetchMovies("URL", `${APIquery}&page=`, page);
      }
      break;
    case "-":
      if (page < 1) {
        fetchMovies("URL", `${APIquery}&page=`, page);
      }
      break;
    default:
      break;
  }
};

const handleFavourite = (e, id) => {
  const { target } = e;

  const selected =
    movieList.find((movie) => movie.id == id) ||
    favouriteList.find((movie) => movie.id == id);

  if (selected.isFavourite) {
    // QUITAR DE FAVORITOS
    selected.isFavourite = false;
    target.classList.replace("bi-check-square-fill", "bi-clock-fill");

    const filter = favouriteList.filter((movie) => movie.id !== id);
    favouriteList = filter;
  } else {
    // FAVORITEAR
    selected.isFavourite = true;
    target.classList.replace("bi-clock-fill", "bi-check-square-fill");

    favouriteList = [...favouriteList, selected];
  }

  // ACTUALIZAR STORAGE
  saveStorage("favoritos", favouriteList);
};

const handleSearch = (e) => {
  e.preventDefault();
  activeCategory("");

  fetchMovies("search", searchkey);
  submitSearch.reset();
};
imputSearch.addEventListener("input", (e) => {
  searchkey = e.target.value;
});
submitSearch.addEventListener("submit", handleSearch);

const handleCategory = (e) => {
  const { target } = e;
  const category = target.textContent;

  activeCategory(category);

  if (category == "Todo" || category == "Watchlist") {
    // MOSTRAR LISTA COMPLETA O FAVORITOS
    category == "Todo"
      ? fetchMovies("discover", "")
      : (showList(favouriteList), (PagesContainer.innerHTML = ""));
  } else {
    // MOSTRAR CATEGORIA SELECCIONADA
    fetchMovies("discover", category);
  }
};
const activeCategory = (text) => {
  const coleccion = document.querySelectorAll("#submenu ul li a");
  for (let index = 0; index < coleccion.length; index++) {
    const element = coleccion[index];

    element.textContent == text
      ? element.classList.add("active")
      : element.classList.remove("active");
  }
};
document.querySelector("#submenu ul").addEventListener("click", handleCategory);

const handleNavColor = (e) => {
  const navbar = document.getElementById("navbar");
  const scrolly = e.path[1].scrollY;

  const btnSubir = document.getElementById("btn_subir");

  if (scrolly > 340) {
    navbar.style.backgroundColor = "black";
    btnSubir.classList.remove("d-none");
  } else {
    navbar.style.backgroundColor = "transparent";
    btnSubir.classList.add("d-none");
  }
};
document.addEventListener("scroll", handleNavColor);

const handlePlay = (id) => {
  //1- BUSCAR PELI Y GUARDAR EN STORAGE
  const found = movieList.find((movie) => movie.id == id);
  saveStorage("seleccion", found);
  //2- BUSCAR VIDEO
  fetchVideo(found.id);
};

const saveStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
const deleteStorage = (key) => {
  localStorage.removeItem(key);
};
const downloadStorage = (key) => {
  const infoLocal = localStorage.getItem(key);

  return JSON.parse(infoLocal);
};

////////////////////////////////////////////////////////////////////////////
// CODIGO AUTO-EJECUTADO EN WINDOW.ONLOAD
////////////////////////////////////////////////////////////////////////////

// 1- PERSISTIR INFORMACION DE LOCALSTORAGE
if (window.localStorage.favoritos) {
  const storage = downloadStorage("favoritos");
  storage.forEach((movie) => {
    newMovie(movie, favouriteList);
  });
}
//2- CARGAR CARRUSEL
fetchPopularMovies();

// 2- MOSTRAR LISTA COMPLETA
fetchMovies("discover", "");
