const busqueda_matriculas = {
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
                        <tr v-for="m in listaFiltrada" :key="m.idMatricula">
                            <td>{{ m.alumno }}</td>
                            <td>{{ m.materia }}</td>
                            <td>{{ m.docente }}</td>
                            <td class="text-center">
                                <button @click="eliminar(m.idMatricula)" class="btn btn-danger btn-sm py-0 px-2">Eliminar</button>
                            </td>
                        </tr>
                        <tr v-if="listaFiltrada.length == 0">
                            <td colspan="4" class="text-center py-3 text-muted">No hay matrículas registradas</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>`,
    data() {
        return { lista: [], listaFiltrada: [], filtro: '' }
    },
    mounted() {
        this.obtenerMatriculas();
    },
    methods: {
        obtenerMatriculas() {
            try {
                const sql = `
                    SELECT mt.idMatricula, a.nombre as alumno, m.nombre as materia, d.nombre as docente
                    FROM matricula mt
                    JOIN alumnos a ON mt.idAlumno = a.idAlumno
                    JOIN materias m ON mt.idMateria = m.idMateria
                    JOIN docentes d ON mt.idDocente = d.idDocente
                `;
                const res = window.dbInstance.exec(sql);
                this.lista = res.length > 0 ? res[0].values.map(f => {
                    let obj = {};
                    res[0].columns.forEach((col, i) => obj[col] = f[i]);
                    return obj;
                }) : [];
                this.filtrar();
            } catch (e) { this.lista = []; }
        },
        filtrar() {
            const b = this.filtro.toLowerCase();
            this.listaFiltrada = this.lista.filter(x => 
                x.alumno.toLowerCase().includes(b) || x.materia.toLowerCase().includes(b)
            );
        },
        eliminar(id) {
            alertify.confirm("SISTEMA UGB", "¿Eliminar esta matrícula?", () => {
                window.dbInstance.run("DELETE FROM matricula WHERE idMatricula = ?", [id]);
                window.guardarCambios();
                this.obtenerMatriculas();
                alertify.error("Eliminado");
            }, () => {});
        }
    }
};