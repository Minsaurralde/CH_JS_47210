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
  OpenModal("spinner");

  document.getElementById(
    "titulo"
  ).innerText = `${seleccion.title} ( ${seleccion.release_date} )`;
  document.getElementById("descripcion").innerText = seleccion.overview;

  document.getElementsByTagName(
    "iframe"
  )[0].src = `https://www.youtube.com/embed/${video.key}`;

  setTimeout(() => {
    document.getElementById("video").classList.replace("d-none", "d-block");
    CloseModal();
  }, 1000);
};

// IMPLEMENTACION LIBRERIA [ SWEET ALERT]
const OpenModal = (icon, text) => {
  const spinner = `
    <div class="container-spinner overflow-hidden">
      <div id="spinner" class="custom-spinner d-flex">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>`;

  switch (icon) {
    case "spinner":
      Swal.fire({
        html: spinner,
        background: "#00000000",
        showConfirmButton: false,
        allowOutsideClick: false,
        // icon: "success",
      });
      break;

    case "error":
      Swal.fire({
        title: "Ups...",
        text: text,
        icon: "error",
        background: "#ffffff",
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#0d6efd",
        timer: 3000,
      });
      break;

    default:
      break;
  }
};
const CloseModal = () => {
  Swal.close();
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
