
export async function renderTareas() {
    const usuario = getUsuario();
    const tabla = document.getElementById("tbody");
    
    // DECISIÓN: ¿Qué datos cargamos?
    const tareas = usuario.is_admin 
        ? await serviceObtenerTodasLasTareas() // Admin ve todo
        : await serviceMisTareas();          // Usuario ve lo suyo

    // ... lógica de filtrado por búsqueda que ya tienes ...

    tabla.innerHTML = filteredTasks.map(tarea => {
        // ... tu plantilla HTML con los botones de editar/eliminar ...
    }).join('');
}