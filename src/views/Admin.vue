<template>
  <div class="app">
    <!-- BARRA LATERAL (SIDEBAR) -->
    <Sidebar @select="handleMenuSelect" @logout="handleLogout" />

    <!-- CONTENEDOR PRINCIPAL -->
    <div class="main-wrapper">

      <!-- BARRA SUPERIOR -->
      <header class="topbar">
        <div class="topbar-marca">
          <svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 6h16M4 12h16M4 18h10" stroke-linecap="round" />
          </svg>
          <span>Panel de Administración</span>
        </div>

       
      </header>

      <!-- CONTENIDO -->
      <main class="contenido">

        <!-- FORMULARIO -->
        <section class="ficha" :class="{ 'ficha-editando': editando }" ref="fichaRef">

          <div class="ficha-cabecera">
            <h2>{{ editando ? "Editar Producto" : "Agregar Producto" }}</h2>

            <button type="button" class="enlace-limpiar" @click="limpiar">
              Limpiar formulario
            </button>
          </div>

          <p v-if="editando" class="aviso-edicion">
            Editando:
            <strong>{{ producto.nombre }}</strong>
            los cambios se guardarán sobre este producto.
          </p>

          <div class="fila-campos">

            <div class="campo-grupo">
              <label class="etiqueta">Tipo</label>

              <select v-model="producto.tipo" class="campo" @change="producto.categoria = ''">
                <option value="telefono">Teléfono</option>
                <option value="accesorio">Accesorio</option>
              </select>
            </div>

            <div class="campo-grupo">
              <label class="etiqueta">Nombre</label>

              <input v-model="producto.nombre" placeholder="ej. iPhone 13 128GB" class="campo" />
            </div>

            <div class="campo-grupo">
              <label class="etiqueta">Categoría / Marca</label>

              <select v-model="producto.categoria" class="campo">
                <option value="" disabled>
                  Selecciona una opción
                </option>

                <option v-for="c in opcionesCategoria" :key="c" :value="c">
                  {{ c }}
                </option>
              </select>
            </div>

          </div>

          <div class="fila-campos">

            <div class="campo-grupo">
              <label class="etiqueta">Precio Normal ($)</label>

              <input v-model="producto.precioNormal" type="number" placeholder="12500" class="campo campo-mono" />
            </div>

            <div class="campo-grupo">
              <label class="etiqueta">
                Precio Oferta ($ - opcional)
              </label>

              <input v-model="producto.precioOferta" type="number" placeholder="10999" class="campo campo-mono" />
            </div>

            <div class="campo-grupo">
              <label class="etiqueta">URL de Imagen</label>

              <input v-model="producto.imagen" placeholder="https://..." class="campo" />
            </div>

          </div>

          <div class="campo-grupo campo-grupo-ancho">

            <label class="etiqueta">
              Características
            </label>

            <div class="campo-con-ayuda">

              <textarea v-model="producto.caracteristicas"
                placeholder="• Pantalla 6.1 pulgadas&#10;• 128GB almacenamiento&#10;• 8GB RAM&#10;• Cámara de 50MP"
                class="campo" rows="5" @blur="mostrarAyuda = !producto.caracteristicas"></textarea>

              <span v-if="mostrarAyuda" class="ayuda-tooltip">
                Completa este campo
              </span>

            </div>
          </div>

          <div class="checks">

            <label class="check">
              <input type="checkbox" v-model="producto.oferta" />
              Oferta
            </label>

            <label class="check">
              <input type="checkbox" v-model="producto.nuevo" />
              Nuevo
            </label>

            <label class="check">
              <input type="checkbox" v-model="producto.agotado" />
              Agotado
            </label>

          </div>

          <div class="ficha-acciones">

            <button @click="guardarProducto" class="boton-guardar">
              {{ editando ? "Actualizar en Firebase" : "Guardar en Firebase" }}
            </button>

            <button v-if="editando" @click="limpiar" class="boton-cancelar">
              Cancelar edición
            </button>

          </div>

        </section>


        <!-- LISTADO -->
        <section class="listado">

          <div class="listado-cabecera">

            <h2>Productos registrados</h2>

            <span class="contador">
              {{ productosFiltrados.length }}
              de
              {{ productos.length }}
              en catálogo
            </span>

          </div>


          <!-- BARRA DE BÚSQUEDA Y FILTROS -->
          <div class="listado-filtros">

            <div class="buscador-contenedor">

              <span class="icono-buscar">
                🔍
              </span>

              <input v-model="busqueda" type="text" placeholder="Buscar producto o marca..." class="input-buscar" />

            </div>

            <select v-model="filtroTipo" class="select-tipo">
              <option value="todos">
                Todos los tipos
              </option>

              <option value="telefono">
                Teléfonos
              </option>

              <option value="accesorio">
                Accesorios
              </option>
            </select>

          </div>


          <!-- CABECERA TABLA -->
          <div class="tabla-cabecera">

            <span class="col-nombre">
              Nombre
            </span>

            <span class="col-tipo">
              Tipo
            </span>

            <span class="col-precio">
              Precio
            </span>

            <span class="col-estado">
              Estado
            </span>

            <span class="col-acciones">
              Acciones
            </span>

          </div>


          <!-- PRODUCTOS -->
          <div v-for="p in productosFiltrados" :key="p.id" class="fila" :class="[
            p.tipo === 'telefono'
              ? 'fila-tel'
              : 'fila-acc',
            {
              'fila-en-edicion':
                producto.id === p.id && editando
            }
          ]">

            <span class="col-nombre">

              <strong>
                {{ p.nombre }}
              </strong>

              <small v-if="p.marca || p.categoria">
                {{ p.marca || p.categoria }}
              </small>

            </span>


            <span class="col-tipo">

              <span class="tag" :class="p.tipo === 'telefono'
                  ? 'tag-tel'
                  : 'tag-acc'
                ">
                {{ p.tipo }}
              </span>

            </span>


            <span class="col-precio campo-mono">

              <span v-if="p.precioOferta" class="precio-tachado">
                ${{ p.precio }}
              </span>

              <span>
                ${{ p.precioOferta || p.precio }}
              </span>

            </span>


            <span class="col-estado">

              <span v-if="p.oferta" class="badge badge-oferta">
                Oferta
              </span>

              <span v-if="p.nuevo" class="badge badge-nuevo">
                Nuevo
              </span>

              <span v-if="p.agotado" class="badge badge-agotado">
                Agotado
              </span>

            </span>


            <span class="col-acciones">

              <button @click="editarProducto(p)" class="boton-mini boton-editar">
                Editar
              </button>

              <button @click="eliminarProducto(p.id)" class="boton-mini boton-eliminar">
                Eliminar
              </button>

            </span>

          </div>


          <div v-if="productosFiltrados.length === 0" class="listado-vacio">
            No se encontraron productos que coincidan con los criterios.
          </div>

        </section>

      </main>

    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, nextTick } from "vue"
