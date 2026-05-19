// ----- MODELO DE DATOS -----
// Cada tarea: { id: número, texto: string, completada: boolean }

// Declaramos un array vacío donde se guardarán todas las tareas en memoria
let tareas = [];

// ----- REFERENCIAS A ELEMENTOS DEL DOM -----
// Obtenemos el campo de texto donde el usuario escribe la nueva tarea
const inputTarea = document.getElementById('txtTarea');
// Obtenemos el botón "Agregar"
const btnAgregar = document.getElementById('btnAgregar');
// Obtenemos la lista <ul> donde se mostrarán las tareas
const lista = document.getElementById('listaTareas');
// Seleccionamos todos los botones que tienen clase "filtros button" (los de Todas/Pendientes/Completadas)
const botonesFiltro = document.querySelectorAll('.filtros button');

// ----- VARIABLE DE FILTRO (se guarda en sessionStorage) -----
// Inicializamos el filtro actual como 'todas' (mostrar todas las tareas)
let filtroActual = 'todas';

// ----- 1. CARGAR TAREAS DESDE localStorage (persistente) -----
// Esta función recupera las tareas guardadas en el almacenamiento local del navegador
function cargarTareas() {
  // Intentamos obtener el string guardado bajo la clave 'tareas'
  const guardadas = localStorage.getItem('tareas');
  // Si existe algo guardado (no es null)
  if (guardadas) {
    // Convertimos el string JSON de vuelta a un array de objetos y lo asignamos a 'tareas'
    tareas = JSON.parse(guardadas);
  } else {
    // Si no hay nada guardado, inicializamos con un array vacío
    tareas = [];
  }
}

// ----- 2. GUARDAR TAREAS EN localStorage -----
// Esta función guarda el array 'tareas' en el almacenamiento local
function guardarTareas() {
  // Convertimos el array de tareas a string JSON y lo guardamos con la clave 'tareas'
  localStorage.setItem('tareas', JSON.stringify(tareas));
}

// ----- 3. CARGAR FILTRO DESDE sessionStorage (temporal) -----
// Recupera el último filtro usado durante esta sesión (si existe)
function cargarFiltro() {
  // Obtenemos el filtro guardado en sessionStorage bajo la clave 'filtro'
  const filtroGuardado = sessionStorage.getItem('filtro');
  // Verificamos que exista y que sea uno de los valores válidos ('todas', 'pendientes', 'completadas')
  if (filtroGuardado && ['todas', 'pendientes', 'completadas'].includes(filtroGuardado)) {
    // Si es válido, actualizamos la variable filtroActual
    filtroActual = filtroGuardado;
  }
  // Ahora resaltamos visualmente el botón que corresponde al filtroActual
  botonesFiltro.forEach(btn => {
    // Obtenemos el valor del atributo 'data-filtro' del botón (ej: 'todas')
    if (btn.getAttribute('data-filtro') === filtroActual) {
      // Si coincide, añadimos la clase CSS 'filtro-activo' para que se vea diferente
      btn.classList.add('filtro-activo');
    } else {
      // Si no coincide, eliminamos esa clase (por si la tenía antes)
      btn.classList.remove('filtro-activo');
    }
  });
}

// ----- 4. GUARDAR FILTRO EN sessionStorage -----
// Guarda el filtro actual en sessionStorage para que persista mientras dure la sesión
function guardarFiltro() {
  // Almacenamos el string del filtroActual bajo la clave 'filtro'
  sessionStorage.setItem('filtro', filtroActual);
}

// ----- 5. MOSTRAR MENSAJE DE BIENVENIDA (solo una vez por sesión) -----
// Muestra un mensaje amigable la primera vez que se abre la página en esta pestaña/sesión
function mostrarBienvenida() {
  // Verificamos si ya se mostró el mensaje en esta sesión (clave 'bienvenido' en sessionStorage)
  const yaVisto = sessionStorage.getItem('bienvenido');
  // Si no se había mostrado antes
  if (!yaVisto) {
    // Buscamos el div con id 'bienvenida' (creado en el HTML)
    const divBienvenida = document.getElementById('bienvenida');
    // Le ponemos un texto de bienvenida explicando el comportamiento
    divBienvenida.textContent = '¡Bienvenido! Tus tareas se guardan siempre, pero el filtro se olvida al cerrar el navegador.';
    // Configuramos un temporizador para que el mensaje desaparezca después de 4 segundos
    setTimeout(() => {
      divBienvenida.textContent = ''; // Borra el contenido del div
    }, 4000);
    // Marcamos en sessionStorage que ya se mostró, para no volver a mostrarlo en esta sesión
    sessionStorage.setItem('bienvenido', 'true');
  }
}

