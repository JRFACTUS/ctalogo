<template>

  <div class="login-wrapper">

    <div class="login-card">

      <h1 class="login-titulo">
        Administrador
      </h1>

      <p class="login-subtitulo">
        Ingresa tus credenciales para continuar
      </p>

      <form @submit.prevent="login">

        <div class="campo-grupo">

          <label class="campo-label">Correo</label>

          <input v-model="email" type="email" placeholder="correo@ejemplo.com" class="campo-input" required
            autocomplete="email" />

        </div>


        <div class="campo-grupo">

          <label class="campo-label">Contraseña</label>

          <div class="campo-password">

            <input v-model="password" :type="mostrarPassword ? 'text' : 'password'" placeholder="••••••••"
              class="campo-input" required autocomplete="current-password" />

            <button type="button" class="toggle-password" @click="mostrarPassword = !mostrarPassword" tabindex="-1">
              {{ mostrarPassword ? "Ocultar" : "Mostrar" }}
            </button>

          </div>

        </div>


        <button type="submit" class="boton-ingresar" :disabled="cargando">
          {{ cargando ? "Ingresando..." : "Ingresar" }}
        </button>


        <p v-if="error" class="mensaje-error">
          {{ error }}
        </p>

      </form>

    </div>

  </div>

</template>


<script setup>

import { ref } from "vue"
import { useRouter } from "vue-router"

import { auth } from "../../services/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"


const router = useRouter()

const email = ref("")
const password = ref("")
const mostrarPassword = ref(false)

const cargando = ref(false)
const error = ref("")


const mensajesError = {
  "auth/invalid-email": "El correo no es válido.",
  "auth/user-disabled": "Esta cuenta está deshabilitada.",
  "auth/user-not-found": "No existe una cuenta con este correo.",
  "auth/wrong-password": "Contraseña incorrecta.",
  "auth/invalid-credential": "Correo o contraseña incorrectos.",
  "auth/too-many-requests": "Demasiados intentos. Intenta más tarde."
}


async function login() {

  error.value = ""

  if (!email.value || !password.value) {
    error.value = "Completa correo y contraseña."
    return
  }

  cargando.value = true

  try {

    const usuario = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    console.log("Usuario conectado:", usuario.user.email)

    // Guardar sesión si quieres
    localStorage.setItem("usuario", JSON.stringify({
      email: usuario.user.email,
      uid: usuario.user.uid
    }))


    // ENVIAR AL ADMIN
    router.push("/admin")


  }
  catch (e) {

    error.value = mensajesError[e.code] || "No se pudo iniciar sesión. Intenta de nuevo."

  }
  finally {

    cargando.value = false

  }

}

</script>


<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 1.5rem;
}


.login-card {
  width: 100%;
  max-width: 380px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}


.login-titulo {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 5px;
}


.login-subtitulo {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 24px;
}


.campo-grupo {
  margin-bottom: 16px;
}


.campo-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}


.campo-input {

  width: 100%;
  padding: 12px;

  border: 1px solid #d1d5db;

  border-radius: 8px;

  background: white;

  color: #111827;

}


.campo-input:focus {

  outline: none;

  border-color: #2563eb;

}


.campo-password {

  position: relative;

}


.toggle-password {

  position: absolute;

  right: 10px;

  top: 50%;

  transform: translateY(-50%);

  background: none;

  border: none;

  color: #2563eb;

  cursor: pointer;

  font-size: 12px;

}



.boton-ingresar {

  width: 100%;

  padding: 12px;

  background: #2563eb;

  color: white;

  border: none;

  border-radius: 8px;

  font-weight: 600;

  cursor: pointer;

}


.boton-ingresar:hover {

  background: #1d4ed8;

}


.boton-ingresar:disabled {

  opacity: .6;

}


.mensaje-error {

  margin-top: 12px;

  color: #dc2626;

  font-size: 13px;

  text-align: center;

}
</style>