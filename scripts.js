// -----------------------
// Variables y constantes globales
// -----------------------
const calendarTitle = document.getElementById('calendar-title');
const calendarBody = document.getElementById('calendar-body');
let currentDate = new Date();

const permisosDisponibles = [
    "permisoAñadirMaquinas",
    "permisoModificarMaquinas",
    "permisoBorrarMaquinas",
    "permisoAñadirAverias",
    "permisoModificarAverias",
    "permisoBorrarAverias",
    "permisoMarcarAveriaResuelta",
    "permisoAñadirTareas",
    "permisoModificarTareas",
    "permisoBorrarTareas",
    "permisoAñadirUsuarios",
    "permisoModificarUsuarios",
    "permisoBorrarUsuarios"
];

let usuarioSeleccionadoGlobal = null;

const usuarios = [
    { 
        id: 1, 
        nombre: "Juan Pérez", 
        username: "juanpe", 
        password: "1234", 
        rol: "Administrador",
        permisos: {
            permisoAñadirMaquinas: true,
            permisoModificarMaquinas: true,
            permisoBorrarMaquinas: true,
            permisoAñadirAverias: true,
            permisoModificarAverias: true,
            permisoBorrarAverias: true,
            permisoMarcarAveriaResuelta: true,
            permisoAñadirTareas: true,
            permisoModificarTareas: true,
            permisoBorrarTareas: true,
            permisoAñadirUsuarios: true,
            permisoModificarUsuarios: true,
            permisoBorrarUsuarios: true
        }
    },
    { 
        id: 2, 
        nombre: "Ana López", 
        username: "analopez", 
        password: "1234", 
        rol: "Operario",
        permisos: {
            permisoAñadirMaquinas: false,
            permisoModificarMaquinas: false,
            permisoBorrarMaquinas: false,
            permisoAñadirAverias: true,
            permisoModificarAverias: true,
            permisoBorrarAverias: false,
            permisoMarcarAveriaResuelta: true,
            permisoAñadirTareas: true,
            permisoModificarTareas: true,
            permisoBorrarTareas: false,
            permisoAñadirUsuarios: false,
            permisoModificarUsuarios: false,
            permisoBorrarUsuarios: false
        }
    },
    { 
        id: 3, 
        nombre: "Luis García", 
        username: "luisgarcia", 
        password: "1234", 
        rol: "Mecánico",
        permisos: {
            permisoAñadirMaquinas: false,
            permisoModificarMaquinas: false,
            permisoBorrarMaquinas: false,
            permisoAñadirAverias: true,
            permisoModificarAverias: true,
            permisoBorrarAverias: false,
            permisoMarcarAveriaResuelta: true,
            permisoAñadirTareas: false,
            permisoModificarTareas: false,
            permisoBorrarTareas: false,
            permisoAñadirUsuarios: false,
            permisoModificarUsuarios: false,
            permisoBorrarUsuarios: false
        }
    }
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
        estado: "Funcionando",
        imagen: "img/excavadora3000.jpg"
    },
    {
        id: 2,
        nombre: "Grúa Industrial",
        tipo: "Grúa",
        trabajo: "Construcción",
        modelo: "Liebherr LTM",
        fechaMantenimiento: "2023-11-15",
        realizadoPor: "Ana López",
        estado: "Averiada",
        imagen: "img/gruaIndustrial.jpg"
    },
    {
        id: 3,
        nombre: "Excavadora 2500",
        tipo: "Excavadora",
        trabajo: "Excavación",
        modelo: "Caterpillar X2",
        fechaMantenimiento: "2023-12-01",
        realizadoPor: "Juan Pérez",
        estado: "Funcionando",
        imagen: "img/excavadora2500.jpg"
    }
];

let maquinaEditandoId = null;

let nextId = maquinas.length ? Math.max(...maquinas.map(m => m.id)) + 1 : 1;
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

