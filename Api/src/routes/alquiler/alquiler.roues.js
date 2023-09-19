import { Router } from 'express';
import { pool } from '../../db.js';

const router = Router();

// Ruta para alquilar un anime
router.post('/api/anime/estado', async (req, res) => {
    const { cod_anime } = req.body;

    try {
        // Realiza una transacción para garantizar la integridad de los datos
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        // Obtiene la cantidad actual de almacenamiento y el estado del anime
        const [animeRow] = await connection.query('SELECT cantidad_almacen, cantidad_alquilado, estado FROM anime WHERE cod_anime = ?', [cod_anime]);

        if (animeRow.length === 0) {
            await connection.rollback();
            connection.release();
            return res.status(404).json({ message: 'El Anime no Existe' });
        }

        const cantidadAlmacen = animeRow[0].cantidad_almacen;
        const cantidadAlquilado = animeRow[0].estado;

        if (cantidadAlmacen <= 0) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({ message: 'Anime No Disponible por Alquiler' });
        }

        // -1 Cantidad de almacenamiento / +1 Cantidad de alquiler
        const nuevaCantidadAlmacen = cantidadAlmacen - 1;
        const nuevaCantidadAlquilado = cantidadAlquilado + 1;
        
        // Actualiza la cantidad de almacenamiento y el estado del anime
        await connection.query('UPDATE anime SET cantidad_almacen = ?, cantidad_alquilado = ?, estado = ? WHERE cod_anime = ?', [nuevaCantidadAlmacen, nuevaCantidadAlquilado, nuevaCantidadAlmacen >= 1 ? 1 : 0, cod_anime]);
        
        // Confirma la transacción
        await connection.commit();
        connection.release();

        return res.status(200).json({ message: 'Anime alquilado con éxito' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error });
    }
});
//--------------------------------------------------------------------
router.post('/api/alquiler', async (req, res) => {
    const { cod_anime, id_usu, fecha_alquiler, fecha_devolucion } = req.body;

    try {
        // Realiza una transacción para garantizar la integridad de los datos
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        // Verifica que la fecha de devolución no sea superior a 8 días
        const fechaAlquilerObj = new Date(fecha_alquiler);
        const fechaDevolucionObj = new Date(fecha_devolucion);
        const diferenciaDias = (fechaDevolucionObj - fechaAlquilerObj) / (1000 * 60 * 60 * 24);

        if (diferenciaDias > 8) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({ message: 'La fecha de devolución no puede ser superior a 8 días desde la fecha de alquiler' });
        }

        // Inserta el registro de alquiler en la base de datos
        await connection.query('INSERT INTO alquiler (cod_anime, id_usu, fecha_alquiler, fecha_devolucion) VALUES (?, ?, ?, ?)', [cod_anime, id_usu, fecha_alquiler, fecha_devolucion]);

        // Confirma la transacción
        await connection.commit();
        connection.release();

        return res.status(200).json({ message: 'Anime alquilado con éxito' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});



export default router;