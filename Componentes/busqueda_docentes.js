const busqueda_docentes = {
    template: `
        <div class="mt-2">
            <div class="mb-2">
                <input v-model="filtro" @keyup="filtrar" type="text" class="form-control form-control-sm shadow-sm" placeholder="🔍 Buscar docente...">
            </div>
            <div class="table-responsive shadow-sm">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-dark">
                        <tr><th>CÓDIGO</th><th>NOMBRE</th><th class="text-center">ACCIONES</th></tr>
                    </thead>
                    <tbody class="bg-white">
                        <tr v-for="d in listaFiltrada" :key="d.idDocente">
                            <td class="fw-bold">{{ d.codigo }}</td>
                            <td>{{ d.nombre }}</td>
                            <td class="text-center">
                                <button @click="$emit('modificar', d)" class="btn btn-info btn-sm text-white py-0 px-2">Editar</button>
                                <button @click="eliminar(d.idDocente)" class="btn btn-danger btn-sm py-0 px-2 ms-1">Eliminar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>`,
    data() { return { lista: [], listaFiltrada: [], filtro: '' } },
    mounted() { this.obtenerDocentes(); },
    methods: {
        obtenerDocentes() {
            const res = window.dbInstance.exec("SELECT * FROM docentes");
            this.lista = res.length > 0 ? res[0].values.map(f => {
                let obj = {}; res[0].columns.forEach((col, i) => obj[col] = f[i]); return obj;
            }) : [];
            this.filtrar();
        },
        filtrar() {
            this.listaFiltrada = this.lista.filter(d => d.nombre.toLowerCase().includes(this.filtro.toLowerCase()));
        },
        eliminar(id) {
            alertify.confirm("SISTEMA", "¿Eliminar docente?", () => {
                window.dbInstance.run("DELETE FROM docentes WHERE idDocente = ?", [id]);
                window.guardarCambios(); this.obtenerDocentes(); alertify.error("Eliminado");
            }, () => {});
        }
    }
};