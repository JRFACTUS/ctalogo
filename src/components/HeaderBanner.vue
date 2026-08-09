<template>
  <div class="header-full-width">
    <!-- BARRA SUPERIOR NEGRA 100% ANCHO -->
    <div class="top-bar">
      <div class="top-bar-container">
        <div class="bar-left">
          <span class="bar-item">
            <i class="fa-regular fa-clock icon-small"></i>
            7:30 AM a 5:00 PM
          </span>

          <span class="bar-item location">
            <i class="fa-solid fa-location-dot icon-small pin"></i>
          ¡Te esperamos! Visítanos en Plaza Chacuiba. Estamos en el local 5-4A, dentro de la plaza. Al entrar, verás una papelería y Farmacia de la Salud; nuestro local está muy cerca.
          </span>
        </div>

        <div class="bar-right">
          <a href="#" class="social"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="https://wa.me/529322326619" target="_blank" class="social"><i class="fa-solid fa-phone"></i></a>
        </div>
      </div>
    </div>

    <!-- SECCIONES CENTRADAS A 1200PX -->
    <div class="centered-container">
      <!-- NAVBAR -->
      <nav class="navbar">
        <div class="brand">
          <i class="fa-solid fa-mobile-screen-button brand-logo"></i>
          <span class="brand-title">EcoTeapa2</span>
        </div>

        <div class="search-input-wrapper">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input 
            type="text" 
            v-model="busqueda"
            placeholder="Buscar teléfonos, fundas, accesorios..." 
            @input="alBuscar"
          />
        </div>

        <a :href="urlWhatsapp" target="_blank" class="btn-contact">
          <i class="fa-brands fa-whatsapp ws-icon"></i>
          Contactar Ventas
        </a>
      </nav>

      <!-- BANNER AZUL -->
      <div class="banner-blue">
        <div class="banner-text">
          <span class="badge">FACILIDADES DE PAGO</span>
          <h2>¿Quieres estrenar un celular a crédito?</h2>
          
          <p>
            Con <strong>Amigo Paguitos</strong> puedes obtener financiamiento rápido y llevarte tu equipo hoy mismo. 
            <strong>El precio de contado es diferente al precio a crédito.</strong> Acude a nuestra sucursal y conoce las opciones disponibles.
          </p>

          <!-- BLOQUE DE REQUISITOS -->
          <div class="requisitos-contenedor">
            <span class="requisitos-titulo">Requisitos mínimos:</span>
            <ul class="requisitos-lista">
              <li>
                <span class="req-icono">🪪</span>
                <span>Credencial de elector (INE)</span>
              </li>
              <li>
                <span class="req-icono">👥</span>
                <span>2 referencias personales</span>
              </li>
              <li>
                <span class="req-icono">📱</span>
                <span>Teléfono celular activo</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="banner-card">
          <img 
            src="https://easycel.mx/wp-content/uploads/2025/04/paguitos-post.jpg" 
            alt="Logo Amigo Paguitos" 
            class="img-amigo-paguitos"
          />
        </div>
      </div>

      <!-- TITULO Y DESPLEGABLE DE FILTROS -->
      <div class="catalog-subhead">
        <div>
          <h3>Catálogo de Productos</h3>
          <p>Filtra por marcas de teléfonos o accesorios</p>
        </div>

        <!-- SELECTOR DESPLEGABLE DE FILTROS DINÁMICO -->
        <div class="select-wrapper">
          <i class="fa-solid fa-filter select-icon"></i>
          
          <select 
            v-model="marcaSeleccionada" 
            @change="alCambiarFiltro"
            class="brand-select"
          >
            <option value="Todas">Todas las categorías</option>

            <!-- GRUPO DE TELÉFONOS -->
            <optgroup v-if="marcasTelefonos.length > 0" label="📱 Teléfonos">
              <option 
                v-for="marca in marcasTelefonos" 
                :key="marca" 
                :value="marca"
              >
                {{ marca }}
              </option>
            </optgroup>

            <!-- GRUPO DE ACCESORIOS -->
            <optgroup v-if="categoriasAccesorios.length > 0" label="🎧 Accesorios">
              <option 
                v-for="cat in categoriasAccesorios" 
                :key="cat" 
                :value="cat"
              >
                {{ cat }}
              </option>
            </optgroup>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'

// 1. Recibir productos desde Home.vue
const props = defineProps({
  productos: {
    type: Array,
    default: () => []
  }
})

// 2. Emisiones de eventos
const emit = defineEmits(['buscar', 'filtrarMarca'])

// 3. Variables de estado
const busqueda = ref('')
const marcaSeleccionada = ref('Todas')
const urlWhatsapp = ref('https://wa.me/529322326619')

// 4. Funciones
function alBuscar() {
  emit('buscar', busqueda.value)
}

function alCambiarFiltro() {
  emit('filtrarMarca', marcaSeleccionada.value)
}

