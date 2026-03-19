const busqueda_materias = {
    template: `
        <div class="mt-2">
            <div class="mb-2">
                <input v-model="filtro" @keyup="filtrar" type="text" class="form-control form-control-sm shadow-sm" placeholder="🔍 Buscar materia...">
            </div>
            <div class="table-responsive shadow-sm">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>CÓDIGO</th><th>NOMBRE</th><th>UV</th><th class="text-center">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white">
                        <tr v-for="m in listaFiltrada" :key="m.idMateria">
                            <td class="fw-bold">{{ m.codigo }}</td>
                            <td>{{ m.nombre }}</td>
                            <td>{{ m.uv }}</td>
                            <td class="text-center">
                                <button @click="$emit('modificar', m)" class="btn btn-info btn-sm text-white py-0 px-2">Editar</button>
                                <button @click="eliminar(m.idMateria)" class="btn btn-danger btn-sm py-0 px-2 ms-1">Eliminar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>`,
    data() { return { lista: [], listaFiltrada: [], filtro: '' } },
    mounted() { this.obtenerMaterias(); },
    methods: {
        obtenerMaterias() {
            const res = window.dbInstance.exec("SELECT * FROM materias");
            this.lista = res.length > 0 ? res[0].values.map(f => {
                let obj = {}; res[0].columns.forEach((col, i) => obj[col] = f[i]); return obj;
            }) : [];
            this.filtrar();
        },
        filtrar() {
            this.listaFiltrada = this.lista.filter(m => m.nombre.toLowerCase().includes(this.filtro.toLowerCase()));
        },
        eliminar(id) {
            alertify.confirm("SISTEMA", "¿Eliminar materia?", () => {
                window.dbInstance.run("DELETE FROM materias WHERE idMateria = ?", [id]);
                window.guardarCambios(); this.obtenerMaterias(); alertify.error("Eliminado");
            }, () => {});
        }
    }
};