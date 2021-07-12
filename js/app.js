(function(){
    let DB;

    const listadoEstudiantes = document.querySelector('#listado-clientes');

    
    document.addEventListener('DOMContentLoaded', () => {
        crearDB();

        if(window.indexedDB.open('crm',1)){
            obtenerEstudiantes();
        }

        listadoEstudiantes.addEventListener('click', eliminarRegistro);

    });

    function eliminarRegistro(e){
        if(e.target.classList.contains('eliminar')){
            const idEliminar = Number(e.target.dataset.cliente);

                const transaction = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');

                objectStore.delete(idEliminar);

                transaction.oncomplete = function() {

                    e.target.parentElement.parentElement.remove();

                    
                }

                transaction.onerror = function() {
                    console.log('Error al Eliminar el Estudiante');
                }
            
        }
    }


    function crearDB() { // Creando base de datos
        const crearDB = window.indexedDB.open('crm', 1);

        crearDB.onerror = function(){
            console.log('Error al crear la base de Datos');
        };

        crearDB.onsuccess = function(){

            DB = crearDB.result;
        };

        crearDB.onupgradeneeded = function(e) {
            const db = e.target.result;

            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true});

            objectStore.createIndex('nombres', 'nombre', {unique: false});
            objectStore.createIndex('apellidos', 'apellidos', {unique: false});
            objectStore.createIndex('email', 'email', {unique: true});
            objectStore.createIndex('numeroCUI', 'numeroCUI', {unique: true});
            objectStore.createIndex('telefono', 'telefono', {unique: false});
            objectStore.createIndex('encargado', 'encargado', {unique: false});
            objectStore.createIndex('id', 'id', {unique: true});

            console.log('DB Lista y Creada');


        }

    }

    function obtenerEstudiantes() {
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function(){
            console.log('Error en la conexion');
        }

        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result;

            const objectStore = DB.transaction('crm').objectStore('crm');

            objectStore.openCursor().onsuccess = function(e) {
                const cursor = e.target.result;

                if(cursor){
                    const {nombres, apellidos, email, cui, telefono, encargado, id} = cursor.value;

                    listadoEstudiantes.innerHTML += ` 
                        <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${nombres}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${apellidos}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${email}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${cui}</p>
                            </td>
                            
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${telefono}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${encargado}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                            </td>
                        </tr>
                    `;

                    cursor.continue();
                }else{
                    console.log('No hay más registros...');
                }
            }

        }

    }





})();