import { getUsuario } from "../js/auth.js";
const url = "http://localhost:3000/"

// export async function serviceMisTareas() {

//     const usuario = getUsuario();
//     try {
//         // const response = await fetch(`${url}tareas?id=${usuario.id}`);
//         const response = await fetch(`${url}tareas?id_user=${usuario.id}`);
//         if (!response.ok) {
//             throw new Error("Error de servidor");
//         }
//         const tareas = await response.json();

//         if (!tareas || tareas.length === 0) {
//             throw new Error("No hay tareas registradas");
//         }
//         return tareas
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

// 1. ESTA ES LA QUE USA EL USUARIO (CON FILTRO)
export async function serviceMisTareas() {
    const usuario = getUsuario();
    try {
        const response = await fetch(`${url}tareas?id_user=${usuario.id}`);
        const tareas = await response.json();
        return tareas || []; 
    } catch (error) {
        return [];
    }
}

// 2. ESTA ES LA QUE USA EL ADMIN (SIN FILTRO) - ASEGÚRATE QUE SOLO ESTÉ UNA VEZ
export async function serviceObtenerTodasLasTareas() {
    try {
        const response = await fetch(`${url}tareas`);
        if (!response.ok) throw new Error("Error API");
        return await response.json();
    } catch (error) {
        console.error("Error al obtener todas las tareas:", error);
        return [];
    }
}

// NUEVA TAREA
export async function serviceCrearTarea(nuevaTarea) {
    try {
        const response = await fetch(`${url}tareas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaTarea)
        });
        if (!response.ok) throw new Error("Error al crear la tarea en el servidor");
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// ELIMINAR TAREA
export async function serviceEliminarTarea(id) {
    try {
        const response = await fetch(`${url}tareas/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error("No se pudo eliminar la tarea");
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// ACTUALIZAR TAREA 
// export async function serviceActualizarTarea(id, tareaEditada) {
//     try {
//         const response = await fetch(`${url}tareas/${id}`, {
//             method: 'PUT', // Método para actualizar
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(tareaEditada)
//         });
//         if (!response.ok) throw new Error("Error al actualizar en la API");
//         return await response.json();
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }


// export async function serviceCambiarStatus(id, nuevoStatus) {
//     try {
//         const response = await fetch(`${url}tareas/${id}`, {
//             method: 'PATCH', // PATCH actualiza solo los campos que envíes
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ status: nuevoStatus }) 
//         });
//         if (!response.ok) throw new Error("No se pudo actualizar el estado");
//         return await response.json();
//     } catch (error) {
//         console.error(error);
//     }
// }

export async function serviceCambiarStatus(id, nuevoStatus) {
    try {
        const response = await fetch(`${url}tareas/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: nuevoStatus })
        });
        if (!response.ok) throw new Error("Error al actualizar estado");
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

