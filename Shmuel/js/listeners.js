// Este documento escucha los eventos del DOM
import {    loginForm,
            registerForm,
            title,
            toggleText,
            toggleForm,
            toggleTextLink,
            emailLogin, 
            passwordLogin, 
            btnCerrarSesion, 
            nameRegister, 
            emailRegister, 
            passwordRegister, 
            openModal, 
            modal, 
            tbody, 
            // taskForm, 
            nombreTarea, 
            asignarTarea, 
            prioridadTarea, 
            fechaTarea,
         } from "./elements.js"

import { setUsuario, logout } from "./auth.js";
import { serviceLoginUser, serviceRegisterUser } from "../services/serviceUsuario.js";
import { serviceMisTareas, serviceCrearTarea, serviceEliminarTarea, serviceCambiarStatus } from "../services/serviceTareas.js";
import { getUsuario } from "./auth.js";
import { renderTareas } from "./render2.js";

// Esta función cambia entre formularios para evitar un archivo de más
export function toggleForms() {
    toggleForm.addEventListener("click", async (e) => {
        loginForm.classList.toggle("hidden");
        registerForm.classList.toggle("hidden");
        if (loginForm.classList.contains("hidden")) {
            title.textContent = "Crear Cuenta";
            toggleText.textContent = "¿Ya tienes cuenta?";
            toggleTextLink.textContent = "Inicia sesión"
        } else {
            title.textContent = "Iniciar Sesión";
            toggleText.textContent = "¿No tienes cuenta?";
            toggleTextLink.textContent = "Regístrate"
        }
    })
}

export async function loginUser() {
    const form = loginForm;
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const loginEmail = emailLogin.value;
        const LoginPassword = passwordLogin.value;
        try {
            const usuario = await serviceLoginUser(loginEmail, LoginPassword);
            setUsuario(usuario)
            // sessionStorage.setItem("usuario", JSON.stringify(usuario));

            window.location.href =
                usuario.is_admin === true ? "pages/dashboard.html" : "pages/menu.html";
        } catch (error) {
            alert(error.message || "Usuario o contraseña incorrectos");
        }
    });
}

export async function registerUser() {
    if (!registerForm) return;

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const registerName = nameRegister.value;
        const registerEmail = emailRegister.value;
        const registerPassword = passwordRegister.value;
        try {
            const registarUsuario = await serviceRegisterUser(registerName, registerEmail, registerPassword);

            alert("Usuario registrado con exito")
            console.log(registarUsuario)

        } catch (error) {
            alert(error.message);
        }
    });
}

export async function misTareas() {
    const tareas = await serviceMisTareas();
}

// Modal functions
export function abrirModal() {
    openModal.addEventListener("click", () => {
        modal.classList.add('active');
    });
}

export function cerrarModal() {
    closeModal.addEventListener("click", () => {
        modal.classList.remove('active');
    });
}

if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
        logout();
    });
}


export function agregarTareaListener() {
    if (!taskForm) return;

    taskForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const usuario = getUsuario();

        const objetoTarea = {
            name: nombreTarea.value,
            assignee: asignarTarea.value,
            status: 'Pending',
            priority: prioridadTarea.value,
            dueDate: new Date(fechaTarea.value).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            }),
            id_user: usuario.id
        };

        try {
            await serviceCrearTarea(objetoTarea);
            alert("Tarea agregada con éxito");

            // Limpieza y cierre
            taskForm.reset();
            modal.classList.remove('active'); // Cierra el modal tras guardar
            renderTareas(); // Refresca la lista automáticamente

        } catch (error) {
            alert("No se pudo agregar la tarea: " + error.message);
        }
    });
}

// ELIMINAR TAREA
export function listenerEliminar() {
    if (!tbody) return;

    tbody.addEventListener("click", async (event) => {
        // 1. Identificamos si el clic fue en el botón de eliminar usando su clase
        const botonEliminar = event.target.closest(".btn-eliminar-tarea");

        // 2. Si no es ese botón, ignoramos el clic (no hace nada en el resto de la tabla)
        if (!botonEliminar) return;

        // 3. Obtenemos el ID guardado en el atributo data-id
        const idTarea = botonEliminar.getAttribute("data-id");

        if (confirm("¿Deseas eliminar permanentemente esta tarea?")) {
            try {
                await serviceEliminarTarea(idTarea);
                await renderTareas(); // Recargamos la tabla para que desaparezca la fila
            } catch (error) {
                alert("Error al intentar borrar: " + error.message);
            }
        }
    });
}

// ACTUALIZAR TAREA
let idTareaEnEdicion = null; // Variable de control

export function listenerEditar() {
    tbody.addEventListener("click", async (e) => {
        const btn = e.target.closest(".btn-editar-tarea");
        if (!btn) return;

        idTareaEnEdicion = btn.dataset.id; // Guardamos el ID que vamos a editar

        // 1. Buscamos los datos de esa tarea (puedes pedirlos a la API o buscarlos en tu array actual)
        const tareas = await serviceMisTareas();
        const tarea = tareas.find(t => t.id == idTareaEnEdicion);

        if (tarea) {
            // 2. Llenamos el formulario con lo que ya tenía la tarea
            nombreTarea.value = tarea.name;
            asignarTarea.value = tarea.assignee;
            prioridadTarea.value = tarea.priority;
            fechaTarea.value = tarea.dueDate; // Asegúrate que el formato coincida

            // 3. Abrimos el modal y cambiamos el texto del botón
            modal.classList.add('active');
            taskForm.querySelector('button[type="submit"]').textContent = "Guardar Cambios";
        }
    });
}

// UPDATE
export function listenerCambioStatus() {
    if (!tbody) return;

    tbody.addEventListener("click", async (e) => {
        const badge = e.target.closest(".btn-status");
        if (!badge) return;

        const id = badge.dataset.id;
        const statusActual = badge.dataset.current;

        // Definimos la lógica de rotación
        let siguienteStatus;
        if (statusActual === 'Pending') {
            siguienteStatus = 'In Progress';
        } else if (statusActual === 'In Progress') {
            siguienteStatus = 'Completed';
        } else {
            siguienteStatus = 'Pending';
        }

        try {
            await serviceCambiarStatus(id, siguienteStatus);
            await renderTareas(); // Refrescamos la tabla para ver el nuevo color y texto
        } catch (error) {
            console.error("Error al rotar estado:", error);
        }
    });
}
