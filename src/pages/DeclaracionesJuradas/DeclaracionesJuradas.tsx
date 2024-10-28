import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Box
} from '@mui/material';
import VerDeclaracionesJuradas from './VerDeclaracionesJuradas';
import CrearDeclaracionJurada from './CrearDeclaracionJurada';
import IngresarDeclaracionJurada from './IngresarDeclaracionJurada';

const DeclaracionesJuradas = () => {
  const { legajo, transaccion } = useParams<{ legajo: string, transaccion: string }>();
  const [verDDJJ, setVerDDJJ] = useState<boolean>(true);
  const [crearDDJJ, setCrearDDJJ] = useState<boolean>(false);
  const [igresar, setIngresar] = useState<boolean>(false);
  const [titulo, setTitulo] = useState<string>('Declaraciones Juradas Presentadas');
  const [cancelar, setCancelar] = useState<boolean>(false)
  const navigate = useNavigate();

  const mostrarVerDDJJ = () => {
    setVerDDJJ(true);
    setCrearDDJJ(false);
    setTitulo('Declaraciones Juradas Presentadas');
  }

  const mostrarCrearDDJJ = () => {
    setVerDDJJ(false);
    setCrearDDJJ(true);
    setIngresar(false);
    setTitulo('Crear Declaración Jurada');
  }

  useEffect(() => {
    if (legajo && transaccion) {
      setIngresar(true);
      setVerDDJJ(false);
      setCrearDDJJ(false);
    } else {
      setIngresar(false);
      setVerDDJJ(true);
    }
  }, [legajo, transaccion]);

  const cancelarDDJJ = () => {
    setVerDDJJ(true);
    setCrearDDJJ(false);
    navigate(`/${legajo}/declaraciones-juradas`);
  }

  return (
    <div className='paginas'>
      <h2>{titulo}</h2>
      <Box component="form" sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button variant="contained" color="primary" onClick={mostrarVerDDJJ} disabled={verDDJJ}>
          EMITIDAS
        </Button>
        <Button variant="contained" color="info" onClick={mostrarCrearDDJJ} disabled={crearDDJJ}>
          PENDIENTES
        </Button>
        {igresar &&
          <>
            <Button variant="contained" color="error" onClick={cancelarDDJJ}>Cancelar</Button>
          </>}
      </Box>
      {verDDJJ && <VerDeclaracionesJuradas />}
      {crearDDJJ && <CrearDeclaracionJurada setCancelar={setCancelar} />}
      {igresar && <IngresarDeclaracionJurada />}
    </div>
  );
};

export default DeclaracionesJuradas;