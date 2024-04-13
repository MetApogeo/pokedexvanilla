let pokemon_activo=null;
let lista_equipo = [];
let tipo1 = "";
let tipo2 = "";
let shiny_activo = false;
let equipoMaximo = false;
let direccion = 'derecha';

function reiniciar(){
    location.reload();
}

function var_dump(array){
    console.log(JSON.stringify(array));
}

// Función para aumentar una estadística con un multiplicador aleatorio
function aumentarEstadistica(valorBase) {
    // Obtener un multiplicador aleatorio entre 1.01 y 2.0
    const multiplicador = Math.random() * (2.0 - 1.01) + 1.01;
    // Calcular el nuevo valor redondeado
    const nuevoValor = Math.round(valorBase * multiplicador);
    return nuevoValor;
}

function ActivarShiny() {
    console.log("shiny pokemon: ");
    let imagen = "";
    if (shiny_activo === false) {
        shiny_activo = true;

        // Guardar estadísticas base antes de aplicar el brillo
        pokemon_activo.statsBase = {
            hp: pokemon_activo.hp,
            attack: pokemon_activo.attack,
            defense: pokemon_activo.defense,
            speed: pokemon_activo.speed,
        };

        // Aumentar dos estadísticas con multiplicador aleatorio
        pokemon_activo.hp = aumentarEstadistica(pokemon_activo.hp);
        pokemon_activo.attack = aumentarEstadistica(pokemon_activo.attack);
        pokemon_activo.defense = aumentarEstadistica(pokemon_activo.defense);
        pokemon_activo.speed = aumentarEstadistica(pokemon_activo.speed);

        // Actualizar las estadísticas en el HTML
        actualizarEstadisticasEnHTML('hp', pokemon_activo.hp);
        actualizarEstadisticasEnHTML('attack', pokemon_activo.attack);
        actualizarEstadisticasEnHTML('defense', pokemon_activo.defense);
        actualizarEstadisticasEnHTML('speed', pokemon_activo.speed);

        if(direccion === 'izquierda') {
            imagen = pokemon_activo.sprites.back_shiny;
        } else if(direccion === 'derecha') {
            imagen = pokemon_activo.sprites.front_shiny;
        }
        pokemon_activo.shiny = true;
        pokemon_activo.imagen_url = pokemon_activo.sprites.front_shiny;
    } else {
        shiny_activo = false;

        // Restaurar las estadísticas base antes del brillo
        pokemon_activo.hp = pokemon_activo.statsBase.hp;
        pokemon_activo.attack = pokemon_activo.statsBase.attack;
        pokemon_activo.defense = pokemon_activo.statsBase.defense;
        pokemon_activo.speed = pokemon_activo.statsBase.speed;

        // Actualizar las estadísticas en el HTML
        actualizarEstadisticasEnHTML('hp', pokemon_activo.hp);
        actualizarEstadisticasEnHTML('attack', pokemon_activo.attack);
        actualizarEstadisticasEnHTML('defense', pokemon_activo.defense);
        actualizarEstadisticasEnHTML('speed', pokemon_activo.speed);

        if(direccion === 'izquierda') {
            imagen = pokemon_activo.sprites.back_default;
        } else if(direccion === 'derecha') {
            imagen = pokemon_activo.sprites.front_default;
        }
        
        pokemon_activo.shiny = false;
        pokemon_activo.imagen_url = pokemon_activo.sprites.front_default;
    }

    // Actualizar la imagen en el HTML
    let imagenElement = document.querySelector('#screen-left-image');
    if (imagenElement) {
        imagenElement.src = imagen;
        console.log("Imagen URL actualizada");
    }
}

// Función para actualizar estadísticas en el HTML
function actualizarEstadisticasEnHTML(stat, value) {
    let statElement = document.getElementById('pokemon-' + stat);
    if (statElement) {
        statElement.innerText = value;
    }
}


function borrarDigito() {
    let numero_pokemon = document.getElementById("pokemon-numero");
    let contenido = numero_pokemon.innerText;
    // Eliminar el último dígito
    numero_pokemon.innerText = contenido.slice(0, -1);
}

function asignarNumero(obj) {
    //se obtiene el elemento html del pokemon
    let numero_pokemon = document.getElementById('pokemon-numero');
    numero_pokemon.innerText += obj.innerText;
}

function buscarRandomPokemon(){
    console.log('pinche vato pendejo');
    let elemento_numero_pokemon = document.getElementById('pokemon-numero');
    let numero_random = randomPokemon();
    elemento_numero_pokemon.innerText = numero_random;
    buscarPokemon();
}

function randomPokemon(min = 1, max =1025){
    return Math.floor(Math.random() * (max - min + 1 ) + min);
}

