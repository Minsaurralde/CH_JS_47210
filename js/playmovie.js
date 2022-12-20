////////////////////////////////////////////////////////////////////////////
// DECLARACION DE VARIABLES y FUNCIONES
////////////////////////////////////////////////////////////////////////////
let reproductor = document.getElementById("playMovie");
let seleccion = {};
let video = "";

const downloadStorage = (key) => {
  const infoLocal = localStorage.getItem(key);
  return JSON.parse(infoLocal);
};

const playMovie = () => {
  document.getElementById(
    "titulo"
  ).innerText = `${seleccion.title} ( ${seleccion.release_date} )`;
  document.getElementById("descripcion").innerText = seleccion.overview;
  document.getElementsByTagName(
    "iframe"
  )[0].src = `https://www.youtube.com/embed/${video.key}`;

  setTimeout(() => {
    document.getElementById("spinner").classList.replace("d-flex", "d-none");
    document.getElementById("video").classList.replace("d-none", "d-block");
  }, 1000);
};

////////////////////////////////////////////////////////////////////////////
// CODIGO AUTO-EJECUTADO EN WINDOW.ONLOAD
////////////////////////////////////////////////////////////////////////////

// 1- RECUPERAR INFORMACION DE LOCALSTORAGE
if (window.localStorage) {
  seleccion = downloadStorage("seleccion");
  video = downloadStorage("video");
}
// 2- PLAY
playMovie();
