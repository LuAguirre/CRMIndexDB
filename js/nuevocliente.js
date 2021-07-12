(function() {
    let DB;

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        formulario.addEventListener('submit', validarEstudiante);
    });

    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm', 1);
    
        abrirConexion.onerror = function() {
            console.log('Error al conectarse a la base de Datos');
        };
    
        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result;
        }
    }
    

    function validarEstudiante(e) {
        e.preventDefault();

        // Leyendo Inputs
        const nombres = document.querySelector('#nombres').value;
        const apellidos = document.querySelector('#apellidos').value;
        const email = document.querySelector('#email').value;
        const cui = document.querySelector('#cui').value;
        const telefono = document.querySelector('#telefono').value;
        const encargado = document.querySelector('#encargado').value;

        if(nombres === '' || apellidos === '' || email === '' || cui === '' || telefono === '' || encargado === '' ){
            
            imprimirAlerta('Los campos son Obligatorios','error');

            return;
        }

        // Crear un objeto con la Informacion

        const estudiante = {
            nombres,
            apellidos,
            email,
            cui,
            telefono,
            encargado,
        }

        estudiante.id = Date.now();

        crearNuevoEstudiante(estudiante);
        

        
    }

    function crearNuevoEstudiante(estudiante){
        const transaction = DB.transaction(['crm'],'readwrite');

        const objectStore = transaction.objectStore('crm');

        objectStore.add(estudiante);

        transaction.onerror = function() {
            imprimirAlerta('El empleado Ya Existe', 'error');

            return;
        }

       

    }

    


})();