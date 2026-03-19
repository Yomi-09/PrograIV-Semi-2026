const matriculas = {
    template: `
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <h5 class="card-title mb-3">Registro de Matrícula</h5>
                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="small fw-bold">Alumno:</label>
                        <select v-model="registro.idAlumno" class="form-select form-select-sm">
                            <option value="">-- Seleccione Alumno --</option>
                            <option v-for="a in alumnos" :value="a.idAlumno">{{a.nombre}}</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="small fw-bold">Materia:</label>
                        <select v-model="registro.idMateria" class="form-select form-select-sm">
                            <option value="">-- Seleccione Materia --</option>
                            <option v-for="m in materias" :value="m.idMateria">{{m.nombre}}</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="small fw-bold">Docente:</label>
                        <select v-model="registro.idDocente" class="form-select form-select-sm">
                            <option value="">-- Seleccione Docente --</option>
                            <option v-for="d in docentes" :value="d.idDocente">{{d.nombre}}</option>
                        </select>
                    </div>
                </div>
                <div class="mt-3">
                    <button @click="guardar" class="btn btn-primary btn-sm px-4">Matricular</button>
                </div>
            </div>
        </div>`,
    data() {
        return {
            registro: { idMatricula: '', idAlumno: '', idMateria: '', idDocente: '' },
            alumnos: [], materias: [], docentes: []
        }
    },
    methods: {
        cargarDatos() {
            const resA = window.dbInstance.exec("SELECT idAlumno, nombre FROM alumnos");
            this.alumnos = resA.length > 0 ? resA[0].values.map(f => ({idAlumno: f[0], nombre: f[1]})) : [];
            const resM = window.dbInstance.exec("SELECT idMateria, nombre FROM materias");
            this.materias = resM.length > 0 ? resM[0].values.map(f => ({idMateria: f[0], nombre: f[1]})) : [];
            const resD = window.dbInstance.exec("SELECT idDocente, nombre FROM docentes");
            this.docentes = resD.length > 0 ? resD[0].values.map(f => ({idDocente: f[0], nombre: f[1]})) : [];
        },
        guardar() {
            this.registro.idMatricula = uuid.v4();
            window.dbInstance.run("INSERT INTO matricula VALUES (?, ?, ?, ?)", 
                [this.registro.idMatricula, this.registro.idAlumno, this.registro.idMateria, this.registro.idDocente]);
            window.guardarCambios();
            alertify.success("Matrícula realizada");
            this.$emit('buscar');
        }
    }
};