// -----------------------
// Funciones de inicialización y renderizado
// -----------------------
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("listaMaquinas")) renderizarMaquinas();
    if (document.getElementById("listaUsuarios")) renderizarUsuarios();
    if (document.getElementById("listaUsuariosGestionSeguridad")) renderizarUsuariosGestionSeguridad();
    if (document.getElementById("listaAverias")) renderizarAverias();
    if (document.getElementById("listaTareas")) renderizarTareas();
    if (document.getElementById("calendar-title")) renderCalendar();
    
    verificarSesion();
    mostrarMenu();
    cargarUsuariosGestionUsuarios();
    cargarUsuariosGestionSeguridad();
    mostrarUsuarioActual();
});

// -----------------------
// Funciones de calendario (si se usan)
// -----------------------
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

// -----------------------
// Funciones de sesión y menú
// -----------------------
function verificarSesion() {
    // Si la URL contiene "recuperar.html", salimos sin hacer nada.
    if (window.location.href.indexOf("recuperar") !== -1) {
        return;
    }
    
    let usuarioActual = localStorage.getItem("usuarioActual");
    
    if (!usuarioActual) {
        alert("No has iniciado sesión. Redirigiendo al login...");
        window.location.href = "login.html";
    }
}


function cerrarSesion() {
    localStorage.removeItem("usuarioActual");
    localStorage.removeItem("tokenSesion");
    setTimeout(() => { window.location.replace("login.html"); }, 100);
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
    document.getElementById("menu-container").innerHTML = menuHTML;
}

function mostrarUsuarioActual() {
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
    if (usuarioActual) {
        document.getElementById("nombreUsuarioActual").textContent = usuarioActual.username;
    }
}

