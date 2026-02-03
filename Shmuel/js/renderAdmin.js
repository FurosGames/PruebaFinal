import { totalTareas, tareasPendientes, tareasCompletadas, metricasGenerales } from "./elements.js";
import { serviceObtenerTodasLasTareas } from "../services/serviceTareas.js";

export async function renderMetricasDashboard() {
    const tareas = await serviceObtenerTodasLasTareas();

    const total = tareas.length;
    const pendientes = tareas.filter(t => t.status === 'Pending').length;
    const completadas = tareas.filter(t => t.status === 'Completed').length;
    const exito = total > 0 ? ((completadas / total) * 100).toFixed(0) : 0;

    // Solo asignamos si los elementos existen en el HTML actual
    if (totalTareas) totalTareas.textContent = total;
    if (tareasPendientes) tareasPendientes.textContent = pendientes;
    if (tareasCompletadas) tareasCompletadas.textContent = completadas;
    if (metricasGenerales) metricasGenerales.textContent = `${exito}%`;
}
