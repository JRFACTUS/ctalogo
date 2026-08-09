<template>
  <div v-if="mostrar && producto" class="modal-overlay" @click.self="cerrarModal">
    <div class="modal-card">
      <button class="btn-cerrar" @click="cerrarModal">&times;</button>

      <!-- ENCABEZADO Y FOTO -->
      <div class="modal-header">
        <div class="modal-imagen">
          <img
            v-if="producto.img"
            :src="producto.img"
            :alt="producto.nombre"
          />
          <div v-else class="imagen-vacia">Sin imagen</div>
        </div>

        <div class="modal-info-header">
          <span
            class="tag"
            :class="producto.tipo === 'telefono' ? 'tag-tel' : 'tag-acc'"
          >
            {{ producto.tipo }}
          </span>

          <h2 class="modal-titulo">{{ producto.nombre }}</h2>
          <p class="modal-categoria">
            {{ producto.marca || producto.categoria }}
          </p>

          <div class="modal-precio">
            <span v-if="producto.precioOferta" class="precio-tachado">
              ${{ formatoPrecio(producto.precio) }}
            </span>
            <span class="precio-final">
              ${{ formatoPrecio(producto.precioOferta || producto.precio) }}
            </span>
          </div>
        </div>
      </div>

      <!-- CUERPO / DETALLES -->
      <div class="modal-body">
        <!-- DESCRIPCIÓN FORMATEADA EN PUNTOS/PARRAFOS -->
        <div v-if="lineasDescripcion.length > 0" class="modal-desc-completa">
          <p class="titulo-seccion">Descripción y Características:</p>
          <ul class="lista-desc">
            <li v-for="(linea, idx) in lineasDescripcion" :key="idx">
              {{ linea }}
            </li>
          </ul>
        </div>

        <!-- ESPECIFICACIONES SI EXISTEN (OBJETO) -->
        <div
          v-if="producto.especificaciones"
          class="modal-especificaciones"
        >
          <div
            v-for="(val, clave) in producto.especificaciones"
            :key="clave"
            class="especificacion-item"
          >
            <span class="especificacion-clave">{{ clave }}:</span>
            <span class="especificacion-valor">{{ val }}</span>
          </div>
        </div>

        <!-- SIN INFORMACIÓN -->
        <div
          v-if="lineasDescripcion.length === 0 && !producto.especificaciones"
          class="vacio-modal"
        >
          No hay características detalladas adicionales registradas para este producto.
        </div>
      </div>

      <!-- PIE DEL MODAL CON BOTÓN WHATSAPP -->
      <div class="modal-footer">
        <button class="btn-whatsapp" @click="consultarWhatsapp">
          <svg class="icono-wa" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.762.459 3.48 1.332 5.001L2 22l5.127-1.339c1.468.802 3.125 1.223 4.881 1.224h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.667-1.037-5.175-2.924-7.062C17.189 3.037 14.68 2 12.012 2zm5.827 14.167c-.246.692-1.229 1.267-1.705 1.341-.453.071-1.033.102-1.666-.101-.383-.122-.876-.282-1.517-.558-2.684-1.155-4.429-3.87-4.563-4.05-.133-.178-1.09-1.45-1.09-2.766 0-1.316.689-1.961.934-2.222.246-.26.536-.326.715-.326.179 0 .358.001.513.008.163.008.384-.062.602.46.223.535.759 1.85.826 1.984.067.133.111.29.022.466-.089.176-.134.288-.268.444-.134.156-.281.349-.401.469-.134.134-.274.279-.118.547.156.268.694 1.146 1.489 1.854 1.022.91 1.884 1.192 2.152 1.326.268.134.424.112.58-.067.156-.178.669-.78 0.847-.98.178-.201.357-.156.602-.067.246.089 1.562.736 1.83 0.87.268.134.446.201.513.312.067.111.067.646-.179 1.338z"/>
          </svg>
          Preguntar por WhatsApp
        </button>

        <button class="btn-cerrar-footer" @click="cerrarModal">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  mostrar: {
    type: Boolean,
    default: false
  },
  producto: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(["cerrar"])

// CONVIERTE LA DESCRIPCIÓN CON SALTOS DE LÍNEA EN UN ARREGLO LIMPIO
const lineasDescripcion = computed(() => {
  if (!props.producto?.desc) return []
  return props.producto.desc
    .split("\n")
    .map(linea => linea.trim())
    .filter(linea => linea.length > 0)
})

function cerrarModal() {
  emit("cerrar")
}

function formatoPrecio(valor) {
  if (valor === undefined || valor === null || isNaN(valor)) return "0"
  return Number(valor).toLocaleString("es-MX")
}

function consultarWhatsapp() {
  if (!props.producto) return

  const telefono = "529991234567" // Tu número de atención
  
  // Limpia el nombre del producto si en la BD le guardas el SKU dentro del nombre
  let nombreLimpio = props.producto.nombre
  if (nombreLimpio.includes("-SKU:")) {
    nombreLimpio = nombreLimpio.split("-SKU:")[0].trim()
  }

  // MENSAJE LIMPIO Y NATURAL
  const mensaje = `Hola, me interesa obtener más información sobre el producto: *${nombreLimpio}*`

  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`
  window.open(url, "_blank")
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-card {
  background: #ffffff;
  border-radius: 16px;
  max-width: 550px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.btn-cerrar {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #64748b;
  cursor: pointer;
  z-index: 10;
  line-height: 1;
}

/* HEADER */
.modal-header {
  padding: 1.5rem;
  display: flex;
  gap: 1.25rem;
  border-bottom: 1px solid #f1f5f9;
}

.modal-imagen {
  width: 120px;
  height: 120px;
  background: #f8fafc;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-imagen img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 0.5rem;
}

.imagen-vacia {
  color: #94a3b8;
  font-size: 0.8rem;
}

.modal-info-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tag {
  align-self: flex-start;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 0.4rem;
}

.tag-tel { background: #eaeef6; color: #24437c; }
.tag-acc { background: #f4ede3; color: #8a5a2b; }

.modal-titulo {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
}

.modal-categoria {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0 0 0.75rem 0;
}

.modal-precio {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.precio-tachado {
  text-decoration: line-through;
  color: #94a3b8;
  font-size: 0.9rem;
}

.precio-final {
  font-size: 1.3rem;
  font-weight: 800;
  color: #0f172a;
}

/* BODY */
.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.titulo-seccion {
  font-size: 0.85rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.modal-desc-completa {
  margin-bottom: 1.25rem;
}

.lista-desc {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.lista-desc li {
  font-size: 0.88rem;
  color: #334155;
  line-height: 1.4;
  position: relative;
  padding-left: 1.2rem;
}

.lista-desc li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #24437c;
  font-weight: bold;
}

/* ESPECIFICACIONES */
.modal-especificaciones {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: #f8fafc;
  padding: 0.85rem;
  border-radius: 8px;
}

.especificacion-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.especificacion-clave {
  font-weight: 600;
  color: #475569;
}

.especificacion-valor {
  color: #0f172a;
}

.vacio-modal {
  color: #94a3b8;
  font-size: 0.85rem;
  text-align: center;
  font-style: italic;
}

/* FOOTER */
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  background: #ffffff;
}

.btn-whatsapp {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #25d366;
  color: #ffffff;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-whatsapp:hover {
  background: #1ebe5d;
}

.btn-cerrar-footer {
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-cerrar-footer:hover {
  background: #e2e8f0;
}
</style>