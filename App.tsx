import React, { useRef, useState } from 'react';
import { StyleSheet, View, Dimensions, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

const { width } = Dimensions.get('window');

// Interfaz para el tipo Pueblo Mágico
interface PuebloMagico {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  region: Region;
}

// Coordenadas para UT Cancún
const UT_CANCUN: Region = {
  latitude: 21.0496,
  longitude: -86.8469,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// Lista de Pueblos Mágicos (puedes agregar más elementos)
const pueblosMagicos: PuebloMagico[] = [
  {
    id: '1',
    nombre: 'Izamal',
    descripcion: 'La ciudad de los conventos, conocida por su color amarillo.',
    imagen: require('./assets/izamal.jpg'), // Asegúrate de que el archivo exista en assets
    region: {
      latitude: 20.9303,
      longitude: -89.0224,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    },
  },
  {
    id: '2',
    nombre: 'Valladolid',
    descripcion: 'Un hermoso pueblo colonial en el corazón de Yucatán.',
    imagen: require('./assets/valladolid.jpg'), // Asegúrate de que el archivo exista en assets
    region: {
      latitude: 20.68922,
      longitude: -88.1985,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    },
  },
  // Puedes agregar más pueblos mágicos aquí
  {
    id: '3',
    nombre: 'Tulum',
    descripcion: 'Famoso por sus ruinas mayas y playas de arena blanca.',
    imagen: require('./assets/tulum.jpg'), // Asegúrate de que el archivo exista en assets
    region: {
      latitude: 20.2124,
      longitude: -87.4647,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    },
  },
];

const App: React.FC = () => {
  const mapRef = useRef<MapView>(null);
  // Estado para el pueblo seleccionado
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Función para navegar a la región del pueblo y marcar la tarjeta seleccionada
  const goToRegion = (region: Region, id: string) => {
    setSelectedCard(id);
    if (mapRef.current) {
      mapRef.current.animateToRegion(region, 1000);
    }
  };

  // Renderizado de cada tarjeta, resaltando la seleccionada
  const renderItem = ({ item }: { item: PuebloMagico }) => (
    <View style={[styles.card, selectedCard === item.id && styles.selectedCard]}>
      <Image source={item.imagen} style={styles.image} />
      <Text style={[styles.title, selectedCard === item.id && styles.selectedTitle]}>{item.nombre}</Text>
      <Text style={styles.description}>{item.descripcion}</Text>
      <TouchableOpacity style={styles.button} onPress={() => goToRegion(item.region, item.id)}>
        <Text style={styles.buttonText}>Ir a ubicación</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={UT_CANCUN}>
        {/* Marcador en UT Cancún */}
        <Marker
          coordinate={UT_CANCUN}
          title="UT Cancún"
          description="Universidad Tecnológica de Cancún"
        />
        {/* Marcador extra para el pueblo seleccionado */}
        {selectedCard && (() => {
          const selectedPueblo = pueblosMagicos.find(p => p.id === selectedCard);
          if (selectedPueblo) {
            return (
              <Marker
                coordinate={selectedPueblo.region}
                title={selectedPueblo.nombre}
                description={selectedPueblo.descripcion}
                pinColor="green"
              />
            );
          }
          return null;
        })()}
      </MapView>
      <View style={styles.cardListContainer}>
        <FlatList
          data={pueblosMagicos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  cardListContainer: {
    position: 'absolute',
    bottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 10,
    padding: 10,
    width: width * 0.8,
    elevation: 2,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#000',
  },
  selectedTitle: {
    color: '#2196F3',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});