const materias = {
    template: `
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <h5 class="card-title mb-3">Registro de Materias</h5>
                <div class="row g-3">
                    <div class="col-md-3">
                        <label class="form-label small">Código:</label>
                        <input v-model="materia.codigo" type="text" class="form-control form-control-sm">
                    </div>
                    <div class="col-md-7">
                        <label class="form-label small">Nombre de la Materia:</label>
                        <input v-model="materia.nombre" type="text" class="form-control form-control-sm">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label small">UV:</label>
                        <input v-model="materia.uv" type="number" class="form-control form-control-sm">
                    </div>
                </div>
                <div class="mt-3">
                    <button @click="guardar" class="btn btn-primary btn-sm px-3">Guardar</button>
                    <button @click="nuevo" class="btn btn-secondary btn-sm px-3 ms-2">Nuevo</button>
                </div>
            </div>
        </div>`,
    data() {
        return {
            materia: { idMateria: '', codigo: '', nombre: '', uv: '' }
        }
    },
    methods: {
        guardar() {
            if (!this.materia.idMateria) this.materia.idMateria = uuid.v4();
            window.dbInstance.run("INSERT OR REPLACE INTO materias (idMateria, codigo, nombre, uv) VALUES (?, ?, ?, ?)", 
                [this.materia.idMateria, this.materia.codigo, this.materia.nombre, this.materia.uv]);
            window.guardarCambios();
            alertify.success("Materia guardada");
            this.nuevo();
            this.$emit('buscar');
        },
        modificarMateria(datos) {
            this.materia = { ...datos };
        },
        nuevo() {
            this.materia = { idMateria: '', codigo: '', nombre: '', uv: '' };
        }
    }
};