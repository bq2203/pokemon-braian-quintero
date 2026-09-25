document.getElementById('txtBtn').addEventListener('click',cargarTXT);
document.getElementById('jsonBtn').addEventListener('click',cargarJSON);
document.getElementById('apiBTN').addEventListener('click',cargarREST);
 
// Nuevo: captura el submit del formulario de búsqueda de Pokémon
document.getElementById('formPokemon').addEventListener('submit', buscarPokemon);
 
function cargarTXT(){
    fetch('datos.txt')
        .then(function(res){
            return res.text();
            
        })
        .then(function(empleados){
            console.log(empleados);
            document.getElementById('resultado').innerHTML = empleados;
 
        })
        .catch(function(error){
            console.log(error);
        });
}
 
function cargarJSON(){
    fetch('empleados.json')
        .then(function(res){
            return res.json();
            
        })
        .then(function(data){
            let html = '';
            data.forEach(function(empleado){
                html +=`
                    <li>${empleado.nombre} ${empleado.puesto}</li>`;
            })
            document.getElementById('resultado').innerHTML = html;
        })
        .catch(function(error){
            console.log(error);
        });
}
 
function cargarREST(){
    fetch('https://picsum.photos/list')
        .then(function(res){
            return res.json();
            
        })
        .then(function(imagenes){
            let html = '';
            imagenes.forEach(function(imagen){
                html +=`
                    <li>
                        <a target="_blank" href="${imagen.post_url}">Ver Imagen </a>
                        ${imagen.author}
                    </li>`;
            })
            document.getElementById('resultado').innerHTML = html;
        })
        .catch(function(error){
            console.log(error);
        });
}
 
// Nueva funcionalidad

async function buscarPokemon(e){
 
    // 1. Captura de eventos: detener el comportamiento por defecto
    e.preventDefault();
 
    const resultadoDiv = document.getElementById('resultado');
 
    // 2. Lectura y limpieza de datos
    const inputPokemon = document.getElementById('inputPokemon');
    const nombrePokemon = inputPokemon.value.trim().toLowerCase();
 
    // 3. Validación de entradas
    if(nombrePokemon === ''){
        resultadoDiv.innerHTML = `<p class="mensaje-advertencia">⚠️ Debes escribir el nombre o número de un Pokémon.</p>`;
        return;
    }
 
    // 5. Manejo de errores y excepciones (try/catch envuelve toda la consulta)
    try{
 
        // 4. Consumo asíncrono: URL construida dinámicamente con template literals
        const url = `https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`;
 
        const respuesta = await fetch(url);
 
        // Validar respuesta
        if(!respuesta.ok){
            throw new Error('Pokémon no encontrado');
        }
 
        const data = await respuesta.json();
 
        const nombre = data.name.toUpperCase();
        const id = data.id;
        const imagen = data.sprites.front_default;
        const tipos = data.types.map(function(t){
            return `<span class="poke-type">${t.type.name}</span>`;
        }).join('');
        const peso = data.weight;
        const altura = data.height;
 
        const html = `
            <div class="poke-card">
                <img src="${imagen}" alt="${nombre}">
                <h2>${nombre}</h2>
                <p class="poke-id">#${id}</p>
                <div class="poke-types">${tipos}</div>
                <div class="poke-stats">
                    <span>Peso: ${peso}</span>
                    <span>Altura: ${altura}</span>
                </div>
            </div>`;

        resultadoDiv.innerHTML = html;
 
    }catch(error){
        console.log(error);
        resultadoDiv.innerHTML = `<p class="mensaje-advertencia">❌ El Pokémon buscado no fue encontrado. Verifica el nombre o número e intenta de nuevo.</p>`;
    }
}
 