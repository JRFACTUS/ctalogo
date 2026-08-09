<template>
  <footer class="footer-contenedor">
    <!-- TARJETA PRINCIPAL DE SUCURSAL -->
    <div class="tarjeta-sucursal">
      <!-- COLUMNA IZQUIERDA: INFORMACIÓN Y CONTACTO -->
      <div class="sucursal-info">
        <h2>Visítanos en Nuestra Sucursal</h2>

        <div class="info-lista">
          <!-- Ubicación -->
          <div class="info-item">
            <svg class="icono icono-ubicacion" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <p>
              ¡Te esperamos! Visítanos en Plaza Chacuiba. Estamos en el local 5-4A, dentro de la plaza. Al entrar, verás una papelería y Farmacia de la Salud; nuestro local está muy cerca.

            </p>
          </div>

          <!-- Horario -->
          <div class="info-item">
            <svg class="icono icono-horario" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2" stroke-linecap="round"/>
            </svg>
            <p>7:30 AM a 5:00 PM</p>
          </div>

          <!-- Teléfono / WhatsApp -->
          <div class="info-item">
            <svg class="icono icono-whatsapp" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.932 9.932 0 001.356 5.012L2 22l5.129-1.343a9.93 9.93 0 004.881 1.28h.004c5.505 0 9.988-4.478 9.989-9.985a9.972 9.972 0 00-2.923-7.062A9.92 9.92 0 0012.012 2zm5.8 14.28c-.244.688-1.428 1.312-1.968 1.393-.54.081-1.228.118-3.955-.98-3.486-1.403-5.733-4.935-5.908-5.168-.175-.233-1.41-1.876-1.41-3.578 0-1.702.892-2.538 1.207-2.888.315-.35.688-.438.918-.438.23 0 .46.002.66.012.212.01.496-.08.775.59.288.692.983 2.4.1.069 2.534-.175.233-.35.496-.708.992-1.077 1.488-.368.496-.77.243-1.02.118-.25-.125-1.055-.389-2.01-1.24-1.483-1.322-2.484-2.954-2.776-3.454-.292-.5-.031-.77.218-1.018.224-.223.497-.583.746-.874.248-.292.33-.496.496-.826.166-.33.083-.62-.041-.87-.125-.25-1.108-2.67-1.517-3.655-.398-.958-.803-.828-1.108-.843-.292-.015-.626-.018-.959-.018z"/>
            </svg>
            <p>932 232 6619</p>
          </div>
        </div>

        <!-- Botón de Acción -->
        <a 
          href="https://wa.me/529322326619" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="btn-whatsapp"
        >
          Escribir por WhatsApp
        </a>
      </div>

      <!-- COLUMNA DERECHA: MAPA DE GOOGLE -->
      <div class="sucursal-mapa">
        <iframe
          title="Ubicación Plaza Chacuiba"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3800.758410264024!2d-92.953500!3d17.548900!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ed217d84f88577%3A0xb3dfc06775f0a711!2sPlaza%20Chacuiba!5e0!3m2!1ses-419!2smx!4v1700000000000!5m2!1ses-419!2smx"
          width="100%"
          height="100%"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>

    <!-- COPYRIGHT INFERIOR -->
    <div class="footer-copy">
      <p>© {{ anioActual }} EcoTeapa2. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const anioActual = computed(() => new Date().getFullYear())
</script>

<style scoped>
/* CONTENEDOR GENERAL */
.footer-contenedor {
  width: 100%;
  background-color: #f8fafc;
  padding: 2rem 1.5rem 1rem 1.5rem;
  box-sizing: border-box;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  color: #334155;
}

/* TARJETA BLANCA CONTENEDORA */
.tarjeta-sucursal {
  max-width: 1100px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 2.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

/* TITULO */
.sucursal-info h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  margin-top: 0;
  margin-bottom: 1.5rem;
}

/* LISTA DE INFORMACIÓN */
.info-lista {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-bottom: 1.8rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
}

.info-item p {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.45;
  color: #475569;
}

/* ICONOS */
.icono {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.icono-ubicacion {
  color: #ef4444; /* Rojo pin */
}

.icono-horario {
  color: #3b82f6; /* Azul reloj */
}

.icono-whatsapp {
  color: #22c55e; /* Verde whatsapp */
}

/* BOTÓN DE WHATSAPP */
.btn-whatsapp {
  display: inline-block;
  background-color: #0d1117;
  color: #ffffff;
  font-size: 0.88rem;
  font-weight: 600;
  padding: 0.75rem 1.6rem;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.btn-whatsapp:hover {
  background-color: #1f2937;
  transform: translateY(-1px);
}

/* CONTENEDOR DEL MAPA */
.sucursal-mapa {
  width: 100%;
  height: 260px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

/* COPYRIGHT */
.footer-copy {
  text-align: center;
  margin-top: 2.5rem;
  padding-top: 1rem;
  font-size: 0.85rem;
  color: #64748b;
}

.footer-copy p {
  margin: 0;
}

/* ADAPTABILIDAD RESPONSIVA */
@media (max-width: 868px) {
  .tarjeta-sucursal {
    grid-template-columns: 1fr;
    padding: 1.5rem;
  }

  .sucursal-mapa {
    height: 220px;
  }
}
</style>