// -----------------------
// Funciones de renderizado de usuarios
// -----------------------
function renderizarUsuarios() {
    const lista = document.getElementById("listaUsuarios");
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    lista.innerHTML = "";
    usuarios.forEach(usuario => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="usuario-header" onclick="toggleUsuario(${usuario.id})">
                <strong>${usuario.nombre}</strong>
            </div>
            <div class="usuario-detalles" id="detalles-${usuario.id}">
                <button class="btn btn-primary" onclick="abrirFormularioVacaciones('${usuario.nombre}')">Establecer Vacaciones</button>
                                <button id="botonBaja" class="btn btn-danger" onclick="darBajaUsuario('${usuario.nombre}')">Dar de Baja</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

function renderizarUsuariosGestionSeguridad() {
    const lista = document.getElementById("listaUsuariosGestionSeguridad");
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    lista.innerHTML = "";
    usuarios.forEach(usuario => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="usuario-header" onclick="toggleUsuario(${usuario.id})">
                <strong>${usuario.nombre}</strong>
                <span class="rol">${usuario.rol}</span>
            </div>
            <div class="usuario-detalles" id="detalles-${usuario.id}">
                <button class="btn btn-primary" onclick="abrirFormularioRol('${usuario.nombre}')">Cambiar Rol</button>
                <button class="btn btn-primary" onclick="abrirModalPermisosUsuario('${usuario.nombre}')">Modificar Permisos</button>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalCambioContrasena" onclick="cambiarContrasenaDelUsuarioSeleccionado()">Cambiar Contraseña</button>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalForzarCambio">Obligar Cambio</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

// -----------------------
// Funciones para seleccionar usuario (actualiza la variable global)
// -----------------------
function toggleUsuario(id) {
    const detalles = document.getElementById(`detalles-${id}`);
    detalles.classList.toggle("activo");
    let usuariosLS = JSON.parse(localStorage.getItem("usuarios")) || [];
    let usuario = usuariosLS.find(u => u.id === id);
    if (usuario) {
        usuarioSeleccionadoGlobal = usuario;
    }
}


// -----------------------
// Funciones para formularios modales
// -----------------------
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

function asignarRol(usuario) {
    const rol = document.getElementById("rol").value;
    let usuariosLS = JSON.parse(localStorage.getItem("usuarios")) || [];
    let usuarioIndex = usuariosLS.findIndex(u => u.nombre === usuario);
    if (usuarioIndex !== -1) {
        usuariosLS[usuarioIndex].rol = rol;
        localStorage.setItem("usuarios", JSON.stringify(usuariosLS));
        mostrarAlerta(`Rol "${rol}" asignado a ${usuario}.`, "success");
        renderizarUsuariosGestionSeguridad();
    }
    cerrarModal();
}

function abrirModalPermisosUsuario(nombreUsuario) {
    document.getElementById("nombreUsuarioPermisos").textContent = nombreUsuario;
    let usuariosLS = JSON.parse(localStorage.getItem("usuarios")) || [];
    let usuario = usuariosLS.find(u => u.nombre === nombreUsuario);
    if (!usuario) {
        alert("Error: Usuario no encontrado.");
        return;
    }
    let permisosHTML = "";
    if (usuario.rol === "Operario") {
        permisosHTML += '<h6>Selecciona las máquinas a las que tendrá acceso:</h6>';
        let maquinasLS = JSON.parse(localStorage.getItem("maquinas")) || [];
        maquinasLS.forEach(maquina => {
            let checked = "";
            if (usuario.permisos && usuario.permisos.accesosMaquinas && usuario.permisos.accesosMaquinas.includes(maquina.id)) {
                checked = "checked";
            }
            permisosHTML += `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="maquina-${maquina.id}" value="${maquina.id}" ${checked}>
                <label class="form-check-label" for="maquina-${maquina.id}">${maquina.nombre}</label>
            </div>`;
        });
        permisosHTML += `<br><h6>Selecciona si el usuario tendrá acceso a:</h6>`;
        permisosHTML += `
        <div class="form-check mt-3">
            <input class="form-check-input" type="checkbox" id="notificarAveria" ${usuario.permisos && usuario.permisos.notificarAveria ? "checked" : ""}>
            <label class="form-check-label" for="notificarAveria">Notificar avería</label>
        </div>`;
    } else {
        permisosHTML = permisosDisponibles.map(permiso => `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="${permiso}" ${usuario.permisos && usuario.permisos[permiso] ? "checked" : ""}>
                <label class="form-check-label" for="${permiso}">${permiso.replace("permiso", "").replace(/([A-Z])/g, ' $1')}</label>
            </div>
        `).join("");
    }
    document.getElementById("permisosUsuario").innerHTML = permisosHTML;
    let modalInstance = new bootstrap.Modal(document.getElementById("modalPermisosUsuario"));
    modalInstance.show();
}

function guardarPermisosUsuario() {
    let nombreUsuario = document.getElementById("nombreUsuarioPermisos").textContent;
    let usuariosLS = JSON.parse(localStorage.getItem("usuarios")) || [];
    let usuario = usuariosLS.find(u => u.nombre === nombreUsuario);
    if (!usuario) {
        alert("Error: Usuario no encontrado.");
        return;
    }
    if (usuario.rol === "Operario") {
        let accesosMaquinas = [];
        let maquinasLS = JSON.parse(localStorage.getItem("maquinas")) || [];
        maquinasLS.forEach(maquina => {
            const checkbox = document.getElementById(`maquina-${maquina.id}`);
            if (checkbox && checkbox.checked) {
                accesosMaquinas.push(maquina.id);
            }
        });
        const notificarAveria = document.getElementById("notificarAveria").checked;
        usuario.permisos = {
            accesosMaquinas: accesosMaquinas,
            notificarAveria: notificarAveria
        };
    } else {
        const nuevosPermisos = {};
        document.querySelectorAll("#permisosUsuario .form-check-input").forEach(input => {
            nuevosPermisos[input.id] = input.checked;
        });
        usuario.permisos = nuevosPermisos;
    }
    localStorage.setItem("usuarios", JSON.stringify(usuariosLS));
    alert(`Permisos actualizados para ${nombreUsuario}`);
    let modalInstance = bootstrap.Modal.getInstance(document.getElementById("modalPermisosUsuario"));
    modalInstance.hide();
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

function establecerVacaciones(usuario) {
    const inicio = document.getElementById("inicioVacaciones").value;
    const fin = document.getElementById("finVacaciones").value;
    mostrarAlerta(`Vacaciones asignadas a ${usuario} desde ${inicio} hasta ${fin}.`, "success");
    cerrarModal();
}

function darBajaUsuario(usuarioNombre) {
    let usuariosLS = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (confirm(`¿Seguro que quieres dar de baja a ${usuarioNombre}? Esta acción no se puede deshacer.`)) {
        usuariosLS = usuariosLS.filter(usuario => usuario.nombre !== usuarioNombre);
        localStorage.setItem("usuarios", JSON.stringify(usuariosLS));
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
        modalInstance.hide();
    } else {
        modalElement.classList.remove("show");
        modalElement.style.display = "none";
        document.body.classList.remove("modal-open");
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) backdrop.remove();
    }
}

function mostrarAlerta(mensaje, tipo, permanente = false) {
    const main = document.querySelector("main");
    let alertContainer = document.getElementById("alert-container");
    if (!alertContainer) {
        alertContainer = document.createElement("div");
        alertContainer.id = "alert-container";
        main.prepend(alertContainer);
    }
    const alerta = document.createElement("div");
    alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
    alerta.role = "alert";
    alerta.style.width = "100%";
    alerta.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    if (permanente) {
        alertContainer.innerHTML = "";
    }
    alertContainer.appendChild(alerta);
    if (!permanente) {
        setTimeout(() => {
            if (alerta && alerta.parentNode) alerta.remove();
        }, 3000);
    }
}

// -----------------------
// Funciones para cambiar contraseña
// -----------------------
function cambiarContrasenaDelUsuarioSeleccionado() {
    const alertaModal = document.getElementById("alertaContrasenaModal");
    if (!usuarioSeleccionadoGlobal) {
        alertaModal.textContent = "Por favor, seleccione un usuario antes de cambiar la contraseña.";
        alertaModal.className = "alert alert-danger mt-3";
        alertaModal.classList.remove("d-none");
        setTimeout(() => { alertaModal.classList.add("d-none"); }, 3000);
        return;
    }
    const nueva = document.getElementById("nuevaContrasenaModal").value.trim();
    const confirmar = document.getElementById("confirmarContrasenaModal").value.trim();
    if (!nueva || !confirmar) {
        alertaModal.textContent = "Por favor, complete ambos campos de la nueva contraseña.";
        alertaModal.className = "alert alert-warning mt-3";
        alertaModal.classList.remove("d-none");
        setTimeout(() => { alertaModal.classList.add("d-none"); }, 3000);
        return;
    }
    if (nueva.length < 4 || !/(?=.*[A-Za-z])(?=.*\d)/.test(nueva)) {
        alertaModal.textContent = "La nueva contraseña debe tener al menos 4 caracteres, incluyendo una letra y un número.";
        alertaModal.className = "alert alert-warning mt-3";
        alertaModal.classList.remove("d-none");
        setTimeout(() => { alertaModal.classList.add("d-none"); }, 3000);
        return;
    }
    if (nueva !== confirmar) {
        alertaModal.textContent = "Las contraseñas no coinciden.";
        alertaModal.className = "alert alert-danger mt-3";
        alertaModal.classList.remove("d-none");
        setTimeout(() => { alertaModal.classList.add("d-none"); }, 3000);
        return;
    }
    let usuariosLS = JSON.parse(localStorage.getItem("usuarios")) || [];
    let idx = usuariosLS.findIndex(u => u.id === usuarioSeleccionadoGlobal.id);
    if (idx === -1) {
        alertaModal.textContent = "Usuario no encontrado.";
        alertaModal.className = "alert alert-danger mt-3";
        alertaModal.classList.remove("d-none");
        setTimeout(() => { alertaModal.classList.add("d-none"); }, 3000);
        return;
    }
    usuariosLS[idx].password = nueva;
    localStorage.setItem("usuarios", JSON.stringify(usuariosLS));
    alertaModal.textContent = "Contraseña cambiada correctamente.";
    alertaModal.className = "alert alert-success mt-3";
    alertaModal.classList.remove("d-none");
    setTimeout(() => { alertaModal.classList.add("d-none"); }, 3000);
    document.getElementById("nuevaContrasenaModal").value = "";
    document.getElementById("confirmarContrasenaModal").value = "";
}

// -----------------------
// Funciones para la recuperación de contraseña (para la página recuperar.html)
// -----------------------
function handleRecovery(event) {
    event.preventDefault();
    const alertRecovery = document.getElementById("alertRecovery");
    alertRecovery.classList.add("d-none");
    alertRecovery.textContent = "";
    const username = document.getElementById("username").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    if (!username || !newPassword || !confirmPassword) {
        mostrarAlertRecovery("Por favor, complete todos los campos.", "warning");
        return;
    }
    if (newPassword.length < 4 || !/(?=.*[A-Za-z])(?=.*\d)/.test(newPassword)) {
        mostrarAlertRecovery("La nueva contraseña debe tener al menos 4 caracteres, incluyendo una letra y un número.", "warning");
        return;
    }
    if (newPassword !== confirmPassword) {
        mostrarAlertRecovery("Las contraseñas no coinciden.", "danger");
        return;
    }
    let usuariosLS = JSON.parse(localStorage.getItem("usuarios")) || [];
    let usuarioEncontrado = false;
    for (const usuario of usuariosLS) {
        if (usuario.username === username) {
            usuario.password = newPassword;
            usuarioEncontrado = true;
            break;
        }
    }
    if (usuarioEncontrado) {
        localStorage.setItem("usuarios", JSON.stringify(usuariosLS));
        mostrarAlertRecovery(`La contraseña del usuario "${username}" se ha actualizado correctamente.`, "success");
        setTimeout(() => { window.location.href = "login.html"; }, 2000);
    } else {
        mostrarAlertRecovery("El nombre de usuario no existe. Por favor, inténtalo de nuevo.", "danger");
    }
}

function mostrarAlertRecovery(mensaje, tipo) {
    const alertRecovery = document.getElementById("alertRecovery");
    alertRecovery.textContent = mensaje;
    alertRecovery.className = `alert alert-${tipo} mt-3`;
    alertRecovery.classList.remove("d-none");
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
                <button class="btn btn-primary" onclick="mostrarImagen(${maquina.id}, '${maquina.imagen}')">Mostrar Imagen</button>
                <button class="btn btn-primary" onclick="editarMaquina(${maquina.id})">Editar Detalles</button>
                <button id="botonBaja" class="btn btn-danger" onclick="darBajaMaquina('${maquina.nombre}')">Dar de Baja</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

let maquinaSeleccionada = null;

function mostrarImagen(id, imagenBase64) {
    let maquinas = JSON.parse(localStorage.getItem("maquinas")) || [];
    let maquina = maquinas.find(m => m.id === id);

    if (!maquina || !maquina.imagen) {
        alert("No hay imagen disponible para esta máquina.");
        return;
    }

    maquinaSeleccionada = id;

    document.getElementById("imagenModal").src = imagenBase64;
    let modalInstance = new bootstrap.Modal(document.getElementById("modalImagen"));
    modalInstance.show();
}

function borrarImagen() {
    if (!maquinaSeleccionada) {
        alert("No hay una imagen seleccionada.");
        return;
    }

    let maquinas = JSON.parse(localStorage.getItem("maquinas")) || [];
    let index = maquinas.findIndex(m => m.id === maquinaSeleccionada);

    if (index !== -1) {
        maquinas[index].imagen = ""; // Eliminar la imagen
        localStorage.setItem("maquinas", JSON.stringify(maquinas)); // Guardar cambios en localStorage
        alert("Imagen eliminada correctamente.");
    }

    maquinaSeleccionada = null; // Resetear variable
    let modalInstance = bootstrap.Modal.getInstance(document.getElementById("modalImagen"));
    modalInstance.hide();
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
                <div class="dropdown ms-auto">
                    <button class="btn btn-primary dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="img/log-out.png" alt="Cerrar sesión" style="width: 30px; height: 30px; filter: invert(1);">
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                        <li><a class="dropdown-item" href="#" onclick="abrirModalCambioContrasena()">Cambiar Contraseña</a></li>
                        <li><a class="dropdown-item text-danger" href="#" onclick="cerrarSesion()">Cerrar Sesión</a></li>
                    </ul>
                </div>
            </ul>
        </nav>

        <!-- Modal Cambio de Contraseña -->
        <div class="modal fade" id="modalCambioContrasena" tabindex="-1" aria-labelledby="modalCambioContrasenaLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalCambioContrasenaLabel">Cambiar Contraseña</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formCambioContrasena">
                            <div class="mb-3">
                                <label for="nuevaContrasena" class="form-label">Nueva Contraseña</label>
                                <input type="password" class="form-control" id="nuevaContrasena" required>
                            </div>
                            <div class="mb-3">
                                <label for="confirmarContrasena" class="form-label">Confirmar Nueva Contraseña</label>
                                <input type="password" class="form-control" id="confirmarContrasena" required>
                            </div>
                            <div id="alertaCambio" class="alert d-none"></div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarCambioContrasena()">Guardar Contraseña</button>
                    </div>
                </div>
            </div>
        </div>

    `;

    // Insertar el menú en el lugar donde queremos mostrarlo
    document.getElementById("menu-container").innerHTML = menuHTML;
}

function guardarCambioContrasena() {
    const nuevaContrasena = document.getElementById("nuevaContrasena").value.trim();
    const confirmarContrasena = document.getElementById("confirmarContrasena").value.trim();
    const alertaCambio = document.getElementById("alertaCambio");

    if (nuevaContrasena.length < 4 || !/(?=.*[A-Za-z])(?=.*\d)/.test(nuevaContrasena)) {
        alertaCambio.textContent = "La contraseña debe tener al menos 4 caracteres, incluyendo una letra y un número.";
        alertaCambio.className = "alert alert-warning mt-3";
        alertaCambio.classList.remove("d-none");
        return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
        alertaCambio.textContent = "Las contraseñas no coinciden.";
        alertaCambio.className = "alert alert-danger mt-3";
        alertaCambio.classList.remove("d-none");
        return;
    }

    let usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
    let usuariosLS = JSON.parse(localStorage.getItem("usuarios")) || [];
    let idx = usuariosLS.findIndex(u => u.username === usuarioActual.username);

    if (idx !== -1) {
        usuariosLS[idx].password = nuevaContrasena;
        localStorage.setItem("usuarios", JSON.stringify(usuariosLS));

        // Cerrar modal
        let modalInstance = bootstrap.Modal.getInstance(document.getElementById("modalCambioContrasena"));
        modalInstance.hide();

        // Mensaje de confirmación
        alert("Contraseña cambiada correctamente.");
    }
}

function abrirModalCambioContrasena() {
    let modalInstance = new bootstrap.Modal(document.getElementById("modalCambioContrasena"));
    modalInstance.show();
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

function abrirModalPermisosUsuario(nombreUsuario) {
    document.getElementById("nombreUsuarioPermisos").textContent = nombreUsuario;

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let usuario = usuarios.find(u => u.nombre === nombreUsuario);

    if (!usuario) {
        alert("Error: Usuario no encontrado.");
        return;
    }

    let permisosHTML = "";
    
    if (usuario.rol === "Operario") {
        // Primero se muestran los checkbox de las máquinas
        permisosHTML += '<h6>Selecciona las máquinas a las que tendrá acceso:</h6>';
        let maquinas = JSON.parse(localStorage.getItem("maquinas")) || [];
        maquinas.forEach(maquina => {
            let checked = "";
            if (usuario.permisos && usuario.permisos.accesosMaquinas && usuario.permisos.accesosMaquinas.includes(maquina.id)) {
                checked = "checked";
            }
            permisosHTML += `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="maquina-${maquina.id}" value="${maquina.id}" ${checked}>
                <label class="form-check-label" for="maquina-${maquina.id}">${maquina.nombre}</label>
            </div>`;
        });
        
        // Se agrega el párrafo justo después de los checkbox de las máquinas
        permisosHTML += `<br><h6>Selecciona si el usuario tendrá acceso a:</h6>`;
        
        // Finalmente, se agrega el checkbox para Notificar avería
        permisosHTML += `
        <div class="form-check mt-3">
            <input class="form-check-input" type="checkbox" id="notificarAveria" ${usuario.permisos && usuario.permisos.notificarAveria ? "checked" : ""}>
            <label class="form-check-label" for="notificarAveria">Notificar avería</label>
        </div>`;
    } else {
        // Para Administradores y Mecánicos se muestran los permisos tradicionales
        permisosHTML = permisosDisponibles.map(permiso => `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="${permiso}" ${usuario.permisos && usuario.permisos[permiso] ? "checked" : ""}>
                <label class="form-check-label" for="${permiso}">${permiso.replace("permiso", "").replace(/([A-Z])/g, ' $1')}</label>
            </div>
        `).join("");
    }

    document.getElementById("permisosUsuario").innerHTML = permisosHTML;

    let modalInstance = new bootstrap.Modal(document.getElementById("modalPermisosUsuario"));
    modalInstance.show();
}


function guardarPermisosUsuario() {
    let nombreUsuario = document.getElementById("nombreUsuarioPermisos").textContent;
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let usuario = usuarios.find(u => u.nombre === nombreUsuario);

    if (!usuario) {
        alert("Error: Usuario no encontrado.");
        return;
    }

    // Si el usuario es Operario, leeremos los accesos a máquinas y el checkbox de notificar avería
    if (usuario.rol === "Operario") {
        let accesosMaquinas = [];
        let maquinas = JSON.parse(localStorage.getItem("maquinas")) || [];
        maquinas.forEach(maquina => {
            const checkbox = document.getElementById(`maquina-${maquina.id}`);
            if (checkbox && checkbox.checked) {
                accesosMaquinas.push(maquina.id);
            }
        });
        const notificarAveria = document.getElementById("notificarAveria").checked;
        usuario.permisos = {
            accesosMaquinas: accesosMaquinas,
            notificarAveria: notificarAveria
        };
    } else {
        // Para Administradores y Mecánicos se leen todos los checkbox mostrados
        const nuevosPermisos = {};
        document.querySelectorAll("#permisosUsuario .form-check-input").forEach(input => {
            nuevosPermisos[input.id] = input.checked;
        });
        usuario.permisos = nuevosPermisos;
    }

    // Guardamos los cambios en localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert(`Permisos actualizados para ${nombreUsuario}`);
    let modalInstance = bootstrap.Modal.getInstance(document.getElementById("modalPermisosUsuario"));
    modalInstance.hide();
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
    // Usamos el usuario seleccionado global
    if (!usuarioSeleccionadoGlobal) {
        alert("No se ha seleccionado ningún usuario.");
        return;
    }
    let usuariosLS = JSON.parse(localStorage.getItem("usuarios")) || [];
    let idx = usuariosLS.findIndex(u => u.id === usuarioSeleccionadoGlobal.id);
    if (idx === -1) {
        alert("Usuario no encontrado.");
        return;
    }
    // Marcar el flag para forzar el cambio de contraseña
    usuariosLS[idx].cambioContrasenaRequerido = true;
    localStorage.setItem("usuarios", JSON.stringify(usuariosLS));
    
    // Cerrar el modal de forzar cambio
    const modalElement = document.getElementById("modalForzarCambio");
    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
        modalInstance.hide();
    } else {
        // Si por alguna razón no se obtiene la instancia, se oculta manualmente
        modalElement.classList.remove("show");
        modalElement.style.display = "none";
        document.body.classList.remove("modal-open");
    }
    
    // Mostrar la alerta (usando la función mostrarAlerta definida en el script)
    mostrarAlerta(`Se ha obligado a ${usuariosLS[idx].nombre} a cambiar su contraseña.`, "warning");
}



function prepararForzarCambio(nombreUsuario) {
    // Busca el usuario en localStorage y actualiza la variable global
    let usuariosLS = JSON.parse(localStorage.getItem("usuarios")) || [];
    let usuario = usuariosLS.find(u => u.nombre === nombreUsuario);
    if (usuario) {
        usuarioSeleccionadoGlobal = usuario;
        console.log("Usuario seleccionado para forzar cambio:", usuario);
    } else {
        alert("Usuario no encontrado.");
        return;
    }
    // No se ejecuta la acción, solo se abre el modal (ya lo hará data-bs-toggle)
}


function habilitarBotonConfirmar() {
    let checkbox = document.getElementById("forzarCambioContrasena");
    let boton = document.getElementById("btnConfirmarForzarCambio");
    boton.disabled = !checkbox.checked;
}

document.getElementById("forzarCambioContrasena").addEventListener("change", habilitarBotonConfirmar);

function checkCambioContrasena() {
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
    if (usuarioActual && usuarioActual.cambioContrasenaRequerido) {
        document.getElementById("usuarioCambio").textContent = usuarioActual.nombre;
        let modalInstance = new bootstrap.Modal(document.getElementById("modalCambioContrasena"));
        modalInstance.show();
    }
}
