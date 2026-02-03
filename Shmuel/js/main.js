// Se ejecuta al cuando apenas se cargue el DOM, llamando la función principal main()
import { toggleForms, loginUser, registerUser, abrirModal, cerrarModal, agregarTareaListener, listenerEliminar, listenerCambioStatus} from "./listeners.js";
import { getUsuario, setUsuario, logout } from "./auth.js";
import { renderTareas} from "./render.js";
import { searchTerm } from "./elements.js";
import { renderMetricasDashboard } from "./renderAdmin.js";



async function main() {
    const page = document.body.dataset.page;
    const usuario = getUsuario();

    if (page === "login") {
        loginUser();
        toggleForms();
        registerUser();
        return;
    }
    if (!usuario) {
        if (page !== "login") {
            window.location.href = "index.html";
        }
        return;
    }
    if (page === "menu") {
        if (usuario.is_admin != false) {
            alert("No tiene permisos para esta página")
            window.location.href = "../pages/dashboard.html";

            if (searchTerm) {
                searchTerm.addEventListener("input", () => {
                    console.log("Buscando..."); // Para verificar que funciona
                    renderTareas();
                });
            }

        } else {
            renderTareas();
            abrirModal();
            cerrarModal();
            agregarTareaListener()
            listenerCambioStatus();
            // listenerEditar()
            listenerEliminar();
        }
        if (searchTerm) {
            searchTerm.addEventListener("input", () => {
                renderTareas(); // Al llamar a renderTareas, se ejecuta tu lógica de filter
            });
        }
    }
    if (searchInput) {
    searchInput.addEventListener("input", () => {
        renderTareas(); // Re-renderiza cada vez que escribes
    });
}
    if (page === "dashboard") {
    const usuario = getUsuario();
    // SEGURIDAD: Si no es admin, fuera
    if (usuario.is_admin !== true) {
        window.location.href = "menu.html";
    } else {
        // ACTIVACIÓN DE ADMIN
        renderMetricasDashboard(); // Llena las tarjetas de números
        renderTareas();            // Llena la tabla
        listenerEliminar();        // Activa borrar
        listenerCambioStatus();    // Activa rotar status
    }
}
    // if (page === "dashboard") {
    //     if (usuario.is_admin != true) {
    //         alert("No tiene permisos para esta página")
    //         window.location.href = "../pages/menu.html";
    //     } else {
    //         mainDashboard.style.display = "block";
    //     }
    // }
}
document.addEventListener("DOMContentLoaded", main);