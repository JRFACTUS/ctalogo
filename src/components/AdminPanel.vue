<template>

<div class="min-h-screen bg-slate-100 p-6">


<!-- LOGIN -->

<div
v-if="!usuario"
class="max-w-md mx-auto bg-white rounded-xl shadow p-6"
>

<h1 class="text-xl font-bold mb-4">
Panel Administrador
</h1>


<input
v-model="email"
type="email"
placeholder="Correo"
class="w-full border p-2 rounded mb-3"
/>


<input
v-model="password"
type="password"
placeholder="Contraseña"
class="w-full border p-2 rounded mb-3"
/>


<button
@click="login"
class="w-full bg-slate-900 text-white p-2 rounded"
>
Ingresar
</button>


<p class="text-red-500 mt-3 text-sm">
{{ error }}
</p>


</div>



<!-- ADMIN -->

<div v-else>


<div class="flex justify-between mb-6">

<h1 class="text-2xl font-bold">
Productos
</h1>


<button
@click="logout"
class="bg-red-500 text-white px-4 py-2 rounded"
>
Cerrar sesión
</button>

</div>



<div class="bg-white p-5 rounded-xl shadow mb-6">


<h2 class="font-bold mb-4">
{{ editando ? 'Editar producto':'Nuevo producto' }}
</h2>


<input
v-model="producto.nombre"
placeholder="Nombre"
class="border p-2 w-full mb-2 rounded"
/>


<select
v-model="producto.tipo"
class="border p-2 w-full mb-2 rounded"
>

<option value="telefono">
Teléfono
</option>

<option value="accesorio">
Accesorio
</option>

</select>



<input
v-model="producto.marca"
placeholder="Marca / Categoría"
class="border p-2 w-full mb-2 rounded"
/>



<input
v-model="producto.precio"
type="number"
placeholder="Precio"
class="border p-2 w-full mb-2 rounded"
/>



<input
v-model="producto.img"
placeholder="URL Imagen"
class="border p-2 w-full mb-2 rounded"
/>



<textarea
v-model="producto.desc"
placeholder="Descripción"
class="border p-2 w-full mb-2 rounded"
></textarea>



<button
@click="guardar"
class="bg-green-600 text-white px-5 py-2 rounded"
>
Guardar
</button>


</div>




<table class="w-full bg-white rounded-xl overflow-hidden">

<thead class="bg-slate-900 text-white">

<tr>

<th class="p-3">
Nombre
</th>

<th>
Tipo
</th>

<th>
Precio
</th>

<th>
Acción
</th>

</tr>

</thead>


<tbody>


<tr
v-for="p in productos"
:key="p.id"
class="border-b"
>


<td class="p-3">
{{p.nombre}}
</td>


<td>
{{p.tipo}}
</td>


<td>
${{p.precio}}
</td>


<td>


<button
@click="editar(p)"
class="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
>
Editar
</button>



<button
@click="eliminar(p.id)"
class="bg-red-600 text-white px-2 py-1 rounded"
>
Eliminar
</button>


</td>


</tr>


</tbody>


</table>


</div>


</div>


</template>



<script setup>

import { ref,onMounted } from "vue"

import { auth,db } from "../services/firebase"

import {
signInWithEmailAndPassword,
signOut,
onAuthStateChanged
}
from "firebase/auth"


import {
ref as dbRef,
onValue,
push,
set,
remove,
update
}
from "firebase/database"



const email=ref("")
const password=ref("")

const usuario=ref(null)

const error=ref("")


const productos=ref([])


const editando=ref(false)


const producto=ref({

nombre:"",
tipo:"telefono",
marca:"",
precio:"",
img:"",
desc:""

})



// verificar usuario

onMounted(()=>{


onAuthStateChanged(auth,(user)=>{

usuario.value=user

})


onValue(dbRef(db,"productos"),snap=>{


productos.value=[]


const data=snap.val()


if(data){

Object.entries(data)
.forEach(([id,p])=>{

productos.value.push({
id,
...p
})

})


}


})


})



// login

async function login(){

try{


await signInWithEmailAndPassword(
auth,
email.value,
password.value
)


}
catch(e){

error.value=e.message

}

}




function logout(){

signOut(auth)

}



// guardar

async function guardar(){


const data={

...producto.value,

precio:Number(producto.value.precio)

}



if(editando.value){


await update(
dbRef(db,"productos/"+producto.value.id),
data
)


}else{


await set(
push(dbRef(db,"productos")),
data
)


}



limpiar()


}





function editar(p){

producto.value={
...p
}

editando.value=true

}




function eliminar(id){


if(confirm("Eliminar producto?")){

remove(
dbRef(db,"productos/"+id)
)

}


}




function limpiar(){

producto.value={

nombre:"",
tipo:"telefono",
marca:"",
precio:"",
img:"",
desc:""

}

editando.value=false


}


</script>