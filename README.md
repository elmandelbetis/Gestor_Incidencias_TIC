# Gestor de Incidencias TIC

Aplicación web desarrollada con **Google Apps Script** para la gestión y seguimiento de incidencias técnicas, realizada como práctica del módulo de **Aplicaciones Web (2º FP)**.

## Estructura del proyecto

* `Código.js` (`.gs`): Lógica del servidor en Google Apps Script (`doGet`, manejo de datos y operaciones backend).
* `Index.html`: Interfaz de usuario web.
* `appsscript.json`: Archivo de manifiesto con la configuración del proyecto y permisos de ejecución.

## Requisitos previos

* Una cuenta de Google con acceso a [Google Apps Script](https://script.google.com/).
* *(Opcional)* Tener instalado [`clasp`](https://github.com/google/clasp) si deseas sincronizar el código desde local.

## Instalación y despliegue

### Opción A: Desde el navegador (Apps Script)
1. Crea un nuevo proyecto en [Google Apps Script](https://script.google.com/).
2. Copia el contenido de `Código.js` en el archivo `Código.gs` del editor.
3. Crea un archivo HTML llamado `Index` y pega el contenido de `Index.html`.
4. Activa la visualización del manifiesto en **Configuración del proyecto > Mostrar el archivo de manifiesto "appsscript.json"** y sustituye su contenido por el de `appsscript.json`.
5. Haz clic en **Implementar > Nueva implementación**, selecciona **Aplicación web**, configura el acceso según tus necesidades y pulsa **Implementar**.

### Opción B: Usando `clasp` desde terminal
```bash
clasp login
clasp create --title "Gestor de Incidencias TIC" --type webapp
clasp push
clasp deploy