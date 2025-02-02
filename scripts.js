const calendarTitle = document.getElementById('calendar-title');
const calendarBody = document.getElementById('calendar-body');

let currentDate = new Date();

const usuarios = [
    { id: 1, nombre: "Juan Pérez", username: "juanpe", password: "1234", rol: "Administrador" },
    { id: 2, nombre: "Ana López", username: "analopez", password: "1234", rol: "Operario" },
    { id: 3, nombre: "Luis García", username: "luisgarcia", password: "1234", rol: "Mecánico" }
];

// Inicializar usuarios en localStorage si no existen
if (!localStorage.getItem("usuarios")) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

const maquinas = [
    {
            id: 1,
            nombre: "Excavadora 3000",
            tipo: "Excavadora",
            trabajo: "Excavación",
            modelo: "Caterpillar X3",
            fechaMantenimiento: "2023-12-01",
            realizadoPor: "Juan Pérez",
            estado: "Funcionando"
        },
        {
            id: 2,
            nombre: "Grúa Industrial",
            tipo: "Grúa",
            trabajo: "Construcción",
            modelo: "Liebherr LTM",
            fechaMantenimiento: "2023-11-15",
            realizadoPor: "Ana López",
            estado: "Averiada"
        },
        {
            id: 3,
            nombre: "Excavadora 2500",
            tipo: "Excavadora",
            trabajo: "Excavación",
            modelo: "Caterpillar X2",
            fechaMantenimiento: "2023-12-01",
            realizadoPor: "Juan Pérez",
            estado: "Funcionando"
        },
    ];

let maquinaEditandoId = null;
let nextId = maquinas.length ? Math.max(...maquinas.map(maquina => maquina.id)) + 1 : 1;

if (!localStorage.getItem("maquinas")) {
    localStorage.setItem("maquinas", JSON.stringify(maquinas));
}

const averias = [
    { id: 1, maquina: "Torno CNC", descripcion: "La máquina no enciende.", acciones: "Revisar el sistema eléctrico y los fusibles.", resuelta: false },
    { id: 2, maquina: "Prensa Hidráulica", descripcion: "Pérdida de presión en el sistema.", acciones: "Verificar las juntas y reemplazar las dañadas.", resuelta: true }
];

if (!localStorage.getItem("averias")) {
    localStorage.setItem("averias", JSON.stringify(averias));
}

const tareas = [
    {
        id: 1,
        nombre: "Reparar máquina 1",
        usuario: "Carlos",
        descripcion: "Reparación del motor de la máquina 1.",
        estado: "pendiente",
        historial: []
    },
    {
        id: 2,
        nombre: "Revisar inventario",
        usuario: "Ana",
        descripcion: "Revisión del inventario de repuestos.",
        estado: "en-curso",
        historial: []
    },
    {
        id: 3,
        nombre: "Actualizar software",
        usuario: "Luis",
        descripcion: "Instalación de las últimas actualizaciones de software.",
        estado: "realizada",
        historial: []
    }
];

if (!localStorage.getItem("tareas")) {
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("listaMaquinas")) {
        renderizarMaquinas();
    }

    if (document.getElementById("listaUsuarios")) {
        renderizarUsuarios();
    }

    if (document.getElementById("listaAverias")) {
        renderizarAverias();
    }

    if (document.getElementById("listaTareas")) {
        renderizarTareas();
    }

    if (document.getElementById("calendar-title") &&
        document.getElementById("calendar-title")) {
        renderCalendar();
    }

    verificarSesion();
    mostrarMenu();
    cargarUsuariosGestionUsuarios();
    cargarUsuariosGestionSeguridad();
    mostrarUsuarioActual();
});

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    calendarTitle.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarBody.innerHTML = "";

    let row = document.createElement('tr');
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('td');
        cell.textContent = day;
        row.appendChild(cell);

        if ((firstDay + day - 1) % 7 === 6 || day === daysInMonth) {
            calendarBody.appendChild(row);
            row = document.createElement('tr');
        }
    }
}

function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderCalendar();
}

function verificarSesion() {
    let usuarioActual = localStorage.getItem("usuarioActual");
    
    if (!usuarioActual) {
        alert("No has iniciado sesión. Redirigiendo al login...");
        window.location.href = "login.html";
    }
}

function cerrarSesion() {
    // Eliminar datos de sesión del localStorage
    localStorage.removeItem("usuarioActual");
    localStorage.removeItem("tokenSesion");

    // Intentar redirigir con un pequeño retraso para evitar restricciones del navegador
    setTimeout(() => {
        window.location.replace("login.html");
    }, 100);
}

