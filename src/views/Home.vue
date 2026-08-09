<template>
  <div class="home">
    <!-- Componente Superior: Cabecera, Buscador, Banner y Filtro de Marcas -->
   <!-- CÓDIGO CORREGIDO EN HOME.VUE -->
<HeaderBanner 
  :productos="productos"
  @buscar="manejarBusqueda" 
  @filtrarMarca="manejarFiltroMarca" 
/>

    <main class="contenido">

      <!-- BANNER DE ACTUALIZACIÓN DE CATÁLOGO -->
<div class="banner-actualizacion">
  <div class="icono-recuadro">
    <!-- Icono de recargar / actualizar en SVG -->
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
      <path d="M16 16h5v5"/>
    </svg>
  </div>
  
  <div class="texto-recuadro">
    <h4 class="titulo-banner">Estamos actualizando nuestro catálogo</h4>
    <p class="descripcion-banner">
      Poco a poco estaremos agregando nuevos productos. Si buscas algún producto en particular, consúltanos por WhatsApp.
    </p>
  </div>
</div>
      <!-- GRID DE PRODUCTOS -->
      <div class="grid-productos">
        <article v-for="p in productosVisibles" :key="p.id" class="tarjeta" :class="[
          p.tipo === 'telefono' ? 'tarjeta-tel' : 'tarjeta-acc',
          { agotada: p.agotado }
        ]">
          <div class="tarjeta-imagen">
            <img v-if="p.img" :src="p.img" :alt="p.nombre" />
            <div v-else class="imagen-vacia">Sin imagen</div>

            <div class="cintas">
              <span v-if="p.oferta" class="cinta cinta-oferta">Oferta</span>
              <span v-if="p.nuevo" class="cinta cinta-nuevo">Nuevo</span>
              <span v-if="p.agotado" class="cinta cinta-agotado">Agotado</span>
            </div>
          </div>

          <div class="tarjeta-cuerpo">
            <span class="tag" :class="p.tipo === 'telefono' ? 'tag-tel' : 'tag-acc'">
              {{ p.tipo }}
            </span>

            <h3 class="tarjeta-nombre">{{ p.nombre }}</h3>

            <p v-if="p.marca || p.categoria" class="tarjeta-categoria">
              {{ p.marca || p.categoria }}
            </p>

            <div class="tarjeta-precio">
              <span v-if="p.precioOferta" class="precio-tachado">
                ${{ formatoPrecio(p.precio) }}
              </span>

              <span class="precio-final">
                ${{ formatoPrecio(p.precioOferta || p.precio) }}
              </span>
            </div>

            <!-- BOTÓN MÁS INFO / AGOTADO -->
            <button class="btn-mas-info" :class="{ 'btn-deshabilitado': p.agotado }" :disabled="p.agotado"
              @click="abrirModal(p)">
              {{ p.agotado ? 'Agotado' : 'Más información' }}
            </button>
          </div>
        </article>
      </div>

      <!-- ELEMENTO CENTINELA (DETECTOR DE SCROLL AUTOMÁTICO) -->
      <div ref="observadorElemento" class="centinela-scroll">
        <div v-if="hayMasProductos" class="spinner"></div>

        <!-- MENSAJE DE FIN DE CATÁLOGO -->
        <div v-else-if="productosFiltrados.length > 0" class="fin-catalogo">
          🎉 Has llegado al final del catálogo
        </div>
      </div>
    </main>

    <Footer />

    <!-- INVOCACIÓN DEL COMPONENTE MODAL -->
    <ModalProducto :mostrar="mostrarModal" :producto="productoSeleccionado" @cerrar="cerrarModal"
      @consultarWhatsapp="consultarWhatsapp" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { db } from "../services/firebase"
import { ref as dbRef, onValue } from "firebase/database"

import ModalProducto from "../components/ModalProducto.vue"
import HeaderBanner from "../components/HeaderBanner.vue"
import Footer from "../components/Footer.vue"

const productos = ref([])
const cargando = ref(true) // <-- 1. NUEVA LÍNEA: Estado para controlar el Skeleton Loader

