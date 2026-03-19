const inscripciones = {
    template: `
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <h5 class="card-title mb-3">Nueva Inscripción</h5>
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
                    <button @click="guardar" class="btn btn-success w-100 shadow-sm">Finalizar Inscripción</button>
                </div>
            </div>
        </div>`,
    data() {
        return {
            registro: { idInscripcion: '', idAlumno: '', idMateria: '', idDocente: '' },
            alumnos: [],
            materias: [],
            docentes: []
        }
    },
    mounted() {
        this.cargarDatos();
    },
    methods: {
        cargarDatos() {
            try {
                const resA = window.dbInstance.exec("SELECT idAlumno, nombre FROM alumnos");
                this.alumnos = resA.length > 0 ? resA[0].values.map(f => ({idAlumno: f[0], nombre: f[1]})) : [];
                
                const resM = window.dbInstance.exec("SELECT idMateria, nombre FROM materias");
                this.materias = resM.length > 0 ? resM[0].values.map(f => ({idMateria: f[0], nombre: f[1]})) : [];
                
                const resD = window.dbInstance.exec("SELECT idDocente, nombre FROM docentes");
                this.docentes = resD.length > 0 ? resD[0].values.map(f => ({idDocente: f[0], nombre: f[1]})) : [];
            } catch (e) {
                console.error("Error al cargar selects:", e);
            }
        },
        guardar() {
            // Validación de campos vacíos
            if(!this.registro.idAlumno || !this.registro.idMateria || !this.registro.idDocente) {
                alertify.error("Debe seleccionar todos los campos");
                return;
            }

            try {
                this.registro.idInscripcion = uuid.v4();
                
                // Usamos el nombre de tabla 'inscripcion' que está en tu main.js
                const sql = "INSERT INTO inscripcion (idInscripcion, idAlumno, idMateria, idDocente) VALUES (?, ?, ?, ?)";
                window.dbInstance.run(sql, [
                    this.registro.idInscripcion, 
                    this.registro.idAlumno, 
                    this.registro.idMateria, 
                    this.registro.idDocente
                ]);
                
                window.guardarCambios();
                alertify.success("Inscripción guardada correctamente");
                
                // Limpiar formulario y refrescar tabla
                this.registro = { idInscripcion: '', idAlumno: '', idMateria: '', idDocente: '' };
                this.$emit('buscar'); 

            } catch (e) {
                console.error("Error al guardar:", e);
                alertify.error("Error al guardar en la base de datos");
            }
        }
    }
};