import { auth, db } from "../services/firebase"
import { signOut } from "firebase/auth"
import { ref as dbRef, onValue, push, set, update, remove } from "firebase/database"
import Sidebar from "../components/Sidebar.vue"

const emit = defineEmits(["cerrar"])

const seccionSeleccionada = ref("Catálogos")
const mostrarAyuda = ref(false)
const productos = ref([])
const editando = ref(false)
const fichaRef = ref(null)

const busqueda = ref("")
const filtroTipo = ref("todos")

const categoriasPorTipo = {
  telefono: ["Samsung", "Apple", "Xiaomi", "Motorola", "Otro"],
  accesorio: ["Fundas", "Cables", "Audífonos", "Cargadores", "Otro"]
}

const producto = ref({
  id: null,
  tipo: "telefono",
  nombre: "",
  categoria: "",
  precioNormal: "",
  precioOferta: "",
  imagen: "",
  caracteristicas: "",
  oferta: false,
  nuevo: false,
  agotado: false
})

const opcionesCategoria = computed(() => {
  return categoriasPorTipo[producto.value.tipo] || []
})

const productosFiltrados = computed(() => {
  return productos.value.filter(p => {
    const texto = busqueda.value.toLowerCase().trim()

    const coincideNombre = p.nombre ? p.nombre.toLowerCase().includes(texto) : false
    const coincideMarca = p.marca ? p.marca.toLowerCase().includes(texto) : false
    const coincideCategoria = p.categoria ? p.categoria.toLowerCase().includes(texto) : false

    const coincideTexto = !texto || coincideNombre || coincideMarca || coincideCategoria
    const coincideTipo = filtroTipo.value === "todos" || p.tipo === filtroTipo.value

    return coincideTexto && coincideTipo
  })
})

