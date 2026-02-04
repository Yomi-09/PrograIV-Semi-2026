const { createApp } = Vue;

createApp({
    data(){
        return{
            alumno:{
                codigo:"",
                nombre:"",
                direccion:"",
                municipio:"",
                departamento:"",
                email:"",
                telefono:"",
                fechaNacimiento:"",
                sexo:""
            },
            accion:'nuevo',
            id:0,
            buscar:'',
            alumnos:[]
        }
    },
    methods:{
        obtenerAlumnos() {
    let n = localStorage.length;
    this.alumnos = [];
    let busqueda = this.buscar.toUpperCase(); 

    for (let i = 0; i < n; i++) {
        let key = localStorage.key(i);
        if (!isNaN(key)) {
            let data = JSON.parse(localStorage.getItem(key));
            
            
            if (
                data.nombre.toUpperCase().includes(busqueda) ||
                data.codigo.toUpperCase().includes(busqueda) ||
                data.telefono.toUpperCase().includes(busqueda) ||
                data.municipio.toUpperCase().includes(busqueda) ||
                data.email.toUpperCase().includes(busqueda) ||
                data.departamento.toUpperCase().includes(busqueda)
            ) {
                this.alumnos.push(data);
            }
        }
    }
},
        eliminarAlumno(id){
            if(confirm("¿Está seguro de eliminar el alumno?")){
                localStorage.removeItem(id);
                this.obtenerAlumnos();
            }
        },
        modificarAlumno(alumno){
            this.accion = 'modificar';
            this.id = alumno.id;
            this.alumno.codigo = alumno.codigo;
            this.alumno.nombre = alumno.nombre;
            this.alumno.direccion = alumno.direccion;
            this.alumno.municipio = alumno.municipio;
            this.alumno.departamento = alumno.departamento;
            this.alumno.email = alumno.email;
            this.alumno.telefono = alumno.telefono;
            this.alumno.fechaNacimiento = alumno.fechaNacimiento;
            this.alumno.sexo = alumno.sexo;
        },
        guardarAlumno() {
            let datos = {
                id: this.accion=='modificar' ? this.id : this.getId(),
                codigo: this.alumno.codigo,
                nombre: this.alumno.nombre,
                direccion: this.alumno.direccion,
                municipio: this.alumno.municipio,
                departamento: this.alumno.departamento,
                email: this.alumno.email,
                telefono: this.alumno.telefono,
                fechaNacimiento: this.alumno.fechaNacimiento,
                sexo: this.alumno.sexo
            };
            
            let codigoDuplicado = this.buscarAlumno(datos.codigo);
            if(codigoDuplicado && this.accion=='nuevo'){
                alert("El codigo del alumno ya existe, "+ codigoDuplicado.nombre);
                return;
            }
            localStorage.setItem( datos.id, JSON.stringify(datos));
            this.limpiarFormulario();
            this.obtenerAlumnos();
        },
        getId(){
            return new Date().getTime();
        },
        limpiarFormulario(){
            this.accion = 'nuevo';
            this.id = 0;
            this.alumno.codigo = '';
            this.alumno.nombre = '';
            this.alumno.direccion = '';
            this.alumno.municipio = '';
            this.alumno.departamento = '';
            this.alumno.email = '';
            this.alumno.telefono = '';
            this.alumno.fechaNacimiento = '';
            this.alumno.sexo = '';
        },
        buscarAlumno(codigo=''){
            let n = localStorage.length;
            for(let i = 0; i < n; i++){
                let key = localStorage.key(i);
                let datos = JSON.parse(localStorage.getItem(key));
                if(datos?.codigo && datos.codigo.trim().toUpperCase() == codigo.trim().toUpperCase()){
                    return datos;
                }
            }
            return null;
        }
    },
    mounted(){
        this.obtenerAlumnos();
    }
}).mount("#app");