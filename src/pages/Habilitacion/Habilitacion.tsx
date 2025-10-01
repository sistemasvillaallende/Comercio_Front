import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DataTable, { TableColumn } from "react-data-table-component";
import Swal from "sweetalert2";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import { useUserContext } from "../../context/UserProvider";
import { useIndustriaComercioContext } from "../../context/IndustriaComercioProvider";
import { generateRegularResolutionPDF, ResolutionData, CommerceData } from './PDFRegularResolution';
import { generateTransportResolutionPDF } from './PDFTransportResolution';

interface Resolution {
  legajo: number;
  nro_sucursal: number;
  nro_item: number;
  nro_res: string;
  fecha_inspeccion: string;
  fecha_hab: string;
  transporte: boolean;
  usuario: string;
  fecha: string;
}

interface Branch {
  legajo: number;
  nro_sucursal: number;
  des_com: string;
  nom_fantasia: string;
  cod_calle: number;
  nom_calle: string;
  nro_dom: number;
  cod_barrio: number;
  nom_barrio: string;
  ciudad: string;
  provincia: string;
  pais: string;
  cod_postal: string;
  nro_res: string;
  fecha_inicio: string;
  fecha_hab: string;
  nro_exp_mesa_ent: string;
  fecha_alta: string;
  cod_zona: string;
  nro_local: string;
  piso_dpto: string;
  vto_inscripcion: string;
}

interface NewResolutionForm {
  legajo: number;
  nro_sucursal: number;
  nro_res: string;
  fecha_inspeccion: string;
  fecha_hab: string;
  transporte: boolean;
  usuario: string;
}

