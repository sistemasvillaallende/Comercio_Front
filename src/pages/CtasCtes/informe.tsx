// Importar los componentes necesarios de la biblioteca
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Crear un componente que representa el documento PDF
const MiDocumento = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Hola Mundo!</Text>
        <Text style={styles.text}>Este es un ejemplo de cómo usar @react-pdf/renderer con TypeScript.</Text>
      </View>
    </Page>
  </Document>
);

// Definir los estilos del documento
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    textAlign: 'center'
  },
  text: {
    fontSize: 12,
    textAlign: 'justify'
  }
});

// Exportar el componente
export default MiDocumento;

