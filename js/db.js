const db = new Dexie("USSS094824_yomi", 1);

db.version(1).stores({
    autores: "++idAutor, codigo, nombre, pais, telefono",
    libros: "++idLibro, idAutor, isbn, titulo, editorial, edicion"
});