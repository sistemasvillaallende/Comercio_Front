// src/components/Sidebar.tsx
import React from 'react';
import '../assets/css/components/_Sidebar.css';
import Lucide from '../base-components/Lucide';

const Sidebar: React.FC = () => {
  return (
    <><div className="sidebar">
      <h2><Lucide icon="Car" className="w-4 h-4 mr-2" style={{
        height: '40px', width: '40px',
        color: 'hsla(0, 0%, 13%, 1)'
      }} />
        <span style={{ paddingTop: '10px', paddingLeft: '0px' }}>Automotores</span> </h2>
      <ul>
        <li><a href="/notificacionescidi/#/oficina%20automotor/procuracion">Cambio de estado masivo</a></li>
        <li><a href="/notificacionescidi/#/oficina%20automotor/procuracion?id=nuevasemisiones">Procuraciones nuevas</a></li>
      </ul>
      <h2><Lucide icon="Factory" className="w-4 h-4 mr-2" style={{
        height: '30px', width: '40px',
        color: 'hsla(0, 0%, 13%, 1)'
      }} />
        <span style={{ paddingTop: '10px', paddingLeft: '0px' }}>Industria y Comercio</span> </h2>
      <ul>
        <li><a href="/notificacionescidi/#/comercio%20e%20industria/procuracion/">Cambio de estado masivo</a></li>
        <li><a href="/notificacionescidi/#/comercio%20e%20industria/procuracion?id=nuevasemisiones">Procuraciones nuevas</a></li>
      </ul>
    </div></>
  );
};

export default Sidebar;
