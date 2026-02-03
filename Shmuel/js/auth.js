export function getUsuario() {
    const data = sessionStorage.getItem("usuario");
    return data ? JSON.parse(data) : null;
}

export function setUsuario(usuario) {
    sessionStorage.setItem("usuario", JSON.stringify(usuario));
}

export function logout() {
    sessionStorage.removeItem("usuario");
    window.location.href = "../index.html";
}
