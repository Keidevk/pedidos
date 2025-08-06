import { CarritoItem } from "@/app/types";
import { getItem } from "@/app/utils";
import { Inter_300Light, Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Tienda {
  id: string;
  userId: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  horarioApertura: string;
  horarioCierre: string;
  tiempoEntregaPromedio: number;
  costoEnvio: string;
  rating: string;
  fotosTienda: string[];
}

interface Producto {
  id: number;
  tiendaId: number;
  nombre: string;
  descripcion: string;
  precio: string;
  precioPromocion: string;
  categoria: string;
  ingrediente: string;
  disponibilidad: boolean;
  tiempoPreparacion: number;
  fotosProducto: string[];
  destacado: boolean;
}

// Funciones de servicio separadas
async function fetchShopProducts(id: string | string[]): Promise<Producto[]> {
  const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/product/getproducts/${id}`);
  if (!response.ok) throw new Error("Error al obtener productos");
  return await response.json();
}

async function fetchShopData(id: string | string[]): Promise<Tienda> {
  const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/shop/${id}`);
  if (!response.ok) throw new Error("Error al obtener datos de tienda");
  return await response.json();
}

export default function Shops() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({ Inter_600SemiBold, Inter_300Light, Inter_400Regular });
  
  const [isLoading, setLoading] = useState(true);
  const [shopData, setShopData] = useState<Tienda | null>(null);
  const [productData, setProductData] = useState<Producto[] | null>(null);
  const [userId,setUserId] = useState(''); // Reemplazar con ID real del usuario


  useEffect(()=>{
    getItem('@userId',setUserId)
  },[])

  // Función mejorada para agregar al carrito
  const agregarAlCarrito = async (productoId: string, tiendaId: string) => {
    try {
      const carritoKey = `carrito_${userId}_${tiendaId}`;
      const carritoRaw = await AsyncStorage.getItem(carritoKey);
      const carritoActual: CarritoItem[] = carritoRaw ? JSON.parse(carritoRaw) : [];

      const productoExistente = carritoActual.find(item => item.productoId === productoId);
      const carritoActualizado = productoExistente
        ? carritoActual.map(item =>
            item.productoId === productoId
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          )
        : [...carritoActual, { 
            productoId, 
            cantidad: 1, 
            tiendaId,
            clienteId: userId 
          }];

      await AsyncStorage.setItem(carritoKey, JSON.stringify(carritoActualizado));
      Alert.alert("Éxito", "Producto agregado al carrito");
      console.log('🛒 Producto agregado:', { productoId, tiendaId });
    } catch (error) {
      console.error('❌ Error al agregar al carrito:', error);
      Alert.alert("Error", "No se pudo agregar el producto al carrito");
    }
  };

  const handlerProduct = (id: number) => {
    router.push({ pathname: '/(main)/product/[id]', params: { id } });
  };

  // Carga inicial de datos
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [shop, products] = await Promise.all([
          fetchShopData(id),
          fetchShopProducts(id)
        ]);
        setShopData(shop);
        setProductData(products);
      } catch (error) {
        console.error("Error loading data:", error);
        Alert.alert("Error", "No se pudieron cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (!fontsLoaded || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!shopData || !productData) {
    return (
      <View style={styles.errorContainer}>
        <Text>No se pudieron cargar los datos de la tienda</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header de la tienda */}
      <View style={styles.shopHeader}>
        <View style={styles.shopImage} />
        <Text style={styles.shopName}>{shopData.nombre}</Text>
        <Text style={styles.shopDescription}>{shopData.descripcion}</Text>
        <Text style={styles.shopLocation}>{shopData.ubicacion}</Text>
      </View>

      {/* Lista de productos */}
      <ScrollView 
        contentContainerStyle={styles.productsContainer}
        showsVerticalScrollIndicator={false}
      >
        {productData.map((product, index) => (
          <ProductCard 
            key={index}
            product={product}
            onPress={() => handlerProduct(product.id)}
            onAddToCart={() => agregarAlCarrito(product.id.toString(), product.tiendaId.toString())}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// Componente ProductCard separado para mejor organización
const ProductCard = ({ 
  product, 
  onPress, 
  onAddToCart 
}: { 
  product: Producto; 
  onPress: () => void; 
  onAddToCart: () => void;
}) => (
  <View style={styles.productCardContainer}>
    <View style={styles.productImage} />
    <TouchableOpacity onPress={onPress}>
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{product.nombre}</Text>
        <Text style={styles.productDescription}>
          {product.descripcion.length > 25 
            ? `${product.descripcion.substring(0, 25)}...` 
            : product.descripcion}
        </Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>${product.precio}</Text>
          <TouchableOpacity onPress={onAddToCart} style={styles.addButton}>
            <Image
              style={styles.addIcon}
              source={require('../../../assets/images/Plus.svg')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  </View>
);

// Estilos organizados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopHeader: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  shopImage: {
    marginHorizontal: -20,
    backgroundColor: '#aaa',
    height: 200,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
  },
  shopName: {
    marginTop: 10,
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
  },
  shopDescription: {
    color: '#aaa',
    marginTop: 10,
  },
  shopLocation: {
    fontFamily: 'Inter_600SemiBold',
    marginTop: 10,
    marginBottom: 20,
  },
  productsContainer: {
    backgroundColor: '#FF627B',
    paddingHorizontal: 10,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    paddingBottom: 50,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  productCardContainer: {
    marginBottom: 20,
  },
  productImage: {
    backgroundColor: '#ccc',
    height: 90,
    width: 125,
    borderRadius: 10,
    marginHorizontal: 10,
    position: 'relative',
    bottom: -20,
    zIndex: -100,
  },
  productDetails: {
    position:'relative',
    top:10,
    zIndex:-100,
    marginRight: 20,
    backgroundColor: 'white',
    width: 150,
    height: 150,
    borderRadius: 10,
    padding: 5,
  },
  productName: {
    fontFamily: 'Inter_600SemiBold',
    height: 35,
  },
  productDescription: {
    fontFamily: 'Inter_300Light',
  },
  productFooter: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  productPrice: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  addButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  addIcon: {
    height: 28,
    width: 28,
  },
})