function girarSprite(direccion){
    console.log("girando pokemon: ", direccion);
    if(pokemon_activo.sprites) {
        let imagen = "";
        if (shiny_activo) {
            if(direccion === 'izquierda') {
                imagen = pokemon_activo.sprites.back_shiny;
            } else if(direccion === 'derecha') {
                imagen = pokemon_activo.sprites.front_shiny;
            }
        } else {
            if(direccion === 'izquierda') {
                imagen = pokemon_activo.sprites.back_default;
            } else if(direccion === 'derecha') {
                imagen = pokemon_activo.sprites.front_default;
            }

            
        }
        let imagenElement = document.querySelector('#screen-left-image');
            if(imagenElement) {
                imagenElement.src = imagen;
                console.log("Imagen URL actualizada hacia " + direccion);
            }
    }
}

function cambiarPokemon(incremento){
    console.log("cambiando pokemon: ", incremento);
    let numero_pokemon = document.getElementById('pokemon-numero');
    let numero_ingresado = parseInt(numero_pokemon.innerText) || 0;
    
    numero_actual = numero_ingresado + incremento;
    if(numero_actual < 1) {
        numero_actual = 1;
    }
    numero_pokemon.innerText = numero_actual;
    buscarPokemon();
}

function buscarPokemon() {
    //se obtiene el elemento html del pokemon
    let numero_pokemon = document.getElementById('pokemon-numero');
    let texto_buscar = numero_pokemon.innerText;

    let nombre_pokemon = document.getElementById('pokemon-title');

    let contenedor_imagen = document.getElementById('screen-left');

    //se obtiene los elemento html de las estadisticas a modificar
    let hp = document.getElementById('pokemon-hp');
    let ataque = document.getElementById('pokemon-attack');
    let defensa = document.getElementById('pokemon-defense');
    let velocidad = document.getElementById('pokemon-speed');
    let altura = document.getElementById('pokemon-height');
    let peso = document.getElementById('pokemon-weight');
    let imagenPokemon = document.getElementById('screen-left-image');
    let tipo1 = document.getElementById('pokemon-type-1');
    let tipo2 = document.getElementById('pokemon-type-2');

    fetch("https://pokeapi.co/api/v2/pokemon/"+texto_buscar)
    .then(response => response.json())
    .then(data => {
        nombre_pokemon.innerText = data.name;

        contenedor_imagen.innerHTML = '<img id="screen-left-image" src="'+data.sprites.front_default+'" alt="">';

        hp.innerText = data.stats[0].base_stat;
        ataque.innerText = data.stats[1].base_stat;
        defensa.innerText = data.stats[2].base_stat;
        velocidad.innerText = data.stats[5].base_stat;
        peso.innerText = data.weight+" hg";
        altura.innerText = data.height + " dm";
        shiny_activo = false;
        tipo1 = data.types[0]['type']['name'];
        if(data.types.length == 2){
            tipo2 = data.types[1]['type']['name'];
        }
        else{
            tipo2 = null;
        }

        pokemon_activo = {
            numero: parseInt(texto_buscar),
            nombre: data.name,
            hp: data.stats[0].base_stat,
            attack: data.stats[1].base_stat,
            defense: data.stats[2].base_stat,
            speed: data.stats[5].base_stat,
            height: data.height,
            weight: data.weight,
            sprites: data.sprites,
            imagen_url: data.sprites.front_default,
            shiny: false
        };
        
        console.log(pokemon_activo.sprites.front_shiny);
        imagenPokemon.src = pokemon_activo.sprites.front_default;
        obtenerTipoPokemon(tipo1, tipo2);
        console.log(pokemon_activo.numero_pokemon);
    });

}

function agregarEquipo(){
    if (equipoMaximo) {
        alert('No puedes tener más de 5 pokemones contigo');
    } else {
        if (pokemon_activo) {
        fetch("http://127.0.0.1:8000/api/equipo",
        {
            headers: {
                "Content-type": "application/json",
                'X-Requested-With': 'XMLHttpRequest', 
                'Access-Control-Allow-Origin': '*',
                
            },
            method:'POST',
            body: JSON.stringify(pokemon_activo),
            
        })
        .then(response => refrescarPokemonLista());
    }
    }
    
}


