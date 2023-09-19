import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from '../hook/useForm';
import "./LoginPage.css"

export const LoginPage = () => {
  const navigate = useNavigate();
  const { usuario, contrasena, onInputChange } = useForm({
    usuario: '',
    contrasena: '',
  });
  console.log(useForm);

  const [error, setError] = useState(null);

  const onLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/usuario/login', {
        usuario: usuario,
        contrasena: contrasena,
      });

      if (response.status === 200) {
        // Inicio de sesión exitoso, redirige al usuario al dashboard o realiza otras acciones
        navigate('/dashboard', {
          replace: true,
          state: {
            logged: true,
            usuario,
          },
        });
      } else {
        // Si la respuesta no es exitosa, muestra un mensaje de error basado en la respuesta
        if (response.data.error === 'usuario_incorrecto') {
          setError('Usuario incorrecto');
        } else if (response.data.error === 'contrasena_incorrecta') {
          setError('Contraseña incorrecta');
        } else {
          setError('Error al iniciar sesión verifique sus datos');
        }        
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión Datos Incorrectos');
    }
  };

  return (
    <div className='wrapper'>
      <form onSubmit={onLogin}>
        <h1>Iniciar Sesión</h1>
        {error && <div className="error-message">{error}</div>}
        <div className='input-group'>
          <input
            type='text'
            name='usuario'
            value={usuario}
            onChange={onInputChange}
            required
            autoComplete='off'
          />
          <label htmlFor='usuario'>Usuario:</label>
        </div>
        <div className='input-group'>
          <input
            type='password'
            name='contrasena'
            value={contrasena}
            onChange={onInputChange}
            required
            autoComplete='off'
          />
          <label htmlFor='contrasena'>Contraseña:</label>
        </div>        
        <button>Iniciar Sesión</button>
      </form>
    </div>
  );
};