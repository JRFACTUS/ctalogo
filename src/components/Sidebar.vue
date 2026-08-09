<template>
  <aside class="sidebar">
    <!-- Cabecera con Logo exacto a la imagen -->
    <div class="sidebar-header">
      <div class="logo-grid">
        <span class="block"></span>
        <span class="block"></span>
        <span class="block"></span>
        <span class="block"></span>
      </div>
      <span class="logo-title">Panel</span>
    </div>

    <!-- Lista de Opciones -->
    <nav class="sidebar-nav">
      <ul>
        <li>
          <a 
            href="#" 
            class="nav-item active"
            @click.prevent="recargarPagina"
          >
            <span class="icon">📖</span>
            <span class="label">Catálogos</span>
            <span class="arrow">🔄</span>
          </a>
        </li>
      </ul>
    </nav>

    <!-- Botón de Cerrar Sesión con Confirmación -->
    <div class="sidebar-footer">
      <button type="button" class="logout-btn" @click="cerrarSesion">
        <span class="icon">🚪</span>
        <span class="label">Cerrar sesión</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { auth } from '../services/firebase'
import { signOut } from 'firebase/auth'

const router = useRouter()

// Recargar la página
const recargarPagina = () => {
  window.location.reload()
}

// Cerrar sesión con cuadro de confirmación
const cerrarSesion = async () => {
  // Muestra una ventana emergente de confirmación
  const confirmado = window.confirm("¿Estás seguro de que deseas cerrar sesión?")
  
  if (confirmado) {
    try {
      await signOut(auth)
      router.push('/auth/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: #ffffff;
  border-right: 1px solid #e1e4e8;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: Arial, Helvetica, sans-serif;
  user-select: none;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 24px 20px;
  gap: 12px;
}

.logo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3px;
  width: 22px;
  height: 22px;
}

.logo-grid .block {
  background-color: #f37022;
  border-radius: 2px;
}

.logo-title {
  color: #0073b7;
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.sidebar-nav {
  flex-grow: 1;
  padding-top: 10px;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  text-decoration: none;
  border-bottom: 1px solid #f2f4f7;
  transition: all 0.2s ease;
  background-color: #f0f7fc;
  color: #0073b7;
  font-weight: bold;
}

.nav-item:hover {
  background-color: #e2f0fb;
}

.icon {
  margin-right: 14px;
  font-size: 1.1rem;
}

.label {
  flex-grow: 1;
  font-size: 0.95rem;
}

.arrow {
  font-size: 0.9rem;
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
}

.logout-btn {
  background-color: #fff3ec;
  border: 1px solid #ffdecb;
  color: #e65100;
  font-weight: bold;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.logout-btn:hover {
  background-color: #ffe5d4;
}
</style>