function renderizarUsuarios() {
    const lista = document.getElementById("listaUsuarios");
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    lista.innerHTML = ""; // Limpiar la lista

    usuarios.forEach(usuario => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="usuario-header" onclick="toggleUsuario(${usuario.id})">
                <strong>${usuario.nombre}</strong>
                <span class="rol">${usuario.rol}</span>
            </div>
            <div class="usuario-detalles" id="detalles-${usuario.id}">
                <button class="btn btn-primary" onclick="abrirFormularioRol('${usuario.nombre}')">Asignar Rol</button>
                <button class="btn btn-primary" onclick="abrirFormularioMaquinas('${usuario.nombre}')">Asignar Máquina</button>
                <button class="btn btn-primary" onclick="abrirFormularioVacaciones('${usuario.nombre}')">Establecer Vacaciones</button>
                <button id="botonBaja" class="btn btn-danger" onclick="darBajaUsuario('${usuario.nombre}')">
                    Dar de Baja
                </button>
            </div>
        `;
        lista.appendChild(li);
    });
}

function abrirModal(titulo, contenidoHTML) {
    const modalElement = document.getElementById("modalDinamico");

    document.getElementById("modalDinamicoLabel").textContent = titulo;
    document.getElementById("contenidoModal").innerHTML = contenidoHTML;

    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (!modalInstance) {
        modalInstance = new bootstrap.Modal(modalElement);
    }
    modalInstance.show();
}

function filtrarUsuariosGestionUsuarios() {
    const filtro = document.getElementById("buscadorUsuarios").value.toLowerCase();
    const lista = document.getElementById("listaUsuarios").children;
    for (const usuario of lista) {
        const nombre = usuario.querySelector(".usuario-header").innerText.toLowerCase();
        usuario.style.display = nombre.includes(filtro) ? "" : "none";
    }
}

function filtrarUsuariosGestionSeguridad() {
    let filtro = document.getElementById("buscadorUsuarios").value.toLowerCase();
    let select = document.getElementById("seleccionarUsuario");
    let lista = document.getElementById("listaUsuariosFiltrados");

    select.innerHTML = '<option value="">Selecciona un usuario...</option>';
    lista.innerHTML = "";

    let coincidencias = usuarios.filter(usuario => usuario.toLowerCase().includes(filtro));

    // Si hay coincidencias, muestra la lista
    if (coincidencias.length > 0) {
        lista.classList.remove("d-none");
    } else {
        lista.classList.add("d-none");
    }

    coincidencias.forEach(usuario => {
        // Agregar al <select>
        let option = document.createElement("option");
        option.value = usuario;
        option.textContent = usuario;
        select.appendChild(option);

        // Agregar a la lista filtrada
        let li = document.createElement("li");
        li.textContent = usuario;
        li.classList.add("list-group-item", "list-group-item-action");
        li.onclick = function() {
            document.getElementById("buscadorUsuarios").value = usuario;
            select.value = usuario;
            actualizarUsuarioSeleccionado();
            lista.classList.add("d-none"); // Ocultar la lista después de seleccionar
        };
        lista.appendChild(li);
    });
}


function toggleUsuario(id) {
    const detalles = document.getElementById(`detalles-${id}`);
    detalles.classList.toggle("activo");
}

function abrirFormularioMaquinas(usuario) {
    const contenido = `
        <h5>Asignar Máquina a ${usuario}</h5>
        <form id="formMaquina">
            <div class="mb-3">
                <label for="maquina" class="form-label">Máquina:</label>
                <input type="text" id="maquina" class="form-control" placeholder="ID o Nombre de la Máquina">
            </div>
            <div class="mb-3">
                <label for="permiso" class="form-label">Permiso:</label>
                <select id="permiso" class="form-select">
                    <option value="Lectura">Lectura</option>
                    <option value="Escritura">Escritura</option>
                    <option value="Administrador">Administrador</option>
                </select>
            </div>
            <button type="button" class="btn btn-primary" onclick="asignarMaquina('${usuario}')">Guardar</button>
        </form>
    `;
    abrirModal("Asignar Máquina", contenido);
}


function abrirFormularioRol(usuario) {
    const contenido = `
        <h5>Asignar Rol a ${usuario}</h5>
        <form id="formRol">
            <div class="mb-3">
                <label for="rol" class="form-label">Rol:</label>
                <select id="rol" class="form-select">
                    <option value="Administrador">Administrador</option>
                    <option value="Operario">Operario</option>
                    <option value="Mecánico">Mecánico</option>
                </select>
            </div>
            <button type="button" class="btn btn-primary" onclick="asignarRol('${usuario}')">Guardar</button>
        </form>
    `;
    abrirModal("Asignar Rol", contenido);
}


function abrirFormularioVacaciones(usuario) {
    const contenido = `
        <h5>Establecer Vacaciones para ${usuario}</h5>
        <form id="formVacaciones">
            <div class="mb-3">
                <label for="inicioVacaciones" class="form-label">Inicio:</label>
                <input type="date" id="inicioVacaciones" class="form-control">
            </div>
            <div class="mb-3">
                <label for="finVacaciones" class="form-label">Fin:</label>
                <input type="date" id="finVacaciones" class="form-control">
            </div>
            <button type="button" class="btn btn-primary" onclick="establecerVacaciones('${usuario}')">Guardar</button>
        </form>
    `;
    abrirModal("Establecer Vacaciones", contenido);
}


function darBajaUsuario(usuarioNombre) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (confirm(`¿Seguro que quieres dar de baja a ${usuarioNombre}? Esta acción no se puede deshacer.`)) {
        usuarios = usuarios.filter(usuario => usuario.nombre !== usuarioNombre);

        // Guardar cambios en localStorage
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        // Volver a renderizar la lista de usuarios
        renderizarUsuarios();

        mostrarAlerta(`El usuario "${usuarioNombre}" ha sido dado de baja correctamente.`, "danger");
    }
}

function cerrarModal() {
    const modalElement = document.getElementById("modalDinamico");

    if (!modalElement) {
        console.error("No se encontró el modal.");
        return;
    }

    const modalInstance = bootstrap.Modal.getInstance(modalElement);

    if (modalInstance) {
        modalInstance.hide(); // 🔹 Cierra el modal correctamente
    } else {
        console.warn("El modal no estaba inicializado, se cerrará manualmente.");
        modalElement.classList.remove("show");
        modalElement.style.display = "none";
        document.body.classList.remove("modal-open");

        // Eliminar backdrop si no se cerró automáticamente
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) {
            backdrop.remove();
        }
    }
}


function asignarRol(usuario) {
    const rol = document.getElementById("rol").value;
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    let usuarioIndex = usuarios.findIndex(u => u.nombre === usuario);
    if (usuarioIndex !== -1) {
        usuarios[usuarioIndex].rol = rol;
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        mostrarAlerta(`Rol "${rol}" asignado a ${usuario}.`, "success");
        renderizarUsuarios();
    }

    cerrarModal();
}

function asignarMaquina(usuario) {
    const maquina = document.getElementById("maquina").value;
    const permiso = document.getElementById("permiso").value;

    mostrarAlerta(`Máquina "${maquina}" asignada a ${usuario} con permiso "${permiso}".`, "success");
    cerrarModal();
}

function establecerVacaciones(usuario) {
    const inicio = document.getElementById("inicioVacaciones").value;
    const fin = document.getElementById("finVacaciones").value;

    mostrarAlerta(`Vacaciones asignadas a ${usuario} desde ${inicio} hasta ${fin}.`, "success");
    cerrarModal();
}

function cambiarContrasenaModal() {
    const nueva = document.getElementById("nuevaContrasenaModal").value.trim();
    const confirmar = document.getElementById("confirmarContrasenaModal").value.trim();
    // ... validaciones y lógica ...
}

function cambiarContrasenaActual() {
    const contrasenaActual = document.getElementById("contrasenaActual").value.trim();
    const nueva = document.getElementById("nuevaContrasenaActual").value.trim();
    const confirmar = document.getElementById("confirmarContrasenaActual").value.trim();
    const alerta = document.getElementById("alertaContrasena");

    let usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let usuarioIndex = usuarios.findIndex(u => u.username === usuarioActual.username);

    if (usuarioIndex === -1) {
        mostrarAlerta("❌ Error: Usuario no encontrado.", "danger");
        return;
    }

    if (!contrasenaActual || !nueva || !confirmar) {
        mostrarAlerta("⚠️ Todos los campos son obligatorios.", "warning");
        return;
    }

    // Verifica si la contraseña actual es correcta
    if (usuarios[usuarioIndex].password !== contrasenaActual) {
        mostrarAlerta("❌ La contraseña actual es incorrecta.", "danger");
        return;
    }

    // Validar requisitos de la nueva contraseña
    if (nueva.length < 4 || !/(?=.*[A-Za-z])(?=.*\d)/.test(nueva)) {
        mostrarAlerta("⚠️ La nueva contraseña debe tener al menos 4 caracteres, incluyendo una letra y un número.", "warning");
        return;
    }

    if (nueva !== confirmar) {
        mostrarAlerta("❌ Las contraseñas no coinciden.", "danger");
        return;
    }

    // Guardar la nueva contraseña
    usuarios[usuarioIndex].password = nueva;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // Mostrar mensaje de éxito
    mostrarAlerta("✅ Contraseña cambiada correctamente.", "success");

    // Limpiar los campos después de un cambio exitoso
    document.getElementById("contrasenaActual").value = "";
    document.getElementById("nuevaContrasenaActual").value = "";
    document.getElementById("confirmarContrasenaActual").value = "";
}

function mostrarAlertaModal(mensaje, tipo) {
    const alerta = document.getElementById("alertaContrasena");
    document.getElementById("formCambioContrasena").after(alerta);
    
    alerta.textContent = mensaje;
    alerta.className = `alert alert-${tipo} mt-3`;
    alerta.classList.remove("d-none");

    setTimeout(() => {
        alerta.classList.add("d-none");
    }, 3000);
}

function ocultarAlertaModal() {
    const alerta = document.getElementById("alertaContrasenaModal");
    alerta.innerHTML = "";
    alerta.classList.add("d-none");
}

function abrirChat() {
    alert("Abrir chat con usuarios (Por implementar).");
}

function abrirFormularioAltaUsuario() {
    document.getElementById("modalDinamicoLabel").textContent = "Dar de Alta Usuario";
    document.getElementById("contenidoModal").innerHTML = `
        <h5>Datos del Nuevo Usuario</h5>
        <form id="formAlta">
            <div class="mb-3">
                <label for="nombreAlta" class="form-label">Nombre Completo:</label>
                <input type="text" id="nombreAlta" class="form-control" placeholder="Ej: Juan Pérez" required>
            </div>

            <div class="mb-3">
                <label for="usernameAlta" class="form-label">Nombre de Usuario:</label>
                <input type="text" id="usernameAlta" class="form-control" placeholder="Ej: juanp" required>
            </div>

            <div class="mb-3">
                <label for="passwordAlta" class="form-label">Contraseña:</label>
                <input type="password" id="passwordAlta" class="form-control" placeholder="Ingrese una contraseña" required>
            </div>

            <div class="mb-3">
                <label for="rolAlta" class="form-label">Rol:</label>
                <select id="rolAlta" class="form-select">
                    <option value="Administrador">Administrador</option>
                    <option value="Operario">Operario</option>
                    <option value="Mecánico">Mecánico</option>
                </select>
            </div>

            <button type="button" class="btn btn-primary" onclick="darAltaUsuario()">Guardar</button>
        </form>
    `;

    // Abrir modal de Bootstrap
    let modalInstance = new bootstrap.Modal(document.getElementById("modalDinamico"));
    modalInstance.show();
}

function darAltaUsuario() {
    const nombre = document.getElementById("nombreAlta").value.trim();
    const username = document.getElementById("usernameAlta").value.trim();
    const password = document.getElementById("passwordAlta").value.trim();
    const rol = document.getElementById("rolAlta").value;

    if (!nombre || !username || !password) {
        mostrarAlerta("Por favor, completa todos los campos obligatorios.", "danger");
        return;
    }

    // Obtener usuarios del localStorage o inicializar un array vacío
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verificar si el nombre de usuario ya existe
    if (usuarios.some(u => u.username === username)) {
        mostrarAlerta("El nombre de usuario ya está en uso. Elige otro.", "warning");
        return;
    }

    // Agregar el nuevo usuario
    const nuevoUsuario = {
        id: usuarios.length ? Math.max(...usuarios.map(u => u.id)) + 1 : 1, // ID único
        nombre,
        username,
        password, // ⚠ Guardar en texto plano NO es seguro. Debería encriptarse si usas un backend.
        rol
    };

    usuarios.push(nuevoUsuario);

    // Guardar en localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // Confirmación y actualización de la lista de usuarios
    mostrarAlerta(`Usuario "${nombre}" dado de alta con el rol "${rol}".`, "success");
    renderizarUsuarios();

    // Cerrar el modal
    cerrarModal();
}

function abrirChat() {
    const chatVentana = document.getElementById("chatVentana");
    chatVentana.style.display = "block";
}

function cerrarChat() {
    const chatVentana = document.getElementById("chatVentana");
    chatVentana.style.display = "none";
}

function enviarMensaje() {
    const mensajeInput = document.getElementById("mensajeInput");
    const chatCuerpo = document.querySelector(".chat-cuerpo");
    const mensaje = mensajeInput.value.trim();

    if (mensaje) {
        chatCuerpo.innerHTML += `
            <div class="mensaje">
                <strong>Tú:</strong> ${mensaje}
            </div>
        `;
        mensajeInput.value = "";
        chatCuerpo.scrollTop = chatCuerpo.scrollHeight; // Desplazar hacia el final
    }
}

function renderizarMaquinas() {
    const lista = document.getElementById("listaMaquinas");

    // Obtener las máquinas desde localStorage o inicializar con un array vacío
    let maquinas = JSON.parse(localStorage.getItem("maquinas")) || [];

    lista.innerHTML = ""; // Limpiar la lista antes de renderizar

    maquinas.forEach(maquina => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="maquina-header" onclick="toggleMaquina(${maquina.id})">
                <strong>${maquina.nombre}</strong>
                <div class="d-flex align-items-center">
                    <small id="estadoEtiqueta-${maquina.id}" class="px-2 py-1 fw-semibold ${maquina.estado.toLowerCase() === 'funcionando' ? 'text-success-emphasis bg-success-subtle border border-success-subtle' : 'text-danger-emphasis bg-danger-subtle border border-danger-subtle'} rounded-2">
                        ${maquina.estado}
                    </small>
                </div>
            </div>
            
            <div class="maquina-detalles" id="detalles-${maquina.id}">
                - Tipo: ${maquina.tipo}<br>
                - Trabajo: ${maquina.trabajo}<br>
                - Modelo/Marca: ${maquina.modelo}<br>
                - Fecha Último Mantenimiento: ${maquina.fechaMantenimiento}<br>
                - Realizado por: ${maquina.realizadoPor}
                <br><br>
                <button class="btn btn-primary" onclick="mostrarImagen('${maquina.imagen}')">Mostrar Imagen</button>
                <button class="btn btn-primary" onclick="editarMaquina(${maquina.id})">Editar Detalles</button>
                <button id="botonBaja" class="btn btn-danger" onclick="darBajaMaquina('${maquina.nombre}')">Dar de Baja</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

function mostrarImagen(imagenBase64) {
    document.getElementById("imagenModal").src = imagenBase64;
    let modalInstance = new bootstrap.Modal(document.getElementById("modalImagen"));
    modalInstance.show();
}

function editarMaquina(id) {
    let maquinas = JSON.parse(localStorage.getItem("maquinas")) || [];
    let maquina = maquinas.find(m => m.id === id);

    abrirFormularioAltaMaquina(id);
    document.getElementById("nombreAlta").value = maquina.nombre;
    document.getElementById("tipoMaquina").value = maquina.tipo;
    document.getElementById("trabajoMaquina").value = maquina.trabajo;
    document.getElementById("modeloMaquina").value = maquina.modelo;
    document.getElementById("fechaMantenimiento").value = maquina.fechaMantenimiento;
    document.getElementById("realizadoPor").value = maquina.realizadoPor;
    document.getElementById("estadoAlta").value = maquina.estado;
}

function filtrarMaquinas() {
    const filtro = document.getElementById("buscadorMaquinas").value.toLowerCase();
    const lista = document.getElementById("listaMaquinas").children;
    for (const maquina of lista) {
        const nombre = maquina.querySelector(".maquina-header").innerText.toLowerCase();
        maquina.style.display = nombre.includes(filtro) ? "" : "none";
    }
}

function toggleMaquina(id) {
    const detalles = document.getElementById(`detalles-${id}`);
    detalles.classList.toggle("activo");
}

function abrirFormularioAltaMaquina(id = null) {
    let maquinas = JSON.parse(localStorage.getItem("maquinas")) || [];
    let maquina = id ? maquinas.find(m => m.id === id) : null;

    maquinaEditandoId = id;

    let modalElement = document.getElementById("modalDinamico");
    
    if (!modalElement) {
        console.error("Error: No se encontró el modal en el DOM.");
        return;
    }

    document.getElementById("modalDinamicoLabel").textContent = "Dar de Alta Máquina";
    document.getElementById("contenidoModal").innerHTML = `
        <h5 class="mb-3">Datos de la Nueva Máquina</h5>
        <form id="formAltaMaquina">
            <div class="mb-3">
                <label for="nombreAlta" class="form-label">Nombre:</label>
                <input type="text" id="nombreAlta" class="form-control" placeholder="Nombre de la máquina" required>
            </div>

            <div class="mb-3">
                <label for="tipoMaquina" class="form-label">Tipo:</label>
                <input type="text" id="tipoMaquina" class="form-control" placeholder="Tipo de máquina" required value="${maquina ? maquina.tipo : ''}">
            </div>

            <div class="mb-3">
                <label for="trabajoMaquina" class="form-label">Trabajo:</label>
                <input type="text" id="trabajoMaquina" class="form-control" placeholder="Tipo de trabajo" required value="${maquina ? maquina.trabajo : ''}">
            </div>

            <div class="mb-3">
                <label for="modeloMaquina" class="form-label">Modelo/Marca:</label>
                <input type="text" id="modeloMaquina" class="form-control" placeholder="Modelo o marca" required value="${maquina ? maquina.modelo : ''}">
            </div>

            <div class="mb-3">
                <label for="fechaMantenimiento" class="form-label">Fecha Último Mantenimiento:</label>
                <input type="date" id="fechaMantenimiento" class="form-control" required value="${maquina ? maquina.fechaMantenimiento : ''}">
            </div>

            <div class="mb-3">
                <label for="realizadoPor" class="form-label">Realizado por:</label>
                <input type="text" id="realizadoPor" class="form-control" placeholder="Nombre del responsable" required value="${maquina ? maquina.realizadoPor : ''}">
            </div>
            
            <div class="mb-3">
                <label for="estadoAlta" class="form-label">Estado:</label>
                <select id="estadoAlta" class="form-select" required>
                    <option value="Funcionando" ${maquina && maquina.estado === "Funcionando" ? "selected" : ""}>Funcionando</option>
                    <option value="Averiada" ${maquina && maquina.estado === "Averiada" ? "selected" : ""}>Averiada</option>
                </select>
            </div>

            <div class="mb-3">
                <label for="imagenMaquina" class="form-label">Imagen:</label>
                <input type="file" id="imagenMaquina" class="form-control" accept="image/*" onchange="convertirImagenBase64(this)">
                <input type="hidden" id="imagenBase64" value="${maquina && maquina.imagen ? maquina.imagen : ''}">
            </div>
            <input type="hidden" id="imagenBase64">

            <div class="d-flex justify-content-between">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" onclick="guardarMaquina()">Guardar</button>
            </div>
        </form>
    `;

    let modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modalInstance.show();
}

function guardarMaquina() {
    let maquinas = JSON.parse(localStorage.getItem("maquinas")) || [];

    const nombre = document.getElementById("nombreAlta").value.trim();
    const tipo = document.getElementById("tipoMaquina").value.trim();
    const trabajo = document.getElementById("trabajoMaquina").value.trim();
    const modelo = document.getElementById("modeloMaquina").value.trim();
    const fechaMantenimiento = document.getElementById("fechaMantenimiento").value;
    const realizadoPor = document.getElementById("realizadoPor").value.trim();
    const estado = document.getElementById("estadoAlta").value;
    const imagenBase64 = document.getElementById("imagenBase64").value; // Imagen cargada

    if (!nombre || !tipo || !trabajo || !modelo || !realizadoPor) {
        mostrarAlerta("Completa todos los campos.", "danger");
        return;
    }

    if (maquinaEditandoId !== null) {
        let maquina = maquinas.find(m => m.id === maquinaEditandoId);
        if (maquina) {
            maquina.nombre = nombre;
            maquina.tipo = tipo;
            maquina.trabajo = trabajo;
            maquina.modelo = modelo;
            maquina.fechaMantenimiento = fechaMantenimiento;
            maquina.realizadoPor = realizadoPor;
            maquina.estado = estado;
            if (imagenBase64) {
                maquina.imagen = imagenBase64;
            }
        }
    } else {
        maquinas.push({
            id: maquinas.length ? Math.max(...maquinas.map(m => m.id)) + 1 : 1,
            nombre, tipo, trabajo, modelo, fechaMantenimiento, realizadoPor, estado, imagen: imagenBase64
        });
    }

    localStorage.setItem("maquinas", JSON.stringify(maquinas));
    maquinaEditandoId = null; // Resetear variable de edición
    renderizarMaquinas();
    cerrarModal();
}

function convertirImagenBase64(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("imagenBase64").value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function darBajaMaquina(maquinaNombre) {
    if (confirm(`¿Estás seguro de que quieres dar de baja la máquina "${maquinaNombre}"? Esta acción eliminará la máquina de la lista.`)) {
        // Obtener las máquinas del localStorage
        let maquinas = JSON.parse(localStorage.getItem("maquinas")) || [];

        // Filtrar la lista para eliminar la máquina
        maquinas = maquinas.filter(maquina => maquina.nombre !== maquinaNombre);

        // Guardar la lista actualizada en localStorage
        localStorage.setItem("maquinas", JSON.stringify(maquinas));

        // Volver a renderizar la lista
        renderizarMaquinas();

        // Mostrar mensaje de éxito
        mostrarAlerta(`La máquina "${maquinaNombre}" ha sido dada de baja correctamente.`, "danger");
    }
}

function mostrarAlerta(mensaje, tipo, permanente = false) {
    const main = document.querySelector("main");
    let alertContainer = document.getElementById("alert-container");

    // Si el contenedor no existe, lo creamos dentro del main
    if (!alertContainer) {
        alertContainer = document.createElement("div");
        alertContainer.id = "alert-container";
        main.prepend(alertContainer); // Insertamos al inicio del main
    }

    // Crear la alerta de Bootstrap
    const alerta = document.createElement("div");
    alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
    alerta.role = "alert";
    alerta.style.width = "100%"; // Asegurar ancho
    alerta.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Si es permanente, limpiamos antes de agregar la nueva alerta
    if (permanente) {
        alertContainer.innerHTML = "";
    }

    // Insertamos la alerta en el contenedor
    alertContainer.appendChild(alerta);

    // Si no es permanente, eliminamos la alerta después de 3 segundos
    if (!permanente) {
        setTimeout(() => {
            if (alerta && alerta.parentNode) {
                alerta.remove();
            }
        }, 3000);
    }
}

function darAltaMaquina() {
    const nombre = document.getElementById("nombreAlta").value.trim();
    const tipo = document.getElementById("tipoMaquina").value.trim();
    const trabajo = document.getElementById("trabajoMaquina").value.trim();
    const modelo = document.getElementById("modeloMaquina").value.trim();
    const fechaMantenimiento = document.getElementById("fechaMantenimiento").value;
    const realizadoPor = document.getElementById("realizadoPor").value.trim();
    const estado = document.getElementById("estadoAlta").value;
    const imagenBase64 = document.getElementById("imagenBase64").value;

    if (!nombre || !tipo || !trabajo || !modelo || !realizadoPor) {
        mostrarAlerta("Por favor, completa todos los campos obligatorios.", "danger");
        return;
    }

    let maquinas = JSON.parse(localStorage.getItem("maquinas")) || [];

    const nuevaMaquina = {
        id: maquinas.length ? Math.max(...maquinas.map(m => m.id)) + 1 : 1, 
        nombre,
        tipo,
        trabajo,
        modelo,
        fechaMantenimiento,
        realizadoPor,
        estado,
        imagen: imagenBase64
    };

    maquinas.push(nuevaMaquina);
    localStorage.setItem("maquinas", JSON.stringify(maquinas));

    mostrarAlerta(`La máquina "${nombre}" ha sido dada de alta correctamente.`, "success");
    renderizarMaquinas();
    cerrarModal();
}

function mostrarMenu() {
    const menuHTML = `
        <nav class="d-flex justify-content-center">
            <ul class="nav">
                <a href="pagina-principal.html" target="_self">Página principal</a>
                <a href="maquinas.html" target="_self">Gestión de Máquinas</a>
                <a href="averias.html" target="_self">Gestión de Averías</a>
                <a href="tareas.html" target="_self">Gestión de Tareas</a>
                <a href="usuarios.html" target="_self">Gestión de Usuarios</a>
                <a href="seguridad.html" target="_self">Gestión de Seguridad</a>
                <a href="#" onclick="cerrarSesion()" title="Cerrar sesión">
                    <img src="img/log-out.png" alt="Cerrar sesión" style="width: 30px; height: 30px; filter: invert(1);">
                </a>
            </ul>
        </nav>
    `;

    // Insertar el menú en el lugar donde queremos mostrarlo
    document.getElementById("menu-container").innerHTML = menuHTML;
}

function renderizarAverias() {
    const listaAverias = document.getElementById("listaAverias");

    // Obtener averías desde localStorage o inicializar con un array vacío
    let averias = JSON.parse(localStorage.getItem("averias")) || [];

    listaAverias.innerHTML = ""; // Limpiar la lista antes de renderizar

    averias.forEach(averia => {
        const listItem = document.createElement("li");
        listItem.className = averia.resuelta ? "resolved" : "";

        const detalles = document.createElement("div");
        detalles.className = "detalleAveria";
        detalles.innerHTML = `
            <h3>Detalle de la Avería</h3>
            <p><strong>Máquina:</strong> ${averia.maquina}</p>
            <p><strong>Descripción:</strong> ${averia.descripcion}</p>
            <p><strong>Acciones sugeridas:</strong> ${averia.acciones}</p>
            <p><strong>Estado:</strong> ${averia.resuelta ? "Arreglada" : "Pendiente"}</p>
            ${!averia.resuelta ? `<button onclick="marcarComoCorregida(${averia.id})">Marcar como corregida</button>` : ""}
        `;
        listItem.innerHTML = `
            <div>
                <strong><a href="#" onclick="irAMaquina('${averia.maquina}')">${averia.maquina}</a></strong> - 
                <a href="#" onclick="verDetalle(${averia.id}, this)">${averia.descripcion}</a>
            </div>
            <span>${averia.resuelta ? "Corregida" : "Sin corregir"}</span>
        `;
        listItem.appendChild(detalles);
        listaAverias.appendChild(listItem);
    });

    console.log("Averías renderizadas:", averias); // Debug en consola
}

function irAMaquina(maquina) {
    alert(`Página de la máquina: ${maquina}.`);
}

function verDetalle(id, link) {
    const detalles = link.closest("li").querySelector(".detalleAveria");
    detalles.classList.toggle("activo");
}

function mostrarFormularioAveria() {
    document.getElementById("modal").style.display = "block";
}

function agregarAveria() {
    const maquina = document.getElementById("maquina").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const acciones = document.getElementById("acciones").value.trim();

    if (!maquina || !descripcion || !acciones) {
        mostrarAlerta("Completa todos los campos.", "danger");
        return;
    }

    // Obtener averías del localStorage o inicializar con un array vacío
    let averias = JSON.parse(localStorage.getItem("averias")) || [];

    // Agregar la nueva avería
    const nuevaAveria = {
        id: averias.length ? Math.max(...averias.map(a => a.id)) + 1 : 1, // ID único
        maquina,
        descripcion,
        acciones,
        resuelta: false
    };

    averias.push(nuevaAveria);

    // Guardar en localStorage
    localStorage.setItem("averias", JSON.stringify(averias));

    // Renderizar lista actualizada
    renderizarAverias();

    // Cerrar el modal y mostrar mensaje de éxito
    cerrarModal();
    mostrarAlerta("Avería añadida correctamente.", "success");
}


function marcarComoCorregida(id) {
    // Obtener averías desde localStorage
    let averias = JSON.parse(localStorage.getItem("averias")) || [];

    // Buscar la avería por ID y actualizar su estado
    const averiaIndex = averias.findIndex(a => a.id === id);
    if (averiaIndex !== -1) {
        averias[averiaIndex].resuelta = true;

        // Guardar cambios en localStorage
        localStorage.setItem("averias", JSON.stringify(averias));

        // Renderizar lista actualizada
        renderizarAverias();

        // Mostrar mensaje de éxito
        mostrarAlerta("Avería marcada como corregida.", "success");
    }
}

function renderizarTareas() {
    const listaTareas = document.getElementById("listaTareas");

    if (!listaTareas) {
        console.error("No se encontró el elemento con id 'listaTareas'");
        return;
    }

    let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

    listaTareas.innerHTML = "";

    if (tareas.length === 0) {
        listaTareas.innerHTML = "<p>No hay tareas disponibles.</p>";
        return;
    }

    tareas.forEach(tarea => {
        const listItem = document.createElement("li");
        listItem.className = tarea.estado;

        listItem.innerHTML = `
            <div>
                <strong><a href="tarea.html?id=${tarea.id}">${tarea.nombre}</a></strong> 
                (Asignado a: ${tarea.usuario})
            </div>
            <span>Estado: ${tarea.estado.charAt(0).toUpperCase() + tarea.estado.slice(1)}</span>
        `;

        listaTareas.appendChild(listItem);
    });

    console.log("Tareas renderizadas correctamente:", tareas);
}

function mostrarUsuarioActual() {
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
    if (usuarioActual) {
        document.getElementById("nombreUsuarioActual").textContent = usuarioActual.username;
    }
}

function cargarUsuariosGestionUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const select = document.getElementById("seleccionarUsuario");

    select.innerHTML = ""; // Limpiar opciones previas
    usuarios.forEach(usuario => {
        const option = document.createElement("option");
        option.value = usuario.username;
        option.textContent = usuario.nombre;
        select.appendChild(option);
    });
}

function cargarUsuariosGestionSeguridad() {
    let select = $('#seleccionarUsuario');
    select.empty().append('<option value="">Selecciona un usuario...</option>');

    usuarios.forEach(usuario => {
        select.append($('<option>', {
            value: usuario.id,  // Usamos el ID como valor
            text: usuario.nombre // Mostramos el nombre en la lista
        }));
    });

    // Si hay un usuario preseleccionado, actualizar su nombre en los modales
    actualizarUsuarioSeleccionado();
}

$(document).ready(function() {
    $('#seleccionarUsuario').select2({
        placeholder: "Escribe para buscar...",
        allowClear: true
    });

    cargarUsuariosGestionSeguridad(); 
});

function cargarDatosUsuario() {
    const usuarioSeleccionado = document.getElementById("seleccionarUsuario").value;
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(u => u.username === usuarioSeleccionado);

    if (usuario) {
        document.getElementById("nuevoRol").value = usuario.rol;
        document.getElementById("permisoModificarMaquinas").checked = usuario.permisos?.modificarMaquinas || false;
        document.getElementById("permisoGestionarAverias").checked = usuario.permisos?.gestionarAverias || false;
        document.getElementById("permisoGestionarTareas").checked = usuario.permisos?.gestionarTareas || false;
    }
}

function guardarSeguridadUsuario() {
    const usuarioSeleccionado = document.getElementById("seleccionarUsuario").value;
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let usuarioIndex = usuarios.findIndex(u => u.username === usuarioSeleccionado);

    if (usuarioIndex !== -1) {
        usuarios[usuarioIndex].rol = document.getElementById("nuevoRol").value;
        usuarios[usuarioIndex].permisos = {};

        document.querySelectorAll("#permisos .form-check-input").forEach(input => {
            usuarios[usuarioIndex].permisos[input.id] = input.checked;
        });

        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        mostrarAlerta("Roles y permisos guardados correctamente.", "success");
    }
}

function forzarCambioContrasena() {
    const usuarioSeleccionado = document.getElementById("seleccionarUsuario").value;
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let usuarioIndex = usuarios.findIndex(u => u.username === usuarioSeleccionado);

    if (usuarioIndex !== -1) {
        usuarios[usuarioIndex].cambioContrasenaRequerido = true;
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        mostrarAlerta(`Se ha obligado a ${usuarios[usuarioIndex].nombre} a cambiar su contraseña.`, "warning");
    }
}

function actualizarPermisos() {
    const rol = document.getElementById("nuevoRol").value;
    const permisos = {
        mecanico: ["permisoAñadirAverias", "permisoModificarAverias", "permisoBorrarAverias", "permisoMarcarAveriaResuelta"],
        operario: ["permisoAñadirTareas", "permisoModificarTareas", "permisoBorrarTareas"],
        administrador: [
            "permisoAñadirMaquinas", "permisoModificarMaquinas", "permisoBorrarMaquinas",
            "permisoAñadirAverias", "permisoModificarAverias", "permisoBorrarAverias", "permisoMarcarAveriaResuelta",
            "permisoAñadirTareas", "permisoModificarTareas", "permisoBorrarTareas",
            "permisoAñadirUsuarios", "permisoModificarUsuarios", "permisoBorrarUsuarios"
        ]
    };

    document.querySelectorAll("#permisos .form-check-input").forEach(input => {
        input.checked = permisos[rol].includes(input.id);
    });
}

function actualizarUsuarioSeleccionado() {
    let select = document.getElementById("seleccionarUsuario");
    let usuarioSeleccionadoID = select.value; // Obtiene el ID del usuario seleccionado

    // Busca el usuario en la lista basada en el ID
    let usuario = usuarios.find(u => u.id == usuarioSeleccionadoID);

    if (usuario) {
        console.log("Usuario seleccionado:", usuario.nombre); // Depuración

        // Asegurar que los elementos existen antes de actualizar
        let usuarioCambio = document.getElementById("usuarioCambio");
        let usuarioForzar = document.getElementById("usuarioForzarCambio");

        if (usuarioCambio) {
            usuarioCambio.textContent = usuario.nombre;
        }
        if (usuarioForzar) {
            usuarioForzar.textContent = usuario.nombre;
        }
    } else {
        console.warn("No se encontró el usuario seleccionado.");

        let usuarioCambio = document.getElementById("usuarioCambio");
        let usuarioForzar = document.getElementById("usuarioForzarCambio");

        if (usuarioCambio) {
            usuarioCambio.textContent = "Usuario no seleccionado";
        }
        if (usuarioForzar) {
            usuarioForzar.textContent = "Usuario no seleccionado";
        }
    }
}


function guardarForzarCambio() {
    let usuario = document.getElementById("seleccionarUsuario").value;
    let forzar = document.getElementById("forzarCambioContrasena").checked;

    if (!usuario) {
        alert("Selecciona un usuario primero.");
        return;
    }

    if (!forzar) {
        alert("Debes seleccionar la casilla antes de confirmar.");
        return;
    }

    alert(`El usuario "${usuario}" ahora está obligado a cambiar su contraseña en el próximo inicio.`);
}

function habilitarBotonConfirmar() {
    let checkbox = document.getElementById("forzarCambioContrasena");
    let boton = document.getElementById("btnConfirmarForzarCambio");
    boton.disabled = !checkbox.checked;
}

document.getElementById("forzarCambioContrasena").addEventListener("change", habilitarBotonConfirmar);




