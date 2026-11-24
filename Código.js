const ID_HOJA = '10j5UN61vcSSmn8w3l5EW1REP4X4hgyaVZnUFC0MYTtY';
const ESTADOS_PERMITIDOS = ['Pendiente', 'En reparación', 'Resuelta'];
// Cambia este valor por la contraseña de administrador que quieras utilizar.
const CONTRASENA_ADMIN = 'Administrador1234'; // súper segura, inquebrantable...

// Carga la página principal.
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Registro de incidencias');
}

// Comprueba la contraseña y crea una sesión temporal de administrador.
function iniciarSesionAdmin(contrasena) {
  if (contrasena !== CONTRASENA_ADMIN) {
    throw new Error('La contraseña no es correcta.');
  }

  const token = Utilities.getUuid();
  CacheService.getScriptCache().put('admin_' + token, 'activo', 21600);
  return token;
}

// Comprueba que el token corresponde a una sesión de administrador activa.
function comprobarAdmin(token) {
  if (!token || CacheService.getScriptCache().get('admin_' + token) !== 'activo') {
    throw new Error('La sesión de administrador ha caducado. Vuelve a iniciar sesión.');
  }
}

// Cierra la sesión de administrador.
function cerrarSesionAdmin(token) {
  if (token) {
    CacheService.getScriptCache().remove('admin_' + token);
  }
  return true;
}

// Guarda una incidencia en la pestaña Incidencias.
function registrarIncidencia(datos) {
  if (!datos || !datos.equipo || !datos.aula || !datos.descripcion ||
      !String(datos.equipo).trim() || !String(datos.aula).trim() || !String(datos.descripcion).trim()) {
    throw new Error('Completa Equipo, Aula y Descripción.');
  }

  const hoja = SpreadsheetApp.openById(ID_HOJA).getSheetByName('Incidencias');
  if (!hoja) {
    throw new Error('No se ha encontrado la pestaña Incidencias.');
  }

  const id = Utilities.getUuid();
  const fecha = new Date();
  hoja.appendRow([
    id,
    fecha,
    String(datos.equipo).trim(),
    String(datos.aula).trim(),
    String(datos.descripcion).trim(),
    'Pendiente'
  ]);

  return { id: id, mensaje: 'Incidencia registrada correctamente.' };
}

// Los usuarios normales reciben las incidencias sin el campo Estado.
function obtenerIncidencias(token) {
  const esAdmin = Boolean(token);
  if (esAdmin) {
    comprobarAdmin(token);
  }

  const hoja = SpreadsheetApp.openById(ID_HOJA).getSheetByName('Incidencias');
  if (!hoja) {
    throw new Error('No se ha encontrado la pestaña Incidencias.');
  }

  const ultimaFila = hoja.getLastRow();
  if (ultimaFila < 2) {
    return [];
  }

  return hoja.getRange(2, 1, ultimaFila - 1, 6).getDisplayValues().map(function (fila) {
    const incidencia = {
      id: fila[0],
      fecha: fila[1],
      equipo: fila[2],
      aula: fila[3],
      descripcion: fila[4]
    };
    if (esAdmin) {
      incidencia.estado = fila[5];
    }
    return incidencia;
  });
}

// Cambia solo el estado de la incidencia que coincide con el ID.
function actualizarEstadoIncidencia(id, nuevoEstado, token) {
  comprobarAdmin(token);
  if (ESTADOS_PERMITIDOS.indexOf(nuevoEstado) === -1) {
    throw new Error('El estado seleccionado no es válido.');
  }

  const hoja = SpreadsheetApp.openById(ID_HOJA).getSheetByName('Incidencias');
  if (!hoja) {
    throw new Error('No se ha encontrado la pestaña Incidencias.');
  }

  const ultimaFila = hoja.getLastRow();
  if (!id || ultimaFila < 2) {
    throw new Error('No se ha encontrado la incidencia.');
  }

  const ids = hoja.getRange(2, 1, ultimaFila - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) {
      hoja.getRange(i + 2, 6).setValue(nuevoEstado);
      return 'Estado actualizado correctamente.';
    }
  }

  throw new Error('No se ha encontrado la incidencia.');
}