// Estados de Búsqueda y Filtro de Marca
const textoBusqueda = ref("")
const marcaSeleccionada = ref("Todas")

// Estado del Modal basado en ID para mantener reactividad en tiempo real
const mostrarModal = ref(false)
const productoIdSeleccionado = ref(null)

// --- LÓGICA DE CARGA DE 8 EN 8 (SCROLL INFINITO) ---
const limite = ref(8)
const observadorElemento = ref(null)
let observer = null

// Computed que busca dinámicamente el producto actualizado en la lista
const productoSeleccionado = computed(() => {
  return productos.value.find(p => p.id === productoIdSeleccionado.value) || null
})

// Funciones para recibir eventos del HeaderBanner
function manejarBusqueda(texto) {
  textoBusqueda.value = (texto || "").toLowerCase().trim()
}

function manejarFiltroMarca(marca) {
  marcaSeleccionada.value = marca
}

// Productos filtrados combinando Buscador + Marca
const productosFiltrados = computed(() => {
  return productos.value.filter(p => {
    const nombreProd = (p.nombre || "").toLowerCase()
    const marcaProd = (p.marca || p.categoria || "").toLowerCase()

    // 1. Filtro por marca
    const cumpleMarca =
      marcaSeleccionada.value === "Todas" ||
      marcaProd === marcaSeleccionada.value.toLowerCase()

    // 2. Filtro por texto en el buscador (nombre o marca)
    const cumpleBusqueda =
      !textoBusqueda.value ||
      nombreProd.includes(textoBusqueda.value) ||
      marcaProd.includes(textoBusqueda.value)

    return cumpleMarca && cumpleBusqueda
  })
})

// --- PRODUCTOS VISIBLES ---
const productosVisibles = computed(() => {
  return productosFiltrados.value.slice(0, limite.value)
})

// Evalúa si todavía quedan más productos por cargar
const hayMasProductos = computed(() => {
  return limite.value < productosFiltrados.value.length
})

// Si el usuario busca o cambia de filtro, se reinicia el contador a 8
watch(() => productosFiltrados.value, () => {
  limite.value = 8
})

function formatoPrecio(valor) {
  if (valor === undefined || valor === null || isNaN(valor)) return "0"
  return Number(valor).toLocaleString("es-MX")
}

function abrirModal(producto) {
  productoIdSeleccionado.value = producto.id
  mostrarModal.value = true
}

function cerrarModal() {
  mostrarModal.value = false
  productoIdSeleccionado.value = null
}

// Función para redirigir a WhatsApp
function consultarWhatsapp(producto) {
  if (!producto) return
  const numeroTelefono = "521234567890" // Reemplaza con tu número de WhatsApp real
  const mensaje = encodeURIComponent(`Hola, estoy interesado en el producto: ${producto.nombre}`)
  window.open(`https://wa.me/${numeroTelefono}?text=${mensaje}`, '_blank')
}

// ESCUCHA EN TIEMPO REAL CON FIREBASE + CONFIGURACIÓN DEL INTERSECTION OBSERVER
onMounted(() => {
  // 1. Cargar datos de Firebase
  onValue(dbRef(db, "productos"), (snapshot) => {
    const data = snapshot.val()
    if (data) {
      productos.value = Object.entries(data).map(([id, item]) => ({
        id,
        ...item
      }))
    } else {
      productos.value = []
    }

    cargando.value = false // <-- 2. NUEVA LÍNEA: Desactiva el esqueleto de carga al recibir los datos
  })

  // 2. Inicializar detector de scroll automático
  observer = new IntersectionObserver((entries) => {
    const primerElemento = entries[0]
    if (primerElemento.isIntersecting && hayMasProductos.value) {
      limite.value += 8
    }
  }, {
    rootMargin: '120px'
  })

  if (observadorElemento.value) {
    observer.observe(observadorElemento.value)
  }
})

// Desconectar el observador al desmontar el componente
onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.home {
  width: 100%;
  min-height: 100vh;
  background: #f8fafc;
  margin: 0;
  padding: 0;
}

