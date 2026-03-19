const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            forms: {
                alumnos: { mostrar: true },
                materias: { mostrar: false },
                docentes: { mostrar: false },
                matriculas: { mostrar: false },
                inscripciones: { mostrar: false }
            }
        }
    },
    methods: {
        abrirVentana(ventana) {
            Object.keys(this.forms).forEach(f => this.forms[f].mostrar = false);
            this.forms[ventana].mostrar = true;
            if((ventana === 'matriculas' || ventana === 'inscripciones') && this.$refs[ventana]) {
                this.$refs[ventana].cargarDatos();
            }
        },
        buscar(ref, metodo) {
            if (this.$refs[ref]) this.$refs[ref][metodo]();
        },
        modificar(comp, metodo, datos) {
            if (this.$refs[comp]) this.$refs[comp][metodo](datos);
        }
    }
});

// Registro con los nombres que tienes en tus archivos JS
app.component('alumnos', alumnos);
app.component('busqueda_alumnos', busqueda_alumnos);
app.component('materias', materias);
app.component('busqueda_materias', busqueda_materias);
app.component('docentes', docentes);
app.component('busqueda_docentes', busqueda_docentes);
app.component('matriculas', matriculas); // plural
app.component('busqueda_matriculas', busqueda_matriculas); // plural
app.component('inscripciones', inscripciones); // plural
app.component('busqueda_inscripciones', busqueda_inscripciones); // plural

async function iniciarSistema() {
    try {
        const config = { locateFile: f => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${f}` };
        const SQL = await initSqlJs(config);
        window.dbInstance = new SQL.Database();

        window.dbInstance.run(`
            CREATE TABLE IF NOT EXISTS alumnos (idAlumno TEXT PRIMARY KEY, codigo TEXT, nombre TEXT);
            CREATE TABLE IF NOT EXISTS materias (idMateria TEXT PRIMARY KEY, codigo TEXT, nombre TEXT, uv TEXT);
            CREATE TABLE IF NOT EXISTS docentes (idDocente TEXT PRIMARY KEY, codigo TEXT, nombre TEXT);
            CREATE TABLE IF NOT EXISTS matricula (idMatricula TEXT PRIMARY KEY, idAlumno TEXT, idMateria TEXT, idDocente TEXT);
            CREATE TABLE IF NOT EXISTS inscripcion (idInscripcion TEXT PRIMARY KEY, idAlumno TEXT, idMateria TEXT);
        `);
        
        window.guardarCambios = () => { console.log("DB Lista"); };
        app.mount('#app');
    } catch (e) { console.error(e); }
}

iniciarSistema();