// 5. Propiedades computadas para el selector dinámico
const marcasTelefonos = computed(() => {
  if (!props.productos || !Array.isArray(props.productos)) return []
  
  const marcas = props.productos
    .filter(p => p.tipo === 'telefono' && p.marca)
    .map(p => String(p.marca).trim())

  return [...new Set(marcas)].sort()
})

const categoriasAccesorios = computed(() => {
  if (!props.productos || !Array.isArray(props.productos)) return []

  const categorias = props.productos
    .filter(p => p.tipo !== 'telefono' && (p.categoria || p.marca))
    .map(p => String(p.categoria || p.marca).trim())

  return [...new Set(categorias)].sort()
})
</script>

<style scoped>
/* ESTILOS GENERALES Y ESTRUCTURA */
.header-full-width {
  width: 100%;
  background-color: #f8fafc;
}

.top-bar {
  background-color: #0f172a;
  color: #e2e8f0;
  font-size: 0.82rem;
  padding: 0.5rem 1rem;
}

.top-bar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bar-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.bar-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.icon-small {
  font-size: 0.85rem;
}

.pin {
  color: #ef4444;
}

.bar-right {
  display: flex;
  gap: 0.8rem;
}

.social {
  color: #e2e8f0;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.social:hover {
  color: #38bdf8;
}

.centered-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
}

/* NAVBAR */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.brand-logo {
  font-size: 1.6rem;
  color: #0f172a;
}

.brand-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0f172a;
}

/* BUSCADOR */
.search-input-wrapper {
  position: relative;
  flex: 1;
  max-width: 500px;
  min-width: 250px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.9rem;
  pointer-events: none;
}

.search-input-wrapper input {
  width: 100%;
  padding: 0.65rem 1rem 0.65rem 2.6rem;
  border-radius: 9999px;
  border: 1px solid #cbd5e1;
  font-size: 0.92rem;
  outline: none;
  box-sizing: border-box;
}

.search-input-wrapper input:focus {
  border-color: #0f172a;
}

/* BOTÓN CONTACTO */
.btn-contact {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #25d366;
  color: #ffffff;
  padding: 0.6rem 1.2rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.88rem;
  text-decoration: none;
  transition: background-color 0.2s;
}

.btn-contact:hover {
  background-color: #1eb857;
}

.ws-icon {
  font-size: 1.1rem;
}

/* BANNER AZUL (Tono azul marino elegante) */
.banner-blue {
  background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
  color: #ffffff;
  border-radius: 16px;
  padding: 2rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.15);
}

.banner-text {
  max-width: 650px;
}

.banner-text h2 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0.4rem 0;
  color: #f8fafc;
}

.banner-text p {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #cbd5e1;
  margin: 0;
}

.banner-text strong {
  color: #ffffff;
  font-weight: 600;
}

.badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.12);
  color: #93c5fd;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 0.25rem;
  border: 1px solid rgba(147, 197, 253, 0.2);
}

/* SECCIÓN REQUISITOS EN EL BANNER */
.requisitos-contenedor {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.requisitos-titulo {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #93c5fd;
  margin-bottom: 0.6rem;
}

.requisitos-lista {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
}

.requisitos-lista li {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #f1f5f9;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.08);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.req-icono {
  font-size: 0.95rem;
}

/* TARJETA E IMAGEN AMIGO PAGUITOS */
.banner-card {
  background: #ffffff;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.img-amigo-paguitos {
  max-width: 170px;
  width: 100%;
  height: auto;
  object-fit: contain;
  display: block;
}

/* SUBHEADER Y SELECT DESPLEGABLE */
.catalog-subhead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.catalog-subhead h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #0f172a;
}

.catalog-subhead p {
  margin: 0.2rem 0 0 0;
  font-size: 0.88rem;
  color: #64748b;
}

.select-wrapper {
  position: relative;
  min-width: 220px;
}

.select-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.85rem;
  color: #64748b;
  pointer-events: none;
  z-index: 1;
}

.brand-select {
  width: 100%;
  padding: 0.6rem 2.2rem 0.6rem 2.5rem;
  font-size: 0.92rem;
  font-weight: 600;
  color: #0f172a;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 9999px;
  cursor: pointer;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.brand-select:hover, 
.brand-select:focus {
  border-color: #0f172a;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.select-wrapper::after {
  content: "▼";
  font-size: 0.6rem;
  color: #64748b;
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

/* ADAPTACIÓN RESPONSIVA (CELULARES) */
@media (max-width: 768px) {
  .banner-blue {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
  }

  .banner-card {
    width: 100%;
    padding: 0.85rem 1rem;
  }

  .img-amigo-paguitos {
    max-width: 140px;
  }

  .requisitos-lista {
    flex-direction: column;
    gap: 0.5rem;
  }

  .requisitos-lista li {
    width: 100%;
  }
}
</style>