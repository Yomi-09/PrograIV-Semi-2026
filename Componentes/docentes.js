const docentes = {
    template: `
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <h5 class="card-title mb-3">Registro de Docentes</h5>
                <div class="row g-3">
                    <div class="col-md-3">
                        <label class="form-label small">Código:</label>
                        <input v-model="docente.codigo" type="text" class="form-control form-control-sm">
                    </div>
                    <div class="col-md-9">
                        <label class="form-label small">Nombre Completo:</label>
                        <input v-model="docente.nombre" type="text" class="form-control form-control-sm">
                    </div>
                </div>
                <div class="mt-3">
                    <button @click="guardar" class="btn btn-primary btn-sm px-3">Guardar</button>
                    <button @click="nuevo" class="btn btn-secondary btn-sm px-3 ms-2">Nuevo</button>
                </div>
            </div>
        </div>`,
    data() { return { docente: { idDocente: '', codigo: '', nombre: '' } } },
    methods: {
        guardar() {
            if (!this.docente.idDocente) this.docente.idDocente = uuid.v4();
            window.dbInstance.run("INSERT OR REPLACE INTO docentes (idDocente, codigo, nombre) VALUES (?, ?, ?)", 
                [this.docente.idDocente, this.docente.codigo, this.docente.nombre]);
            window.guardarCambios(); alertify.success("Docente guardado");
            this.nuevo(); this.$emit('buscar');
        },
        modificarDocente(d) { this.docente = { ...d }; },
        nuevo() { this.docente = { idDocente: '', codigo: '', nombre: '' }; }
    }
};