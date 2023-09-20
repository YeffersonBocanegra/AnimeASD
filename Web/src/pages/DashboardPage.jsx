import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importa axios
import './DashBoardPage.css';

export const DashboardPage = () => {
  const [data, setData] = useState([]);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Hacemos una solicitud a la API para obtener los animes
    fetch('http://localhost:3000/api/anime/mostrar')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));

    // Hacemos la solicitud a la API para obtener el usuario logeado
    axios.get('http://localhost:3000/api/usuario/login', { withCredentials: true })
      .then((response) => {
        // Si la solicitud es exitosa, establece el usuario en el estado
        setUsuario(response.data.usuario);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
 console.log(usuario);
  const handleRentClick = async (anime) => {
    try {
      if (!usuario) {
        // Si el usuario no está logeado, puedes redirigirlo a la página de inicio de sesión o mostrar un mensaje de error.
        console.log('El usuario no está logeado');
        return;
      }

      // Realiza una solicitud para alquilar el anime
      const response = await axios.post('http://localhost:3000/api/anime/alquiler', {
        cod_anime: anime.cod_anime, // Asegúrate de tener esta propiedad en tu objeto anime
        id_usu: usuario.id, // Suponiendo que usuario tiene una propiedad id
        cambiarEstado: true,
      }, { withCredentials: true });

      // Si la solicitud es exitosa, puedes mostrar un mensaje de éxito o realizar otras acciones necesarias
      console.log('Alquiler exitoso:', response.data);

      // Actualiza los datos nuevamente después del alquiler si es necesario
      // Esto depende de cómo quieras que se refleje el cambio en la lista de animes
    } catch (error) {
      // Maneja el error aquí, por ejemplo, mostrando un mensaje de error al usuario
      console.error('Error al alquilar:', error);
    }
  };

  return (
    <div>
      <h1 className="title">Animes</h1>
      {usuario && <p>Bienvenido, {usuario.nombre}</p>}
      <div className="animes">
        {data.map((d, i) => (
          <div key={i} className="producto">
            <div className="producto_img">
              <img src={d.imagen} alt="" />
            </div>
            <div className="producto_footer">
              <h1 className="titulo">{d.titulo}</h1>
              <h2 className="descripcion">{d.descripcion}</h2>
              <h2 className='price'>Uds: {d.cantidad_almacen}</h2>
              <h2 className='estado'>
                {d.estado === "0" ? "Alquilado" : "Disponible"}
              </h2>
              <p className="price">${d.precio}</p>
            </div>
            <div className="buttom">
              <button className="btn" onClick={() => handleRentClick(d)}>Alquilar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};