const Habilitacion = () => {
  const { legajo } = useParams<{ legajo: string }>();
  const { user } = useUserContext();
  const { elementoIndCom } = useIndustriaComercioContext();

  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingBranches, setLoadingBranches] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<NewResolutionForm>({
    legajo: parseInt(legajo || '0'),
    nro_sucursal: 0,
    nro_res: '',
    fecha_inspeccion: new Date().toISOString().split('T')[0],
    fecha_hab: new Date().toISOString().split('T')[0],
    transporte: false,
    usuario: user?.userName || ''
  });

  // Load resolutions and branches on component mount
  useEffect(() => {
    if (legajo) {
      loadResolutions();
      loadBranches();
    }
  }, [legajo]);

  // Update user in form when user context changes
  useEffect(() => {
    if (user?.userName) {
      setFormData(prev => ({
        ...prev,
        usuario: user.userName
      }));
    }
  }, [user]);

  // Reset dates to current when modal opens
  useEffect(() => {
    if (showModal) {
      const currentDate = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        fecha_inspeccion: currentDate,
        fecha_hab: currentDate
      }));
    }
  }, [showModal]);

  const loadResolutions = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Resolution[]>(
        `${import.meta.env.VITE_URL_BASE}Resolucion_habilitacion/HistorialResoluciones?legajo=${legajo}`
      );

      // Sort by date descending (most recent first)
      const sortedResolutions = response.data.sort((a, b) =>
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );

      setResolutions(sortedResolutions);
    } catch (error) {
      console.error('Error loading resolutions:', error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar las resoluciones.",
        icon: "error",
        confirmButtonColor: "#27a3cf",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadBranches = async () => {
    try {
      setLoadingBranches(true);
      const response = await axios.get<Branch[]>(
        `${import.meta.env.VITE_URL_BASE}Indycom/GetSucurales?legajo=${legajo}`
      );

      setBranches(response.data);
    } catch (error) {
      console.error('Error loading branches:', error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar las sucursales.",
        icon: "error",
        confirmButtonColor: "#27a3cf",
      });
    } finally {
      setLoadingBranches(false);
    }
  };

  const handleDownloadPDF = async (resolution: Resolution) => {
    try {
      const commerceData: CommerceData = {
        titular: elementoIndCom?.titular,
        nombre: user?.nombre,
        apellido: user?.apellido,
        cuit_cuil: elementoIndCom?.nro_cuit,
        nom_fantasia: elementoIndCom?.nom_fantasia,
        nom_calle: elementoIndCom?.nom_calle,
        nro_dom: elementoIndCom?.nro_dom,
        nom_barrio: elementoIndCom?.nom_barrio,
        des_com: elementoIndCom?.des_com
      };

      if (resolution.transporte) {
        await generateTransportResolutionPDF(resolution, commerceData);
      } else {
        await generateRegularResolutionPDF(resolution, commerceData);
      }

      Swal.fire({
        title: "¡Éxito!",
        text: "Resolución descargada correctamente",
        icon: "success",
        confirmButtonColor: "#27a3cf",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      Swal.fire({
        title: "Error",
        text: "No se pudo generar el PDF de la resolución",
        icon: "error",
        confirmButtonColor: "#27a3cf",
      });
    }
  };

  const handleInputChange = (field: keyof NewResolutionForm, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitNewResolution = async () => {
    try {
      // Validate required fields
      if (!formData.nro_res.trim()) {
        Swal.fire({
          title: "Error",
          text: "El número de resolución es obligatorio.",
          icon: "error",
          confirmButtonColor: "#27a3cf",
        });
        return;
      }

      // Prepare data for API
      const postData = {
        legajo: formData.legajo,
        nro_sucursal: formData.nro_sucursal,
        nro_res: formData.nro_res,
        fecha_inspeccion: new Date(formData.fecha_inspeccion).toISOString(),
        fecha_hab: new Date(formData.fecha_hab).toISOString(),
        transporte: formData.transporte,
        usuario: formData.usuario
      };

      await axios.post(
        `${import.meta.env.VITE_URL_BASE}Resolucion_habilitacion/ConfirmarResolucionComercio`,
        postData
      );

      Swal.fire({
        title: "¡Éxito!",
        text: "Resolución creada correctamente",
        icon: "success",
        confirmButtonColor: "#27a3cf",
      });

      // Reset form and close modal
      const currentDate = new Date().toISOString().split('T')[0];
      setFormData({
        legajo: parseInt(legajo || '0'),
        nro_sucursal: 0,
        nro_res: '',
        fecha_inspeccion: currentDate,
        fecha_hab: currentDate,
        transporte: false,
        usuario: user?.userName || ''
      });
      setShowModal(false);

      // Reload resolutions
      loadResolutions();
    } catch (error) {
      console.error('Error creating resolution:', error);
      Swal.fire({
        title: "Error",
        text: "No se pudo crear la resolución.",
        icon: "error",
        confirmButtonColor: "#27a3cf",
      });
    }
  };

  // Define table columns
  const columns: TableColumn<Resolution>[] = [
    {
      name: "Nº Item",
      selector: (row) => row.nro_item,
      sortable: true,
      width: "80px"
    },
    {
      name: "Nº Resolución",
      selector: (row) => row.nro_res,
      sortable: true,
      width: "120px"
    },
    {
      name: "Fecha Inspección",
      selector: (row) => new Date(row.fecha_inspeccion).toLocaleDateString('es-AR'),
      sortable: true,
      width: "130px"
    },
    {
      name: "Fecha Habilitación",
      selector: (row) => new Date(row.fecha_hab).toLocaleDateString('es-AR'),
      sortable: true,
      width: "140px"
    },
    {
      name: "Transporte",
      selector: (row) => row.transporte ? "Sí" : "No",
      sortable: true,
      width: "100px",
      cell: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${row.transporte
          ? 'bg-blue-100 text-blue-800'
          : 'bg-gray-100 text-gray-800'
          }`}>
          {row.transporte ? "Sí" : "No"}
        </span>
      )
    },
    {
      name: "Fecha Creación",
      selector: (row) => new Date(row.fecha).toLocaleDateString('es-AR'),
      sortable: true,
      width: "130px"
    },
    {
      name: "Acciones",
      cell: (row) => (
        <Button
          size="sm"
          variant="outline-primary"
          onClick={() => handleDownloadPDF(row)}
          className="flex items-center gap-1"
        >
          <Lucide icon="Download" className="w-4 h-4" />
          PDF
        </Button>
      ),
      width: "100px",
      ignoreRowClick: true
    }
  ];

  return (
    <>
      <div className="flex flex-col h-full bg-white pt-5">
        <div className="pl-4 pr-4">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Habilitación - Legajo {legajo}
            </h1>
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2"
            >
              <Lucide icon="Plus" className="w-4 h-4" />
              Nueva Resolución
            </Button>
          </div>

          {/* Resolutions Table */}
          <div className="bg-white rounded-lg shadow">
            <DataTable
              columns={columns}
              data={resolutions}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 20, 50]}
              progressPending={loading}
              progressComponent={
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Cargando resoluciones...</span>
                </div>
              }
              noDataComponent={
                <div className="flex justify-center items-center py-8">
                  <span className="text-gray-500">No se encontraron resoluciones</span>
                </div>
              }
              customStyles={{
                headCells: {
                  style: {
                    backgroundColor: '#f8fafc',
                    fontWeight: 'bold',
                    fontSize: '14px',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* New Resolution Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Nueva Resolución</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Lucide icon="X" className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nº Resolución *
                </label>
                <input
                  type="text"
                  value={formData.nro_res}
                  onChange={(e) => handleInputChange('nro_res', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 4124/25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nº Sucursal
                </label>
                <select
                  value={formData.nro_sucursal}
                  onChange={(e) => handleInputChange('nro_sucursal', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loadingBranches}
                >
                  <option value={0}>Seleccionar sucursal</option>
                  {branches.map((branch) => (
                    <option key={branch.nro_sucursal} value={branch.nro_sucursal}>
                      {branch.nro_sucursal} - {branch.nom_fantasia} ({branch.nom_calle} {branch.nro_dom})
                    </option>
                  ))}
                </select>
                {loadingBranches && (
                  <p className="text-sm text-gray-500 mt-1">Cargando sucursales...</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inspección
                </label>
                <input
                  type="date"
                  value={formData.fecha_inspeccion}
                  onChange={(e) => handleInputChange('fecha_inspeccion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Habilitación
                </label>
                <input
                  type="date"
                  value={formData.fecha_hab}
                  onChange={(e) => handleInputChange('fecha_hab', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="transporte"
                  checked={formData.transporte}
                  onChange={(e) => handleInputChange('transporte', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="transporte" className="text-sm font-medium text-gray-700">
                  Es de transporte
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario
                </label>
                <input
                  type="text"
                  value={formData.usuario}
                  onChange={(e) => handleInputChange('usuario', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitNewResolution}
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Habilitacion