const handleMenuSelect = (id) => {
  seccionSeleccionada.value = id
}

const handleLogout = () => {
  cerrarSesion()
}

onMounted(() => {
  onValue(dbRef(db, "productos"), snapshot => {
    productos.value = []

    const data = snapshot.val()

    if (data) {
      Object.entries(data).forEach(([id, item]) => {
        productos.value.push({
          id,
          ...item
        })
      })
    }
  })
})

async function guardarProducto() {
  if (!producto.value.nombre || !producto.value.precioNormal) {
    mostrarAyuda.value = true
    return
  }

  const esTelefono = producto.value.tipo === "telefono"

  const data = {
    tipo: producto.value.tipo,
    nombre: producto.value.nombre.trim(),
    precio: Number(producto.value.precioNormal),
    precioOferta: producto.value.precioOferta ? Number(producto.value.precioOferta) : 0,
    img: producto.value.imagen.trim(),
    desc: producto.value.caracteristicas.trim(),
    oferta: Boolean(producto.value.oferta),
    nuevo: Boolean(producto.value.nuevo),
    agotado: Boolean(producto.value.agotado),
    marca: esTelefono ? producto.value.categoria : "",
    categoria: !esTelefono ? producto.value.categoria : ""
  }

  if (editando.value && producto.value.id) {
    await update(dbRef(db, "productos/" + producto.value.id), data)
  } else {
    await set(push(dbRef(db, "productos")), data)
  }

  limpiar()
}

async function editarProducto(p) {
  producto.value = {
    id: p.id,
    tipo: p.tipo || "telefono",
    nombre: p.nombre || "",
    categoria: p.marca || p.categoria || "",
    precioNormal: p.precio !== undefined ? p.precio : "",
    precioOferta: p.precioOferta || "",
    imagen: p.img || "",
    caracteristicas: p.desc || "",
    oferta: Boolean(p.oferta),
    nuevo: Boolean(p.nuevo),
    agotado: Boolean(p.agotado)
  }

  editando.value = true
  mostrarAyuda.value = false

  await nextTick()

  fichaRef.value?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  })
}

function eliminarProducto(id) {
  if (confirm("¿Eliminar producto?")) {
    remove(dbRef(db, "productos/" + id))
  }
}

function limpiar() {
  producto.value = {
    id: null,
    tipo: "telefono",
    nombre: "",
    categoria: "",
    precioNormal: "",
    precioOferta: "",
    imagen: "",
    caracteristicas: "",
    oferta: false,
    nuevo: false,
    agotado: false
  }

  editando.value = false
  mostrarAyuda.value = false
}

function cerrarSesion() {
  signOut(auth)
}
</script>


<style scoped>
* {
  box-sizing: border-box;
}

.app {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #f4f6f8;
}

.main-wrapper {
  flex: 1;
  min-width: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: #f4f6f8;
}

/* =========================
   BARRA SUPERIOR
========================= */

.topbar {
  width: 100%;
  min-height: 70px;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 20;
}

.topbar-marca {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #111827;
  font-size: 19px;
  font-weight: 700;
}

.icono {
  width: 25px;
  height: 25px;
  flex-shrink: 0;
}

.topbar-acciones {
  display: flex;
  align-items: center;
  gap: 12px;
}

.boton-salir {
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #374151;
  padding: 10px 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.boton-salir:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.icono-salir {
  width: 18px;
  height: 18px;
}



/* =========================
   CONTENIDO
========================= */

.contenido {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 28px;
}

/* =========================
   FORMULARIO
========================= */

.ficha {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  transition: 0.2s ease;
}

.ficha-editando {
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.08);
}

