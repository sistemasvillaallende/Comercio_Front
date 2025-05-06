import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
import Swal from 'sweetalert2';

interface ConceptoBase {
  cod_concepto_iyc: number;
  des_concepto_iyc: string;
  suma: boolean;
}

interface Concepto {
  cod_concepto_iyc: number;
  des_concepto_iyc: string;
  porcentaje: number;
  monto: number;
  vencimiento: string;
  nro_decreto: number;
  observaciones: string;
}

interface NuevoConceptoModalProps {
  open: boolean;
  onClose: () => void;
  legajo: string;
  onConceptoCreado: () => void;
  conceptoEditar?: Concepto;
  modo: 'crear' | 'editar';
  style?: React.CSSProperties;
}

const NuevoConceptoModal: React.FC<NuevoConceptoModalProps> = ({
  open,
  onClose,
  legajo,
  onConceptoCreado,
  conceptoEditar,
  modo,
  style
}) => {
  const [conceptosBase, setConceptosBase] = useState<ConceptoBase[]>([]);
  const [formData, setFormData] = useState({
    cod_concepto_iyc: '',
    porcentaje: '',
    monto: '',
    vencimiento: dayjs().format('YYYY-MM-DDTHH:mm:ss.SS'),
    nro_decreto: '',
    observaciones: ''
  });

  useEffect(() => {
    const fetchConceptosBase = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_BASE}Conceptos_iyc/readConceptos`);
        setConceptosBase(response.data);
      } catch (error) {
        console.error('Error al cargar conceptos base:', error);
      }
    };

    if (open) {
      fetchConceptosBase();
    }
  }, [open]);

  useEffect(() => {
    if (conceptoEditar && modo === 'editar') {
      setFormData({
        cod_concepto_iyc: conceptoEditar.cod_concepto_iyc.toString(),
        porcentaje: conceptoEditar.porcentaje.toString(),
        monto: conceptoEditar.monto.toString(),
        vencimiento: dayjs(conceptoEditar.vencimiento).format('YYYY-MM-DDTHH:mm:ss.SS'),
        nro_decreto: conceptoEditar.nro_decreto.toString(),
        observaciones: conceptoEditar.observaciones
      });
    }
  }, [conceptoEditar, modo]);

  const handleSubmit = async () => {
    try {
      const conceptoSeleccionado = conceptosBase.find(
        c => c.cod_concepto_iyc === Number(formData.cod_concepto_iyc)
      );

      if (!conceptoSeleccionado) {
        throw new Error('Concepto no encontrado');
      }

      const payload = {
        legajo: Number(legajo),
        cod_concepto_iyc: Number(formData.cod_concepto_iyc),
        des_concepto_iyc: conceptoSeleccionado.des_concepto_iyc.trim(),
        porcentaje: Number(formData.porcentaje),
        monto: Number(formData.monto),
        vencimiento: formData.vencimiento.slice(0, 10), // Formato YYYY-MM-DD
        nro_decreto: formData.nro_decreto,
        objAuditoria: {
          id_auditoria: 0,
          fecha: dayjs().format('D/M/YYYY HH:mm:ss'), // Fecha actual
          usuario: "Usuario", // Cambiar si es dinámico
          proceso: "",
          identificacion: "",
          autorizaciones: "",
          observaciones: formData.observaciones,
          detalle: "",
          ip: ""
        }
      };

      console.log('Payload a enviar:', payload);

      const url = modo === 'crear'
        ? `${import.meta.env.VITE_URL_BASE}Conceptos_iyc/AddConcepto?usuario=Usuario`
        : `${import.meta.env.VITE_URL_BASE}Conceptos_iyc/UpdateConcepto?usuario=Usuario`;

      await axios.post(url, payload);

      onClose();

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: modo === 'crear'
          ? 'El concepto se ha creado correctamente'
          : 'El concepto se ha actualizado correctamente',
        confirmButtonText: 'Aceptar'
      });

      onConceptoCreado();

    } catch (error) {
      console.error('Error:', error);
      onClose();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: modo === 'crear'
          ? 'No se pudo crear el concepto. Por favor, intente nuevamente'
          : 'No se pudo actualizar el concepto. Por favor, intente nuevamente',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          position: 'fixed',
          top: '2%',
          margin: 90
        }
      }}
      style={style}
    >
      <DialogTitle>{modo === 'crear' ? 'Nuevo Concepto' : 'Editar Concepto'}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Concepto</InputLabel>
          <Select
            value={formData.cod_concepto_iyc}
            onChange={(e) => setFormData({ ...formData, cod_concepto_iyc: e.target.value })}
          >
            {conceptosBase.map((concepto) => (
              <MenuItem key={concepto.cod_concepto_iyc} value={concepto.cod_concepto_iyc}>
                {concepto.des_concepto_iyc.trim()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Porcentaje"
          type="number"
          value={formData.porcentaje}
          onChange={(e) => setFormData({ ...formData, porcentaje: e.target.value })}
          sx={{ mt: 2 }}
        />

        <TextField
          fullWidth
          label="Monto"
          type="number"
          value={formData.monto}
          onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
          sx={{ mt: 2 }}
        />

        <TextField
          fullWidth
          label="Vencimiento"
          type="datetime-local"
          value={formData.vencimiento.slice(0, 19)}
          onChange={(e) => {
            const newDate = dayjs(e.target.value).format('YYYY-MM-DDTHH:mm:ss.SS');
            setFormData({ ...formData, vencimiento: newDate });
          }}
          sx={{ mt: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          fullWidth
          label="Nro. Decreto"
          type="number"
          value={formData.nro_decreto}
          onChange={(e) => setFormData({ ...formData, nro_decreto: e.target.value })}
          sx={{ mt: 2 }}
        />

        <TextField
          fullWidth
          label="Observaciones"
          multiline
          rows={3}
          value={formData.observaciones}
          onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NuevoConceptoModal;