// ----- 6. RENDERIZAR TAREAS SEGÚN FILTRO -----
// Esta función pinta en pantalla las tareas aplicando el filtro actual
function renderizar() {
  // Filtrar según filtroActual
  let tareasFiltradas = []; // Array donde guardaremos las tareas que cumplen el filtro

  // Usamos un condicional según el valor del filtro
  if (filtroActual === 'todas') {
    // Si es 'todas', mostramos todas las tareas sin filtrar
    tareasFiltradas = tareas;
  } else if (filtroActual === 'pendientes') {
    // Si es 'pendientes', mostramos solo las que NO están completadas
    tareasFiltradas = tareas.filter(t => !t.completada);
  } else if (filtroActual === 'completadas') {
    // Si es 'completadas', mostramos solo las que SÍ están completadas
    tareasFiltradas = tareas.filter(t => t.completada);
  }

  // Limpiar la lista <ul> antes de volver a pintar (para evitar duplicados)
  lista.innerHTML = '';
  // Si no hay tareas que mostrar según el filtro
  if (tareasFiltradas.length === 0) {
    // Mostramos un mensaje de "No hay tareas" dentro de un <li>
    lista.innerHTML = '<li style="text-align:center">📭 No hay tareas</li>';
    return; // Salimos de la función porque no hay nada más que hacer
  }

  // Recorremos cada tarea del array filtrado
  tareasFiltradas.forEach(tarea => {
    // Creamos un elemento <li> para cada tarea
    const li = document.createElement('li');
    
    // Creamos un <span> que contendrá el texto de la tarea
    const span = document.createElement('span');
    span.textContent = tarea.texto;               // Asignamos el texto de la tarea
    span.className = 'tarea-text';                // Le damos una clase para estilo
    if (tarea.completada) span.classList.add('completada'); // Si está completada, añadimos clase de tachado



    // Creamos un botón para eliminar la tarea
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = ' ❌ ';               // Ícono de papelera
    btnEliminar.className = 'eliminar';            // Clase para estilos
    // Al hacer clic en eliminar:
    btnEliminar.addEventListener('click', () => {
      // Filtramos el array 'tareas' para eliminar la que tiene el mismo id
      tareas = tareas.filter(t => t.id !== tarea.id);
      // Guardamos el nuevo array en localStorage
      guardarTareas();
      // Volvemos a renderizar la lista actualizada
      renderizar();
    });

//
    // Creamos un botón para modificar el estado de la tarea
    const btnEstado = document.createElement('button');
    btnEstado.textContent = '✅';               // Ícono de papelera
    btnEstado.className = 'modificar';            // Clase para estilos
    // Al hacer clic en eliminar:
    btnEstado.addEventListener('click', () => {
      // Invertimos el valor de 'completada' de esta tarea
      tarea.completada = !tarea.completada;
      // Guardamos el array actualizado en localStorage
      guardarTareas();
      // Volvemos a renderizar para que se vea el cambio (el texto se tacha o se quita el tachado)
      renderizar();
    });


    // Añadimos el span y el botón al <li>
    li.appendChild(span)
    li.appendChild(btnEstado)
    li.appendChild(btnEliminar);
    // Añadimos el <li> a la lista <ul>
    lista.appendChild(li);
  });
}

// ----- 7. AGREGAR NUEVA TAREA -----
// Esta función se ejecuta cuando el usuario hace clic en "Agregar" o presiona Enter
function agregarTarea() {
  // Obtenemos el texto del input, eliminando espacios al inicio y final
  const texto = inputTarea.value.trim();
  // Si el texto está vacío, mostramos una alerta y no hacemos nada
  if (texto === '') {
    alert('Escribe algo');
    return;
  }
  // Creamos un objeto nueva tarea
  const nueva = {
    id: Date.now(),          // Identificador único basado en la marca de tiempo actual
    texto: texto,           // El texto que escribió el usuario
    completada: false       // Por defecto, no está completada
  };
  // Agregamos la nueva tarea al array 'tareas'
  tareas.push(nueva);
  // Guardamos el array actualizado en localStorage
  guardarTareas();
  // Limpiamos el campo de texto para que quede listo para la siguiente tarea
  inputTarea.value = '';
  // Volvemos a renderizar la lista para que aparezca la nueva tarea
  renderizar();
}

// ----- 8. CAMBIAR FILTRO (actualiza sessionStorage y renderiza) -----
// Esta función se ejecuta cuando se hace clic en uno de los botones de filtro
function cambiarFiltro(event) {
  // Obtenemos el valor del atributo 'data-filtro' del botón que disparó el evento
  const filtro = event.target.getAttribute('data-filtro');
  // Si por alguna razón no tiene ese atributo, no hacemos nada
  if (!filtro) return;
  // Actualizamos la variable global con el nuevo filtro
  filtroActual = filtro;
  // Guardamos el nuevo filtro en sessionStorage para que persista en la sesión
  guardarFiltro();
  // Volvemos a renderizar las tareas aplicando el nuevo filtro
  renderizar();
  // Actualizamos la clase activa en los botones para resaltar el seleccionado
  botonesFiltro.forEach(btn => {
    // Si el atributo 'data-filtro' del botón coincide con el filtro actual
    if (btn.getAttribute('data-filtro') === filtro) {
      btn.classList.add('filtro-activo');   // Añadimos estilo activo
    } else {
      btn.classList.remove('filtro-activo');// Quitamos estilo activo
    }
  });
}

// ----- 9. INICIALIZAR LA APLICACIÓN -----
// Esta función se ejecuta una sola vez al cargar la página y prepara todo
function init() {
  cargarTareas();          // Trae las tareas guardadas de localStorage (si hay)
  cargarFiltro();          // Trae el último filtro usado de sessionStorage (si existe)
  mostrarBienvenida();     // Muestra mensaje temporal (solo una vez por sesión)
  renderizar();            // Pinta las tareas en pantalla según el filtro actual

  // EVENTOS: Asignamos funciones a los eventos de los elementos HTML
  // Cuando se haga clic en el botón "Agregar", se llama a agregarTarea
  btnAgregar.addEventListener('click', agregarTarea);
  // Cuando se presione una tecla dentro del campo de texto
  inputTarea.addEventListener('keypress', (e) => {
    // Si la tecla presionada es "Enter" (código 13), ejecutamos agregarTarea
    if (e.key === 'Enter') agregarTarea();
  });
  // A cada botón de filtro le asignamos el evento 'click' que ejecuta cambiarFiltro
  botonesFiltro.forEach(btn => {
    btn.addEventListener('click', cambiarFiltro);
  });
}

// Arrancar todo: llamamos a init() para que la aplicación comience a funcionar
init();