let rolActual = 'empleado';

const CREDENCIALES = {
  empleado: {
    usuario: 'empleado_sierra',
    password: 'Sierra#2026Emp',
    nombre: 'Arturo (Coordinador Sierra)'
  },
  usuario: {
    usuario: 'viajero_chih',
    password: 'Aventura#2026',
    nombre: 'Explorador Chihuahua'
  }
};

const reservasIniciales = [
  { id: 'ECO-101', cliente: 'Carlos Mendoza', cabaña: 'Cabaña Río (6 pers.)', tarifa: '$3,900 MXN', estado: 'Confirmada' },
  { id: 'ECO-102', cliente: 'Laura Gómez', cabaña: 'Cabaña Bosque (4 pers.)', tarifa: '$2,800 MXN', estado: 'Pendiente' },
  { id: 'ECO-103', cliente: 'Sofía Reyes', cabaña: 'Cabaña Montaña (2 pers.)', tarifa: '$2,300 MXN', estado: 'Confirmada' }
];

function obtenerReservas() {
  const guardadas = localStorage.getItem('ecosierra_reservas');
  if (!guardadas) {
    localStorage.setItem('ecosierra_reservas', JSON.stringify(reservasIniciales));
    return reservasIniciales;
  }
  return JSON.parse(guardadas);
}

function seleccionarRol(rol) {
  rolActual = rol;
  document.getElementById('btnTabEmpleado').classList.toggle('active', rol === 'empleado');
  document.getElementById('btnTabUsuario').classList.toggle('active', rol === 'usuario');
  document.getElementById('errorLogin').style.display = 'none';

  const cajaDemo = document.getElementById('cajaDemo');
  const datos = CREDENCIALES[rol];
  const etiqueta = rol === 'empleado' ? 'Trabajador / Staff' : 'Cliente / Viajero';

  cajaDemo.innerHTML = `
    <strong>Credenciales Demo (${etiqueta}):</strong><br>
    Usuario: <code>${datos.usuario}</code> | Contraseña: <code>${datos.password}</code><br>
    <button type="button" class="btn-demo" onclick="rellenarDemo()">Autocompletar acceso</button>
  `;
}

function rellenarDemo() {
  document.getElementById('inputUsuario').value = CREDENCIALES[rolActual].usuario;
  document.getElementById('inputPassword').value = CREDENCIALES[rolActual].password;
}

function procesarLogin(evento) {
  evento.preventDefault();
  const user = document.getElementById('inputUsuario').value.trim();
  const pass = document.getElementById('inputPassword').value;
  const cuenta = CREDENCIALES[rolActual];

  if (user === cuenta.usuario && pass === cuenta.password) {
    localStorage.setItem('ecosierra_rol_activo', rolActual);
    cargarInterfazSesion(rolActual);
  } else {
    document.getElementById('errorLogin').style.display = 'block';
  }
}

function cargarInterfazSesion(rol) {
  document.getElementById('seccionLogin').style.display = 'none';
  document.getElementById('tarjetaPortal').classList.add('modo-panel');

  if (rol === 'empleado') {
    document.getElementById('panelEmpleado').style.display = 'block';
    document.getElementById('panelUsuario').style.display = 'none';
    renderizarTablaEmpleado();
  } else {
    document.getElementById('panelUsuario').style.display = 'block';
    document.getElementById('panelEmpleado').style.display = 'none';
  }
}

function renderizarTablaEmpleado() {
  const lista = obtenerReservas();
  const tbody = document.getElementById('tablaReservasBody');
  tbody.innerHTML = '';

  lista.forEach((res, index) => {
    const esPendiente = res.estado === 'Pendiente';
    tbody.innerHTML += `
      <tr>
        <td><strong>${res.id}</strong></td>
        <td>${res.cliente}</td>
        <td>${res.cabaña}</td>
        <td>${res.tarifa}</td>
        <td>${esPendiente ? '⏳ Pendiente' : '✅ Confirmada'}</td>
        <td>
          ${esPendiente
            ? `<button class="btn-accion" onclick="confirmarReserva(${index})">Confirmar</button>`
            : '—'}
        </td>
      </tr>
    `;
  });

  document.getElementById('contadorReservas').innerText = `${lista.length} Activas`;
}

function confirmarReserva(indice) {
  const lista = obtenerReservas();
  lista[indice].estado = 'Confirmada';
  localStorage.setItem('ecosierra_reservas', JSON.stringify(lista));
  renderizarTablaEmpleado();
}

function crearReservaCliente(evento) {
  evento.preventDefault();
  const cabaña = document.getElementById('selectCabanaCliente').value;
  const tarifas = {
    'Cabaña Bosque (4 pers.)': '$2,800 MXN',
    'Cabaña Río (6 pers.)': '$3,900 MXN',
    'Cabaña Montaña (2 pers.)': '$2,300 MXN'
  };

  const lista = obtenerReservas();
  const nuevoId = 'ECO-' + (101 + lista.length);

  lista.push({
    id: nuevoId,
    cliente: 'Viajero Chihuahua (Web)',
    cabaña: cabaña,
    tarifa: tarifas[cabaña],
    estado: 'Pendiente'
  });

  localStorage.setItem('ecosierra_reservas', JSON.stringify(lista));
  alert(`¡Solicitud enviada con folio ${nuevoId}! Un trabajador de EcoSierra la confirmará pronto.`);
}

function cerrarSesion() {
  localStorage.removeItem('ecosierra_rol_activo');
  document.getElementById('panelEmpleado').style.display = 'none';
  document.getElementById('panelUsuario').style.display = 'none';
  document.getElementById('seccionLogin').style.display = 'block';
  document.getElementById('tarjetaPortal').classList.remove('modo-panel');
  document.getElementById('inputPassword').value = '';
}

window.addEventListener('DOMContentLoaded', () => {
  const sesion = localStorage.getItem('ecosierra_rol_activo');
  if (sesion) {
    cargarInterfazSesion(sesion);
  }
});