.ficha-cabecera {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.ficha-cabecera h2 {
  margin: 0;
  color: #111827;
  font-size: 21px;
  font-weight: 700;
}

.enlace-limpiar {
  border: none;
  background: transparent;
  color: #2563eb;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 5px;
}

.enlace-limpiar:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.aviso-edicion {
  margin: 0 0 20px;
  padding: 12px 15px;
  border-radius: 8px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
  font-size: 14px;
}

.fila-campos {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 18px;
}

.campo-grupo {
  min-width: 0;
}

.campo-grupo-ancho {
  width: 100%;
  margin-top: 3px;
}

.etiqueta {
  display: block;
  margin-bottom: 7px;
  color: #374151;
  font-size: 13px;
  font-weight: 600;
}

.campo {
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  color: #111827;
  font-size: 14px;
  outline: none;
  transition: 0.2s ease;
}

.campo::placeholder {
  color: #9ca3af;
}

.campo:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.10);
}

select.campo {
  cursor: pointer;
}

textarea.campo {
  min-height: 125px;
  resize: vertical;
  line-height: 1.5;
}

.campo-mono {
  font-variant-numeric: tabular-nums;
}

.campo-con-ayuda {
  position: relative;
}

.ayuda-tooltip {
  position: absolute;
  right: 12px;
  top: 10px;
  padding: 5px 8px;
  border-radius: 5px;
  background: #dc2626;
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  pointer-events: none;
}

/* =========================
   CHECKBOX
========================= */

.checks {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 22px;
  margin-top: 20px;
}

.check {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
}

.check input {
  width: 17px;
  height: 17px;
  margin: 0;
  accent-color: #2563eb;
  cursor: pointer;
}

/* =========================
   BOTONES FORMULARIO
========================= */

.ficha-acciones {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 23px;
}