/* CONTENIDO PRINCIPAL CENTRADO (1200PX) */
.contenido {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px 20px;
}

/* GRID DE PRODUCTOS */
.grid-productos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 20px;
}

/* TARJETA */
.tarjeta {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tarjeta:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.fin-catalogo {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 0.95rem;
  font-weight: 500;
}

.tarjeta.agotada {
  opacity: 0.55;
}

/* IMAGEN */
.tarjeta-imagen {
  height: 220px;
  background: #ffffff;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.tarjeta-imagen img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.imagen-vacia {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #94a3b8;
  font-size: 13px;
}

/* CINTAS DE ESTADO */
.cintas {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cinta {
  padding: 3px 8px;
  border-radius: 6px;
  color: white;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.cinta-oferta {
  background: #e11d48;
}

.cinta-nuevo {
  background: #059669;
}

.cinta-agotado {
  background: #475569;
}

/* CUERPO DE LA TARJETA */
.tarjeta-cuerpo {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.tag {
  width: max-content;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 9.5px;
  text-transform: uppercase;
  font-weight: 800;
}

.tag-tel {
  background: #dbeafe;
  color: #2563eb;
}

.tag-acc {
  background: #dcfce7;
  color: #15803d;
}

.tarjeta-nombre {
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  line-height: 1.3;
}

.tarjeta-categoria {
  color: #0284c7;
  font-size: 12px;
  font-weight: 700;
  margin: 0;
}

/* PRECIO */
.tarjeta-precio {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  padding-top: 8px;
}

.precio-tachado {
  color: #94a3b8;
  font-size: 12px;
  text-decoration: line-through;
}

.precio-final {
  color: #0f172a;
  font-size: 22px;
  font-weight: 900;
}

/* BOTÓN MÁS INFORMACIÓN */
.btn-mas-info {
  width: 100%;
  padding: 9px 12px;
  border: none;
  border-radius: 10px;
  background: #f1f5f9;
  color: #0f172a;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
  margin-top: 6px;
}

.btn-mas-info:hover {
  background: #e2e8f0;
}

.btn-mas-info:active {
  transform: scale(0.98);
}

/* ESTADO VACÍO */
.vacio {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
  font-size: 14.5px;
}

/* RESPONSIVE */
@media(max-width: 768px) {
  .contenido {
    padding: 0 14px 30px 14px;
  }

  .grid-productos {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .tarjeta-imagen {
    height: 160px;
  }

  .tarjeta-cuerpo {
    padding: 12px;
  }

  .tarjeta-nombre {
    font-size: 13.5px;
  }

  .precio-final {
    font-size: 18px;
  }
}

@media(max-width: 420px) {
  .grid-productos {
    grid-template-columns: 1fr;
  }
}

/* Banner de aviso idéntico a la imagen */
.banner-actualizacion {
  display: flex;
  align-items: center;
  gap: 14px;
  background-color: #fffdf0; /* Fondo crema claro */
  border: 1px solid #fde68a;  /* Borde dorado muy suave */
  border-radius: 14px;       /* Esquinas redondeadas */
  padding: 14px 18px;
  margin-bottom: 24px;
}

/* Recuadro naranja suave para el icono */
.icono-recuadro {
  width: 40px;
  height: 40px;
  background-color: #fef3c7; /* Fondo del cuadrito */
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d97706;           /* Color naranja/dorado del icono */
  flex-shrink: 0;
}

/* Textos */
.texto-recuadro {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.titulo-banner {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #78350f;            /* Color marrón/naranja oscuro */
}

.descripcion-banner {
  margin: 0;
  font-size: 0.88rem;
  color: #b45309;            /* Texto descriptivo cálido */
  line-height: 1.4;
}

/* Ajuste responsivo para celulares */
@media (max-width: 640px) {
  .banner-actualizacion {
    align-items: flex-start;
    padding: 12px 14px;
  }
  
  .icono-recuadro {
    width: 36px;
    height: 36px;
  }
}
</style>