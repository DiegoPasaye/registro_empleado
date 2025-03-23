async function cargarEmpleados() {
    try {
        const API_URL = "http://localhost:3000";
        const respuesta = await fetch(`${API_URL}/empleados`);
        const empleados = await respuesta.json();
        const tabla = document.getElementById('tablaEmpleados');
        empleados.forEach(emp => {
            const fila = `
                <tr>
                    <td>${emp.nombre}</td>
                    <td>${emp.email}</td>
                    <td>${emp.puesto}</td>
                    <td>${emp.fechaNacimiento}</td>
                    <td>${emp.genero}</td>
                    <td>${emp.tipoContrato}</td>
                    <td><img src='./img/delete.png' onclick=eliminarEmpleado('${emp.id}')></td>
                </tr>`;
            tabla.insertAdjacentHTML('beforeend', fila);
        });
    } catch (error) {
        console.error('Error al cargar empleados:', error);
    }
}

const eliminarEmpleado = async(id) => {
    try{
        const respuesta = await fetch(`http://localhost:3000/empleados/${id}`, {
            method: 'DELETE',
        })

        if(respuesta.ok){
            alert('Empleado eliminado correctamente')
            document.getElementById('tablaEmpleados').innerHTML = ''
            cargarEmpleados();
        }else{
            alert('Ha habido un error al eliminar el empleado')
        }
    }catch(error){
        console.error('Error: ' + error)
    }

}
cargarEmpleados();
