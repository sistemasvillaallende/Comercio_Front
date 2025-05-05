import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { RubroDeclaracion } from '../../interfaces/Comercio';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';
import Swal from 'sweetalert2';
import { useUserContext } from "../../context/UserProvider";

const IngresarDeclaracionJurada = () => {
  const { legajo, transaccion } = useParams<{ legajo: string, transaccion: string }>();
  const [rubros, setRubros] = useState<RubroDeclaracion[]>([]);
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    const fetchRubros = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_BASE}Indycom/ListaRubrosDJIyC?nro_transaccion=${transaccion}&legajo=${legajo}`);
        setRubros(response.data);
      } catch (error) {
        console.error('Error al cargar los rubros:', error);
      }
    };

    fetchRubros();
  }, [legajo, transaccion]);

  const handleInputChange = (index: number, field: string, value: string | number) => {
    const newRubros = [...rubros];
    newRubros[index].rdji = {
      ...newRubros[index].rdji,
      [field]: value
    };
    setRubros(newRubros);
  };

  const handleAuditoria = async () => {
    const { value } = await Swal.fire({
      title: 'Autorización',
      input: 'textarea',
      inputPlaceholder: 'Observaciones',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: "#27a3cf",
      inputValidator: (value) => {
        if (!value) {
          return 'Debes ingresar un texto para continuar';
        }
      },
    });

    if (value) {
      handleEnviarDDJJ(value);
    }
  }

  const handleEnviarDDJJ = async (txtAuditoria: string) => {
    const body = {
      legajo: legajo,
      lst: rubros.map(rubro => ({
        nro_transaccion: rubro.rdji.nro_transaccion,
        cod_rubro: rubro.rdji.cod_rubro,
        cantidad: rubro.rdji.cantidad,
        importe: rubro.rdji.importe
      })),
      auditoria: {
        id_auditoria: 0,
        fecha: new Date().toISOString(),
        usuario: user?.userName,
        proceso: "declaracion jurada",
        identificacion: "identificacion",
        autorizaciones: "autorizaciones",
        observaciones: txtAuditoria,
        detalle: "detalle", // Reemplaza con el detalle real
        ip: "ip" // Reemplaza con la IP real
      }
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_URL_BASE}Indycom/updateRubrosDJIyC`, body);
      await Swal.fire({
        icon: 'success',
        title: 'Guardado correctramente!',
        text: 'Ahora debe finalizar la carga.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#27a3cf',
      });
      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al enviar la declaración jurada',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#27a3cf',
      });
      console.error('Error al enviar la declaración jurada:', error);
    }
  };

  const handleAuditoriaFinalizar = async () => {
    const { value } = await Swal.fire({
      title: 'Autorización',
      input: 'textarea',
      inputPlaceholder: 'Observaciones',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: "#27a3cf",
      inputValidator: (value) => {
        if (!value) {
          return 'Debes ingresar un texto para continuar';
        }
      },
    });

    if (value) {
      handleFinalizarCarga(value);
    }
  }

  const handleFinalizarCarga = async (txtAuditoria: string) => {
    const body = {
      legajo: legajo,
      objDDJJ: {
        nro_transaccion: transaccion,
        legajo: legajo,
        periodo: "2024/07", // Reemplaza con el periodo real si es necesario
        completa: true,
        fecha_presentacion_ddjj: new Date().toISOString(),
        presentacion_web: 1,
        cod_zona: "",
        cod_tipo_per: 0
      },
      auditoria: {
        id_auditoria: 0,
        fecha: new Date().toISOString(),
        usuario: user?.userName,
        proceso: "liquidacion",
        identificacion: "identificacion",
        autorizaciones: "autorizaciones",
        observaciones: txtAuditoria,
        detalle: "detalle",
        ip: "ip"
      }
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_URL_BASE}Indycom/LiquidarDJIyC`, body);
      console.log('Respuesta del servidor:', response.data);
      navigate(`/${legajo}/declaraciones-juradas`);
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al finalizar la carga: ' + error.message,
      });
      console.error('Error al finalizar la carga:', error);
    }
  };

  return (
    <>
      <div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Periodo</TableCell>
                <TableCell>Cod Rubro</TableCell>
                <TableCell>Rubro</TableCell>
                <TableCell>Nro Transacción</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Importe</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rubros.map((rubro, index) => (
                <TableRow key={rubro.nro_transaccion}>
                  <TableCell>{rubro.periodo}</TableCell>
                  <TableCell>{rubro.rdji.cod_rubro}</TableCell>
                  <TableCell>{rubro.concepto}</TableCell>
                  <TableCell>{rubro.rdji.nro_transaccion}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={rubro.rdji.cantidad}
                      onChange={(e) => handleInputChange(index, 'cantidad', parseFloat(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={rubro.rdji.importe}
                      onChange={(e) => handleInputChange(index, 'importe', parseFloat(e.target.value))}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className='mt-5' style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAuditoria}
        >
          Guardar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAuditoriaFinalizar}
        >
          Finalizar
        </Button>
      </div>
    </>
  );
};

export default IngresarDeclaracionJurada;