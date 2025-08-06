import { Producto, Tienda } from "@/app/types";
import { getItem, handlerMain } from "@/app/utils";
import { Inter_300Light, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CarritoItem = {
  productoId: string;
  cantidad: number;
};

type ProductoFiltrado = Producto & {
  cantidad: number;
};

const ProductItem = ({ 
  product, 
  onAdd, 
  onRemove 
}: { 
  product: ProductoFiltrado; 
  onAdd: () => void; 
  onRemove: () => void; 
}) => (
  <View style={styles.productContainer}>
    <View style={styles.productImage} />
    <View style={styles.productDetails}>
      <Text style={styles.productName}>{product.nombre}</Text>
      <Text style={styles.productPrice}>${product.precio}</Text>
    </View>
    <View style={styles.productActions}>
      <TouchableOpacity onPress={onAdd} style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <Text style={styles.quantity}>{product.cantidad}</Text>
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>-</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function ItemCarrito() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [userId, setUserId] = useState('');
  const [notas, setNotas] = useState('');
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<ProductoFiltrado[]>([]);
  const [shopData, setShopData] = useState<Tienda | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [isLoad, setLoad] = useState<boolean>(true);
  const [isDelivery, setDelivery] = useState<boolean>(true);
  
  useFonts({ Inter_700Bold, Inter_600SemiBold, Inter_500Medium, Inter_300Light });

  const handlerPayment = () => {
    const detalles = productosFiltrados.map(product => ({
      productoId: product.id.toString(),
      cantidad: product.cantidad,
      precio_unitario: product.precio
    }));

    const subtotal = detalles.reduce((sum, item) => 
      sum + (item.precio_unitario * item.cantidad), 0
    );
    
    const total = isDelivery ? subtotal + 3 : subtotal;

    router.push({
      pathname: "/(main)/payment/[id]",
      params: {
        id: userId,
        tiendaId: id,
        isDelivery: isDelivery.toString(),
        total: total.toString(),
        detalles: JSON.stringify(detalles),
        notas: notas,
      },
    });
  };

 const handlerAddOrRemoveProduct = async (operation: string, productId: string) => {
  setCarrito(prev => {
    const existingItemIndex = prev.findIndex(item => item.productoId === productId);
    let newCarrito = [...prev];
    
    if (operation === "+") {
      if (existingItemIndex !== -1) {
        newCarrito[existingItemIndex] = {
          ...newCarrito[existingItemIndex],
          cantidad: newCarrito[existingItemIndex].cantidad + 1
        };
      } else {
        newCarrito.push({ productoId: productId, cantidad: 1 });
      }
    } else {
      if (existingItemIndex !== -1) {
        if (newCarrito[existingItemIndex].cantidad > 1) {
          newCarrito[existingItemIndex] = {
            ...newCarrito[existingItemIndex],
            cantidad: newCarrito[existingItemIndex].cantidad - 1
          };
        } else {
          newCarrito = newCarrito.filter(item => item.productoId !== productId);
        }
      }
    }
    
    // Actualizar AsyncStorage
    AsyncStorage.setItem(`carrito_${userId}_${id}`, JSON.stringify(newCarrito));
    
    // Actualizar productosFiltrados inmediatamente
    setProductosFiltrados(prevProducts => {
      return prevProducts.map(product => {
        if (product.id.toString() === productId) {
          const carritoItem = newCarrito.find(item => item.productoId === productId);
          return {
            ...product,
            cantidad: carritoItem ? carritoItem.cantidad : 0
          };
        }
        return product;
      }).filter(product => product.cantidad > 0); // Eliminar productos con cantidad 0
    });
    
    return newCarrito;
  });
};
  const obtenerProductos = async () => {
  try {
    // if (!userId || !id) return; // Asegurarse que tenemos ambos IDs
    
    const carritoKey = `carrito_${userId}_${id}`;
    console.log("Buscando carrito con clave:", carritoKey); // Debug
    
    const carritoRaw = await AsyncStorage.getItem(carritoKey);
    console.log("Datos crudos del carrito:", carritoRaw); // Debug
    
    if (!carritoRaw) {
      setProductosFiltrados([]);
      return;
    }
    
    const carritoData: CarritoItem[] = JSON.parse(carritoRaw);
    console.log("Datos parseados del carrito:", carritoData); // Debug
    
    if (!carritoData || carritoData.length === 0) {
      setProductosFiltrados([]);
      return;
    }
    
    const filterData = {
      tiendaId: id,
      ids: carritoData.map(item => item.productoId),
    };
    
    const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/product/preorder/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filterData),
    });

    if (!response.ok) throw new Error('Error en la petición');
    
    const productos: Producto[] = await response.json();
    console.log("Productos obtenidos del API:", productos); // Debug
    
    const productosConCantidad = productos.map(producto => {
      const carritoItem = carritoData.find(item => item.productoId === producto.id.toString());
      return {
        ...producto,
        cantidad: carritoItem?.cantidad || 0
      };
    });
    
    console.log("Productos con cantidad:", productosConCantidad); // Debug
    setProductosFiltrados(productosConCantidad);
    setCarrito(carritoData); // Asegurar que el estado carrito esté sincronizado
  } catch (error) {
    console.error('Error al obtener productos:', error);
    setProductosFiltrados([]);
  }
};

  const getShopName = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/shop/${id}`);
      if (!response.ok) throw new Error('Error en la petición');
      setShopData(await response.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Calcular precio total
    const subtotal = productosFiltrados.reduce((sum, producto) => 
      sum + (producto.precio * producto.cantidad), 0
    );
    setPrice(subtotal);
  }, [productosFiltrados]);

  useFocusEffect(
    React.useCallback(() => {
      getItem('@userId', setUserId);
      setLoad(false);

      return () => {
        setLoad(true);
      };
    }, [])
  );

  useEffect(()=>{
     obtenerProductos();
      getShopName();
  },[isLoad])

  if (isLoad) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TouchableOpacity onPress={handlerMain} style={styles.backButton}>
        <Image
          style={styles.backIcon}
          contentFit="cover"
          source={require('../../../assets/images/arrowback.svg')}
        />
        <Text style={styles.carritoText}>Carrito</Text>    
      </TouchableOpacity>
      
      <Text style={styles.title}>Detalles del Pedido</Text>
      <Text style={styles.shopName}>
        {shopData ? shopData.nombre : "Cargando..."}
      </Text>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.productsScrollView}
        >
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((product, index) => (
              <ProductItem
                key={index}
                product={product}
                onAdd={() => handlerAddOrRemoveProduct("+", product.id.toString())}
                onRemove={() => handlerAddOrRemoveProduct("-", product.id.toString())}
              />
            ))
          ) : (
            <View style={styles.emptyCartContainer}>
              <Text style={styles.emptyCartText}>Tu carrito está vacío</Text>
            </View>
          )}
        </ScrollView>
      
        <View style={styles.deliveryOptions}>
          <View style={styles.deliveryButtons}>
            <TouchableOpacity 
              onPress={() => setDelivery(true)} 
              style={[
                styles.deliveryButton, 
                isDelivery && styles.selectedDeliveryButton
              ]}
            >
              <Text style={styles.deliveryButtonText}>Delivery</Text>
              <Image 
                source={require('../../../assets/images/delivery.svg')}
                contentFit="cover"
                style={styles.deliveryIcon}
              />
            </TouchableOpacity>  
            
            <TouchableOpacity 
              onPress={() => setDelivery(false)} 
              style={[
                styles.deliveryButton, 
                !isDelivery && styles.selectedDeliveryButton
              ]}
            >
              <Text style={styles.deliveryButtonText}>Retiro</Text>
              <Image 
                source={require('../../../assets/images/retiro.svg')}
                contentFit="cover"
                style={styles.deliveryIcon}
              />  
            </TouchableOpacity>  
          </View>
          
          <TextInput 
            value={notas} 
            onChangeText={setNotas} 
            style={styles.notesInput} 
            placeholder="Nota (Opcional)"
            placeholderTextColor="#828282"
          />
        </View>
      </KeyboardAvoidingView> 
      
      <View style={styles.summaryContainer}>
        <View style={styles.subtotalContainer}>
          <Text style={styles.summaryText}>Sub-Total</Text>
          <Text style={styles.summaryAmount}>${price}</Text>
        </View>
        
        {isDelivery && (
          <View style={styles.deliveryFeeContainer}>
            <Text style={styles.summaryText}>Delivery</Text>
            <Text style={styles.summaryAmount}>$3</Text>
          </View>
        )}
        
        <View style={styles.totalContainer}>
          <View style={styles.totalTextContainer}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalAmount}>${isDelivery ? price + 3 : price}</Text>
          </View>
          
          <TouchableOpacity 
            onPress={handlerPayment}
            style={styles.payButton}
            disabled={productosFiltrados.length === 0}
          >
            <Text style={styles.payButtonText}>Pagar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backIcon: {
    height: 32,
    width: 32,
    marginLeft: 5,
  },
  carritoText: {
    fontFamily: 'Inter_600SemiBold',
  },
  title: {
    marginLeft: 10,
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
  },
  shopName: {
    marginLeft: 10,
    fontFamily: 'Inter_300Light',
    fontSize: 15,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  productsScrollView: {
    maxHeight: 350,
    marginVertical: 10,
  },
  productContainer: {
    flexDirection: 'row',
    height: 103,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#828282',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.67,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    backgroundColor: "#ccc",
    height: 62,
    width: 62,
    borderRadius: 10,
    marginRight: 10,
  },
  productDetails: {
    flexDirection: 'column',
    maxWidth: 150,
    flex: 1,
  },
  productName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
  },
  productPrice: {
    fontFamily: 'Inter_700Bold',
    fontSize: 19,
    color: '#FF0000',
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: 10,
  },
  addButton: {
    height: 26,
    width: 26,
    justifyContent: 'center',
  },
  addButtonText: {
    textAlign: 'center',
    color: '#FF0000',
    fontWeight: 'bold',
  },
  removeButton: {
    height: 26,
    width: 26,
    backgroundColor: '#FF0000',
    borderRadius: 10,
    justifyContent: 'center',
  },
  removeButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  quantity: {
    height: 26,
    width: 26,
    textAlign: 'center',
    lineHeight: 26,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#828282',
  },
  deliveryOptions: {
    paddingHorizontal: 10,
  },
  deliveryButtons: {
    flexDirection: 'row',
    height: 73,
    justifyContent: 'space-between',
  },
  deliveryButton: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#828282',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 5,
  },
  selectedDeliveryButton: {
    borderColor: '#E94B64',
  },
  deliveryButtonText: {
    flex: 1,
    fontSize: 14,
    color: '#0000008A',
    fontFamily: 'Inter_500Medium',
  },
  deliveryIcon: {
    height: 50,
    width: 62,
  },
  notesInput: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#828282',
    height: 48,
    marginTop: 10,
    paddingHorizontal: 15,
    fontFamily: 'Inter_300Light',
  },
  summaryContainer: {
    backgroundColor: '#FF627B',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  deliveryFeeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  summaryText: {
    fontFamily: 'Inter_500Medium',
    color: '#fff',
  },
  summaryAmount: {
    width:75,
    fontFamily: 'Inter_500Medium',
    color: '#fff',
  },
  totalContainer: {
    backgroundColor: '#D61355',
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  totalText: {
    color: 'white',
    fontSize: 14,
    marginRight: 10,
    fontFamily: 'Inter_500Medium',
  },
  totalAmount: {
    color: 'white',
    fontSize: 24,
    fontWeight: '500',
    fontFamily: 'Inter_700Bold',
  },
  payButton: {
    backgroundColor: '#FFE8EC',
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  payButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#828282',
    fontFamily: 'Inter_600SemiBold',
  },
});