new Vue({
    el: "#app",
    data: {
        autor: {},
        autores: [],
        buscarAutor: "",

        libro: {},
        libros: [],
        buscarLibro: ""
    },

    computed: {
        autoresFiltrados() {
            return this.autores.filter(a =>
                a.nombre.toLowerCase().includes(this.buscarAutor.toLowerCase()) ||
                a.codigo.toLowerCase().includes(this.buscarAutor.toLowerCase())
            );
        },
        librosFiltrados() {
            return this.libros.filter(l =>
                l.titulo.toLowerCase().includes(this.buscarLibro.toLowerCase()) ||
                l.isbn.toLowerCase().includes(this.buscarLibro.toLowerCase())
            );
        }
    },

    methods: {

        // ===== AUTORES =====
        async guardarAutor() {
            if (this.autor.idAutor) {
                await db.autores.update(this.autor.idAutor, this.autor);
            } else {
                await db.autores.add(this.autor);
            }
            this.autor = {};
            this.cargarAutores();
        },

        async cargarAutores() {
            this.autores = await db.autores.toArray();
        },

        editarAutor(a) {
            this.autor = Object.assign({}, a);
        },

        async eliminarAutor(id) {
            await db.autores.delete(id);
            this.cargarAutores();
        },

        // ===== LIBROS =====
        async guardarLibro() {
            if (this.libro.idLibro) {
                await db.libros.update(this.libro.idLibro, this.libro);
            } else {
                await db.libros.add(this.libro);
            }
            this.libro = {};
            this.cargarLibros();
        },

        async cargarLibros() {
            this.libros = await db.libros.toArray();
        },

        editarLibro(l) {
            this.libro = Object.assign({}, l);
        },

        async eliminarLibro(id) {
            await db.libros.delete(id);
            this.cargarLibros();
        }
    },

    mounted() {
        this.cargarAutores();
        this.cargarLibros();
    }
});