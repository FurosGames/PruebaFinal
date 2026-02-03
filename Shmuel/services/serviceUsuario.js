const url = "http://localhost:3000/"

export async function serviceLoginUser(email, pass) {

    try {
        const response = await fetch(`${url}usuarios?email=${email}&password=${pass}`);
        if (!response.ok) {
            throw new Error("Error de servidor");
        }
        const usuarios = await response.json();

        if (!usuarios || usuarios.length === 0) {
            throw new Error("Credenciales incorrectas");
        }
        return { id: usuarios[0].id, name: usuarios[0].name, is_admin: usuarios[0].is_admin }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function serviceRegisterUser(name, email, password) {
    try {
        // let users = await fetch(`${url}usuarios`);
        // users = await users.json();
        // const id = users += 1;
        const response = await fetch(`${url}usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, is_admin: false })
        });

        if (!response.ok) throw new Error('Error al registrar usuario');
        return await response.json();

    } catch (error) {
        console.error(error);
        throw error;
    }
}