const busqueda_alumnos = {
    template: `
        <div class="mt-2">
            <div class="mb-2">
                <input 
                    v-model="filtro" 
                    @keyup="filtrarAlumnos" 
                    type="text" 
                    class="form-control form-control-sm shadow-sm" 
                    placeholder="🔍 Buscar por nombre o código...">
            </div>

            <div class="table-responsive shadow-sm">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th style="width: 30%">CÓDIGO</th>
                            <th style="width: 45%">NOMBRE</th>
                            <th style="width: 25%" class="text-center">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white">
                        <tr v-for="a in listaFiltrada" :key="a.idAlumno">
                            <td class="fw-bold">{{ a.codigo }}</td>
                            <td>{{ a.nombre }}</td>
                            <td class="text-center">
                                <button @click="$emit('modificar', a)" class="btn btn-info btn-sm text-white py-0 px-2">Editar</button>
                                <button @click="eliminar(a.idAlumno)" class="btn btn-danger btn-sm py-0 px-2 ms-1">Eliminar</button>
                            </td>
                        </tr>
                        <tr v-if="listaFiltrada.length == 0">
                            <td colspan="3" class="text-center py-3 text-muted">No se encontraron resultados</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>`,
    data() {
        return {
            lista: [],
            listaFiltrada: [],
            filtro: ''
        }
    },
    mounted() {
        this.obtenerAlumnos();
    },
    methods: {
        obtenerAlumnos() {
            try {
                const res = window.dbInstance.exec("SELECT * FROM alumnos");
                if (res.length > 0) {
                    this.lista = res[0].values.map(fila => {
                        let obj = {};
                        res[0].columns.forEach((col, i) => obj[col] = fila[i]);
                        return obj;
                    });
                    this.listaFiltrada = this.lista; // Al inicio mostramos todo
                } else {
                    this.lista = [];
                    this.listaFiltrada = [];
                }
            } catch (e) {
                console.error("Error al obtener datos:", e);
            }
        },
        filtrarAlumnos() {
            const buscar = this.filtro.toLowerCase();
            this.listaFiltrada = this.lista.filter(a => 
                a.nombre.toLowerCase().includes(buscar) || 
                a.codigo.toLowerCase().includes(buscar)
            );
        },
        eliminar(id) {
            alertify.confirm("SISTEMA UGB", "¿Está seguro de eliminar este registro?", 
                () => {
                    window.dbInstance.run("DELETE FROM alumnos WHERE idAlumno = ?", [id]);
                    window.guardarCambios();
                    this.obtenerAlumnos(); // Refresca la lista interna
                    this.filtrarAlumnos(); // Refresca la vista filtrada
                    alertify.error("Registro eliminado");
                }, 
                () => { /* Cancelar */ }
            ).set('labels', {ok:'Eliminar', cancel:'Cancelar'});
        }
    }
};