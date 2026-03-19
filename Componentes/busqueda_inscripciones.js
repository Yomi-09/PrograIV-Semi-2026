const busqueda_inscripciones = {
    template: `
        <div class="mt-2">
            <div class="mb-2">
                <input v-model="filtro" @keyup="filtrar" type="text" class="form-control form-control-sm shadow-sm" placeholder="🔍 Buscar por alumno o materia...">
            </div>
            <div class="table-responsive shadow-sm">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>ALUMNO</th>
                            <th>MATERIA</th>
                            <th>DOCENTE</th>
                            <th class="text-center">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white">
                        <tr v-for="i in listaFiltrada" :key="i.idInscripcion">
                            <td>{{ i.alumno }}</td>
                            <td>{{ i.materia }}</td>
                            <td>{{ i.docente }}</td>
                            <td class="text-center">
                                <button @click="eliminar(i.idInscripcion)" class="btn btn-danger btn-sm py-0 px-2">Eliminar</button>
                            </td>
                        </tr>
                        <tr v-if="listaFiltrada.length == 0">
                            <td colspan="4" class="text-center py-3 text-muted">No hay inscripciones registradas</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>`,
    data() {
        return { lista: [], listaFiltrada: [], filtro: '' }
    },
    mounted() {
        this.obtenerInscripciones();
    },
    methods: {
        obtenerInscripciones() {
            try {
                // Consulta avanzada para traer nombres en lugar de IDs
                const sql = `
                    SELECT i.idInscripcion, a.nombre as alumno, m.nombre as materia, d.nombre as docente
                    FROM inscripciones i
                    JOIN alumnos a ON i.idAlumno = a.idAlumno
                    JOIN materias m ON i.idMateria = m.idMateria
                    JOIN docentes d ON i.idDocente = d.idDocente
                `;
                const res = window.dbInstance.exec(sql);
                this.lista = res.length > 0 ? res[0].values.map(f => {
                    let obj = {};
                    res[0].columns.forEach((col, i) => obj[col] = f[i]);
                    return obj;
                }) : [];
                this.filtrar();
            } catch (e) {
                this.lista = [];
            }
        },
        filtrar() {
            const busqueda = this.filtro.toLowerCase();
            this.listaFiltrada = this.lista.filter(i => 
                i.alumno.toLowerCase().includes(busqueda) || 
                i.materia.toLowerCase().includes(busqueda)
            );
        },
        eliminar(id) {
            alertify.confirm("SISTEMA UGB", "¿Eliminar esta inscripción?", () => {
                window.dbInstance.run("DELETE FROM inscripciones WHERE idInscripcion = ?", [id]);
                window.guardarCambios();
                this.obtenerInscripciones();
                alertify.error("Inscripción eliminada");
            }, () => {});
        }
    }
};