const token = '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';
const repoOwner = 'Segandorin';
const repoName = 'Casa';
const filePath = 'gastos_data_github.json';

const inputBuscar = document.getElementById('inputBuscar');
const tablaGastos = document.getElementById('tablaGastos');
const inputNombre = document.getElementById('inputNombre');
const inputFecha = document.getElementById('inputFecha');
const inputTipo = document.getElementById('inputTipo');
const inputDescripcion = document.getElementById('inputDescripcion');
const inputCantidad = document.getElementById('inputCantidad');

let gastosData = [];

//########################      I N I T  D O M      #########################
document.addEventListener('DOMContentLoaded', async function() {
    await cargarDatos();   
    cargarTablaGastos();   
});

//##############################################################################################################

async function cargarDatos() {
    try {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
            method: 'GET',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3.raw'  // Solicitar el archivo en formato raw
            }
        });

        if (!response.ok) {
            throw new Error(`Error al acceder al archivo: ${response.statusText}`);
        }
        const rawData = await response.text();  // Obtener el archivo como texto
        gastosData = JSON.parse(rawData);       // Convertir el texto en un objeto JSON
    } catch (error) {
        console.error('Error cargando los datos desde GitHub:', error);
    }
}

function cargarTablaGastos() {
    tablaGastos.innerHTML = '<table id="tablaGastosHtml" class="display"></table>';
    const tabla = $('#tablaGastosHtml').DataTable({
        
        data: gastosData, // Asegúrate de que este array sea válido
        columns: [
            {
                title: "ID",
                data: "id",
                visible: false
            },
            {
                title: "Nombre",
                data: null,
                render: function (data, type, row) {
                    return `
                        <div>
                            <strong>${row.nombre}</strong><br>
                            <small>${row.fecha}</small>
                        </div>
                    `;
                }
            },
            {
                title: "Tipo",
                data: null,
                render: function (data, type, row) {
                    return `
                        <div>
                            <strong>${row.tipo}</strong><br>
                            <small>${row.descripcion}</small>
                        </div>
                    `;
                }
            },
            {
                title: "Cantidad",
                data: "cantidad",
                className: 'text-right' 
            }
        ],
        paging: false,
        info: false,
        ordering: false,
        autoWidth: true,
        stripeClasses: [],
        language: {
            zeroRecords: "No se encontraron resultados"  
        }
    });
    inputBuscar.addEventListener('input', function () {
        const valorBusqueda = this.value; 
        tabla.search(valorBusqueda).draw();
    });
}
