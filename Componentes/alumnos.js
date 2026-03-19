const alumnos = {
    template: `
        <div class="card card-body mb-3 shadow-sm">
            <h5>Registro de Alumnos</h5>
            <div class="row g-3">
                <div class="col-md-4">
                    Código: <input v-model="alumno.codigo" class="form-control">
                </div>
                <div class="col-md-8">
                    Nombre: <input v-model="alumno.nombre" class="form-control">
                </div>
            </div>
            <div class="mt-3">
                <button @click="guardar" class="btn btn-primary">Guardar</button>
                <button @click="nuevo" class="btn btn-secondary ms-2">Nuevo</button>
            </div>
        </div>`,
    data() { return { alumno: { idAlumno: '', codigo: '', nombre: '' } } },
    methods: {
        guardar() {
            if(!this.alumno.idAlumno) this.alumno.idAlumno = uuid.v4();
            window.dbInstance.run("INSERT OR REPLACE INTO alumnos (idAlumno, codigo, nombre) VALUES (?, ?, ?)", 
                [this.alumno.idAlumno, this.alumno.codigo, this.alumno.nombre]);
            alertify.success("Guardado");
            this.nuevo();
            this.$emit('buscar');
        },
        modificarAlumno(d) { this.alumno = {...d}; },
        nuevo() { this.alumno = { idAlumno: '', codigo: '', nombre: '' }; }
    }
};