.boton-guardar {
  min-height: 43px;
  padding: 0 20px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.boton-guardar:hover {
  background: #1d4ed8;
}

.boton-cancelar {
  min-height: 43px;
  padding: 0 18px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.boton-cancelar:hover {
  background: #f3f4f6;
}

/* =========================
   LISTADO
========================= */

.listado {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.listado-cabecera {
  min-height: 70px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  border-bottom: 1px solid #e5e7eb;
}

.listado-cabecera h2 {
  margin: 0;
  color: #111827;
  font-size: 19px;
  font-weight: 700;
}

.contador {
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
}

/* =========================
   FILTROS
========================= */

.listado-filtros {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 24px;
  background: #fafafa;
  border-bottom: 1px solid #e5e7eb;
}

.buscador-contenedor {
  position: relative;
  flex: 1;
  min-width: 0;
}

.icono-buscar {
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 15px;
  pointer-events: none;
}

.input-buscar {
  width: 100%;
  height: 42px;
  padding: 0 14px 0 40px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  color: #111827;
  font-size: 14px;
  outline: none;
  transition: 0.2s ease;
}

.input-buscar::placeholder {
  color: #9ca3af;
}

.input-buscar:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.10);
}

.select-tipo {
  width: 210px;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  font-size: 14px;
  outline: none;
  cursor: pointer;
}

.select-tipo:focus {
  border-color: #2563eb;
}

/* =========================
   TABLA
========================= */

.tabla-cabecera {
  display: grid;
  grid-template-columns: minmax(220px, 2fr) 120px minmax(120px, 1fr) minmax(170px, 1.2fr) 190px;
  align-items: center;
  min-height: 47px;
  padding: 0 24px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  color: #6b7280;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.fila {
  display: grid;
  grid-template-columns: minmax(220px, 2fr) 120px minmax(120px, 1fr) minmax(170px, 1.2fr) 190px;
  align-items: center;
  min-height: 76px;
  padding: 12px 24px;
  border-bottom: 1px solid #eef0f2;
  transition: background 0.2s ease;
}

.fila:last-child {
  border-bottom: none;
}

.fila:hover {
  background: #fafafa;
}

.fila-en-edicion {
  background: #eff6ff !important;
}

.col-nombre {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.col-nombre strong {
  color: #111827;
  font-size: 14px;
  font-weight: 650;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col-nombre small {
  color: #6b7280;
  font-size: 12px;
}

.col-tipo,
.col-precio,
.col-estado,
.col-acciones {
  min-width: 0;
}

.col-precio {
  display: flex;
  flex-direction: column;
  gap: 3px;
  color: #111827;
  font-size: 14px;
  font-weight: 650;
}

.precio-tachado {
  color: #9ca3af;
  font-size: 12px;
  font-weight: 500;
  text-decoration: line-through;
}

/* =========================
   TAGS
========================= */

.tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 5px 9px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: capitalize;
}

.tag-tel {
  background: #eff6ff;
  color: #1d4ed8;
}

.tag-acc {
  background: #f3f4f6;
  color: #4b5563;
}

/* =========================
   ESTADOS
========================= */

.col-estado {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
}

.badge {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 4px 7px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 700;
}

.badge-oferta {
  background: #fff7ed;
  color: #c2410c;
}

.badge-nuevo {
  background: #ecfdf5;
  color: #047857;
}

.badge-agotado {
  background: #fef2f2;
  color: #b91c1c;
}

/* =========================
   ACCIONES
========================= */

.col-acciones {
  display: flex;
  align-items: center;
  gap: 7px;
}

.boton-mini {
  height: 34px;
  padding: 0 11px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.boton-editar {
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #1d4ed8;
}

.boton-editar:hover {
  background: #dbeafe;
  border-color: #93c5fd;
}

.boton-eliminar {
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #dc2626;
}

.boton-eliminar:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

/* =========================
   LISTADO VACÍO
========================= */

.listado-vacio {
  padding: 50px 25px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
}

/* =========================
   SCROLLBAR
========================= */

.main-wrapper::-webkit-scrollbar {
  width: 8px;
}

.main-wrapper::-webkit-scrollbar-track {
  background: #f4f6f8;
}

.main-wrapper::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.main-wrapper::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 1100px) {
  .contenido {
    padding: 20px;
  }

  .fila-campos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .tabla-cabecera,
  .fila {
    grid-template-columns: minmax(180px, 2fr) 100px 120px minmax(140px, 1fr) 165px;
    padding-left: 18px;
    padding-right: 18px;
  }
}

@media (max-width: 850px) {
  .topbar {
    padding: 0 18px;
  }

  .topbar-marca {
    font-size: 16px;
  }

  .boton-salir {
    padding: 9px 11px;
  }

  .boton-salir {
    font-size: 0;
  }

  .boton-salir .icono-salir {
    margin: 0;
  }

  .contenido {
    padding: 16px;
  }

  .ficha {
    padding: 18px;
  }

  .listado-cabecera {
    padding: 0 18px;
  }

  .listado-filtros {
    padding: 15px 18px;
  }

  .tabla-cabecera {
    display: none;
  }

  .fila {
    display: flex;
    flex-wrap: wrap;
    gap: 13px;
    padding: 17px 18px;
  }

  .col-nombre {
    width: calc(100% - 100px);
  }

  .col-tipo {
    width: 80px;
    display: flex;
    justify-content: flex-end;
  }

  .col-precio {
    width: 30%;
  }

  .col-estado {
    width: 65%;
  }

  .col-acciones {
    width: 100%;
  }
}

@media (max-width: 650px) {
  .topbar {
    min-height: 60px;
    padding: 0 12px;
  }

  .topbar-marca span {
    font-size: 15px;
  }

  .icono {
    width: 21px;
    height: 21px;
  }


  .contenido {
    padding: 12px;
  }

  .ficha {
    padding: 16px;
    border-radius: 10px;
  }

  .ficha-cabecera {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .ficha-cabecera h2 {
    font-size: 18px;
  }

  .fila-campos {
    grid-template-columns: 1fr;
    gap: 14px;
    margin-bottom: 14px;
  }

  .checks {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .ficha-acciones {
    flex-direction: column;
    align-items: stretch;
  }

  .boton-guardar,
  .boton-cancelar {
    width: 100%;
  }

  .listado-cabecera {
    min-height: auto;
    padding: 16px;
    align-items: flex-start;
    flex-direction: column;
  }

  .listado-filtros {
    flex-direction: column;
    align-items: stretch;
    padding: 14px 16px;
  }

  .select-tipo {
    width: 100%;
  }

  .fila {
    padding: 16px;
  }

  .col-nombre {
    width: calc(100% - 90px);
  }

  .col-tipo {
    width: 70px;
  }

  .col-precio {
    width: 100%;
  }

  .col-estado {
    width: 100%;
  }

  .col-acciones {
    width: 100%;
  }

  .boton-mini {
    flex: 1;
  }
}
</style>

