// Función para manejar el registro de usuario
document.getElementById('crearUsuarioForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const birthdate = document.getElementById('birthdate').value;

    // Validar que todos los campos estén completos
    if (!firstName || !lastName || !username || !email || !password || !birthdate) {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Por favor completa todos los campos.',
        });
        return;
    }

    try {
        // Enviar datos al servidor para crear el usuario
        const response = await fetch('http://localhost:3000/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: firstName,
                last_name: lastName,
                user_name: username,
                mail: email,
                password: password,
                date_birth: birthdate
            })
        });

        if (!response.ok) {
            throw new Error('Ya existe un usuario con el mismo correo electrónico o nombre de usuario.');
        }

        const data = await response.json();
        console.log('Success:', data);

        // Usar SweetAlert para la alerta de éxito
        Swal.fire({
            icon: 'success',
            title: 'Usuario creado exitosamente',
            confirmButtonText: 'Aceptar'
        });

        // Limpiar los campos del formulario después de enviarlos
        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('username').value = '';
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('birthdate').value = '';

        // Redirigir a la página de inicio de sesión (login.html)
        window.location.href = './index.html';

    } catch (error) {
        console.error('Error:', error.message);
        // Usar SweetAlert para la alerta de error
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al crear el usuario: ' + error.message,
        });
    }
});
