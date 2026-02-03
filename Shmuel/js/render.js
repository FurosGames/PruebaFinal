import { getUsuario } from "./auth.js";
import { serviceMisTareas, serviceObtenerTodasLasTareas } from "../services/serviceTareas.js";
import { tbodyDashboard, searchInput, tbody } from "./elements.js";

let currentFilter = 'all';

export async function renderTareas() {
    // 1. Detectar en qué tabla pintar (Dashboard o Menú normal)
    const tabla = tbodyDashboard || tbody; 
    if (!tabla) return;

    const usuario = getUsuario();
    
    // 2. Traer los datos correctos según el rol
    const tareas = usuario.is_admin ? await serviceObtenerTodasLasTareas() : await serviceMisTareas();

    // 3. Capturar el texto de búsqueda (Usando tu variable searchInput de elements.js)
    const textoBusqueda = searchInput ? searchInput.value.toLowerCase() : "";

    // 4. FILTRADO UNIFICADO (Aquí corregimos el error de busquedaInput)
    let filteredTasks = tareas.filter(tarea => {
        // Filtro de texto
        const matchesSearch = tarea.name.toLowerCase().includes(textoBusqueda) ||
                              tarea.assignee.toLowerCase().includes(textoBusqueda);

        // Filtro de botones (Status)
        const statusTarea = tarea.status.toLowerCase().replace(/\s+/g, '');
        const matchesFilter = currentFilter === 'all' || statusTarea === currentFilter;

        return matchesSearch && matchesFilter;
    });

    // 5. MAPEO (Se mantiene tu estilo y colores intactos)
    tabla.innerHTML = filteredTasks.map(tarea => {
        const statusColors = {
            'In Progress': 'text-blue-700 bg-blue-100',
            'Pending': 'text-orange-700 bg-orange-100',
            'Completed': 'text-green-700 bg-green-100'
        };

        const priorityColors = {
            'Low': 'text-green-600',
            'Medium': 'text-yellow-600',
            'High': 'text-red-600'
        };

        return `
            <tr class="task-row border-b border-gray-100">
                <td class="px-6 py-4 font-medium text-gray-900">${tarea.name}</td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(tarea.assignee)}&background=random" 
                             class="w-8 h-8 rounded-full" alt="${tarea.assignee}">
                        <span class="text-gray-700">${tarea.assignee}</span>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <span class="btn-status cursor-pointer px-3 py-1 rounded-full text-sm font-medium ${statusColors[tarea.status]}" 
                          data-id="${tarea.id}" 
                          data-current="${tarea.status}">
                        ${tarea.status}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-2 ${priorityColors[tarea.priority]}">
                        <span class="w-2 h-2 rounded-full bg-current"></span>
                        <span class="font-medium">${tarea.priority}</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-gray-700">${tarea.dueDate}</td>
                <td class="px-6 py-4">
                    <div class="flex gap-2">
                        <button class="text-red-600 hover:text-red-700 btn-eliminar-tarea" data-id="${tarea.id}">
                            <svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}
