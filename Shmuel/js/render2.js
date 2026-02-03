import { getUsuario } from "./auth.js";
import { tbody, searchTerm } from "./elements.js";
import { serviceObtenerTodasLasTareas, serviceMisTareas } from "../services/serviceTareas.js";
    
// import { misTareas } from "./listeners.js";

// let currentFilter = 'all';
// export async function renderTareas() {
//     const tabla = tbody;
//     const busquedaInput = searchTerm.value.toLowerCase();
//     const tareas = await serviceMisTareas();

//     let filteredTasks = tareas.filter(tarea => {
//         const matchesSearch = tarea.name.toLowerCase().includes(busquedaInput) ||
//             tarea.assignee.toLowerCase().includes(busquedaInput);
//         const matchesFilter = currentFilter === 'all' ||
//             tarea.status.toLowerCase().replace(' ', '') === currentFilter;
//         return matchesSearch && matchesFilter;
//     });
export async function renderTareas() {
    const tabla = tbody;
    // Si searchTerm no existe aún, usamos un string vacío
    const busquedaInput = searchTerm ? searchTerm.value.toLowerCase() : "";
    const tareas = await serviceMisTareas();

    let filteredTasks = tareas.filter(tarea => {
        const matchesSearch = tarea.name.toLowerCase().includes(busquedaInput) ||
            tarea.assignee.toLowerCase().includes(busquedaInput);

        // Normalizamos el status para la comparación
        const statusTarea = tarea.status.toLowerCase().replace(/\s+/g, '');
        const matchesFilter = currentFilter === 'all' || statusTarea === currentFilter;

        return matchesSearch && matchesFilter;
    });

    tareas.forEach(element => {
        console.log(element)
    });
    tabla.innerHTML = filteredTasks.map(tareas => {
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
                <td class="px-6 py-4 font-medium text-gray-900">${tareas.name}</td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(tareas.assignee)}&background=random" 
                             class="w-8 h-8 rounded-full" alt="${tareas.assignee}">
                        <span class="text-gray-700">${tareas.assignee}</span>
                    </div>
                </td>
                
                <!-- COLUMNA STATUS: Añadimos clase btn-status y atributos data -->
                <td class="px-6 py-4">
                    <span class="btn-status cursor-pointer px-3 py-1 rounded-full text-sm font-medium ${statusColors[tareas.status]}" 
                          data-id="${tareas.id}" 
                          data-current="${tareas.status}">
                        ${tareas.status}
                    </span>
                </td>

                <td class="px-6 py-4">
                    <div class="flex items-center gap-2 ${priorityColors[tareas.priority]}">
                        <span class="w-2 h-2 rounded-full bg-current"></span>
                        <span class="font-medium">${tareas.priority}</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-gray-700">${tareas.dueDate}</td>
                <td class="px-6 py-4">
                    <div class="flex gap-2">
                        ${tareas.status === 'Completed' ? `
                            <button class="text-blue-600 hover:text-blue-700 btn-ver-tarea" data-id="${tareas.id}">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                </svg>
                            </button>
                        ` : `
                            
                            <button class="text-red-600 hover:text-red-700 btn-eliminar-tarea" data-id="${tareas.id}">
                                <svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </button>
                        `}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    // <button class="text-gray-600 hover:text-gray-700 btn-editar-tarea" data-id="${tareas.id}">
    //     <svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    //     </svg>
    // </button>

    // tabla.innerHTML = filteredTasks.map(tareas => {
    //     const statusColors = {
    //         'In Progress': 'text-blue-700 bg-blue-100',
    //         'Pending': 'text-orange-700 bg-orange-100',
    //         'Completed': 'text-green-700 bg-green-100'
    //     };

    //     const priorityColors = {
    //         'Low': 'text-green-600',
    //         'Medium': 'text-yellow-600',
    //         'High': 'text-red-600'
    //     };
    //     return `
    //                 <tr class="task-row border-b border-gray-100">
    //                     <td class="px-6 py-4 font-medium text-gray-900">${tareas.name}</td>
    //                     <td class="px-6 py-4">
    //                         <div class="flex items-center gap-2">
    //                             <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(tareas.assignee)}&background=random" 
    //                                  class="w-8 h-8 rounded-full" alt="${tareas.assignee}">
    //                             <span class="text-gray-700">${tareas.assignee}</span>
    //                         </div>
    //                     </td>
    //                     <td class="px-6 py-4">
    //                         <span class="px-3 py-1 rounded-full text-sm font-medium ${statusColors[tareas.status]}">
    //                             ${tareas.status}
    //                         </span>
    //                     </td>
    //                     <td class="px-6 py-4">
    //                         <div class="flex items-center gap-2 ${priorityColors[tareas.priority]}">
    //                             <span class="w-2 h-2 rounded-full bg-current"></span>
    //                             <span class="font-medium">${tareas.priority}</span>
    //                         </div>
    //                     </td>
    //                     <td class="px-6 py-4 text-gray-700">${tareas.dueDate}</td>
    //                     <td class="px-6 py-4">
    //                         <div class="flex gap-2">
    //                             ${tareas.status === 'Completed' ? `
    //                                 <button onclick="viewTask(${tareas.id})" class="text-blue-600 hover:text-blue-700">
    //                                     <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    //                                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
    //                                     </svg>
    //                                 </button>
    //                             ` : `
    //                                 <button "class="text-gray-600 hover:text-gray-700 btn-editar-tarea" data-id=${tareas.id}>
    //                                     <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
    //                                     </svg>
    //                                 </button>
    //                                 <button class="text-red-600 hover:text-red-700 btn-eliminar-tarea" data-id=${tareas.id}>
    //                                     <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
    //                                     </svg>
    //                                 </button>
    //                             `}
    //                         </div>
    //                     </td>
    //                 </tr>
    //             `;
    // }).join('');
}