function refrescarPokemonLista(){
    let contenedor_lista = document.getElementById('contenido-tabla');
    contenedor_lista.innerHTML = "";
    fetch("http://127.0.0.1:8000/api/equipo")
    .then(response => response.json())
    .then(lista_equipo => {
        let contador = 0;
        lista_equipo.forEach(pokemon => {
        let fila = "<tr>";
                fila+="<td>"+pokemon.numero+"</td>";
                fila+="<td>"+pokemon.nombre+"</td>";
                fila+="<td>"+pokemon.hp+"</td>";
                fila+="<td>"+pokemon.attack+"</td>";
                fila+="<td>"+pokemon.defense+"</td>";
                fila+="<td>"+pokemon.speed+"</td>";
                fila+="<td>"+pokemon.height+"</td>";
                fila+="<td>"+pokemon.weight+"</td>";
                fila+="<td>"+pokemon.shiny+"</td>";
                if (pokemon.shiny == 0) {
                    fila+="<td><img src='"+pokemon.imagen_url+"'></td>";
                } if(pokemon.shiny == 1) {
                    fila+="<td><img src='"+pokemon.imagen_url+"'></td>";
                }
                
                fila += "<td><button class='light-blue darken-4 botonsito waves-effect waves-light' onclick='eliminarPokemon("+pokemon.id+")'>Eliminar</button><button class='light-blue darken-4 botonsito waves-effect waves-light' onclick='mostrarPokemon("+pokemon.id+")'>Editar</button></td>";
                fila+="</tr";
            contenedor_lista.innerHTML+=fila;
        contador = contador + 1;
        });
        if(contador==5){
            equipoMaximo = true;
        }
        else{
            equipoMaximo = false;
        }
        console.log(contador);
    });
    
}

function eliminarPokemon(id) {
    fetch("http://127.0.0.1:8000/api/equipo/"+id,{
        method:"DELETE"
    })
    .then(response => response.json())
    .then(pokemon => {
        lista_equipo.splice(pokemon.id);
        
    })
    .then(response => refrescarPokemonLista());
    
}

function mostrarPokemon(id) {
    fetch("http://127.0.0.1:8000/api/equipo/"+id)
    .then(response => response.json())
    .then(pokemon => {

        let elem = document.getElementById('modal-editar-pokemon');

        document.getElementById('id').value=pokemon.id;
        document.getElementById('nombre_editar').value=pokemon.nombre;
        let instance = M.Modal.getInstance(elem);
        instance.open();
    });
    
}

function modificarPokemon() {
   let id = document.getElementById('id').value;
    fetch("http://127.0.0.1:8000/api/equipo/"+id,{
        //mode: no-cors,
        headers: {
            "Content-type": "application/json",
            'X-Requested-With': 'XMLHttpRequest', 
            'Access-Control-Allow-Origin': '*',
            

        },
        method:"PUT",
        body:JSON.stringify({nombre: document.getElementById('nombre_editar').value})
    })
    .then(response => response.json())
    .then(response => refrescarPokemonLista());
    

}

function obtenerTipoPokemon(tipo1, tipo2) {
    let tipo1Traducido = traducirTipo(tipo1);
    let tipo2Traducido = ""; // Declarar la variable fuera del bloque condicional

    console.log('hola');
    let tipoImage1 = "tipos/Tipo_" + tipo1Traducido + ".png";
    let tipoImage2 = "";

    if (typeof tipo2 !== 'undefined' && tipo2 !== null){
        tipo2Traducido = traducirTipo(tipo2); // Asignar valor si tipo2 está definido
        tipoImage2 = "tipos/Tipo_" + tipo2Traducido + ".png";
    } else {
        // Aquí puedes manejar el caso cuando tipo2 no está definido
        tipoImage2 = "tipos/Tipo_Desconocido.png";
    }

    // Actualiza las imágenes en el HTML
    let tipo1Element = document.getElementById('pokemon-type-1');
    let tipo2Element = document.getElementById('pokemon-type-2');
    
    if (tipo1Element) {
        tipo1Element.innerHTML = `<img src="${tipoImage1}" alt="${tipo1Traducido}">`;
    }

    if (tipo2Element) {
        tipo2Element.innerHTML = `<img src="${tipoImage2}" alt="${tipo2Traducido}">`;
    }
    
    console.log(tipoImage1);
    console.log(tipoImage2);
    //return { tipo1: tipo1Traducido, tipo2: tipo2Traducido };
}



function traducirTipo(tipo) {
    switch (tipo) {
        case 'normal':
            return 'normal';
        case 'fighting':
            return 'lucha';
        case 'flying':
            return 'volador';
        case 'poison':
            return 'veneno';
        case 'ground':
            return 'tierra';
        case 'rock':
            return 'roca';
        case 'bug':
            return 'bicho';
        case 'ghost':
            return 'fantasma';
        case 'steel':
            return 'acero';
        case 'fire':
            return 'fuego';
        case 'water':
            return 'agua';
        case 'grass':
            return 'planta';
        case 'electric':
            return 'electrico';
        case 'psychic':
            return 'psiquico';
        case 'ice':
            return 'hielo';
        case 'dragon':
            return 'dragon';
        case 'dark':
            return 'oscuridad';
        case 'fairy':
            return 'hada';
        default:
            return '???';
    }
}

refrescarPokemonLista();