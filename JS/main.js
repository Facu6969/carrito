// productos disponibles y precio
let productos = {
    "remera": 4000,
    "buzo": 10000,
    "musculosa": 3000
  };
  
  // Array para almacenar los productos seleccionados por el usuario
  let carrito = [];
  
  // Objeto para almacenar los usuarios y sus contraseñas
  let usuarios = {};
  
  // Registro nuevo usuario
  function registrarUsuario() {
    let nuevoUsuario = prompt("Por favor, elija un nombre de usuario:");
    let nuevaContraseña = prompt("Por favor, elija una contraseña:");

    if (usuarios.hasOwnProperty(nuevoUsuario)) {
      alert("Lo siento, ese nombre de usuario ya esta en uso. Por favor, elija otro.");
      return;
    }

    usuarios[nuevoUsuario] = nuevaContraseña;
    alert("¡Usuario registrado con exito! Ahora puedes iniciar sesión con tus credenciales.");
  }
  
  // iniciar sesion
  function iniciarSesion() {
    let usuario = prompt("Por favor, ingrese su nombre de usuario:");
    let contraseña = prompt("Por favor, ingrese su contraseña:");
  
    // Verificar si el usuario y la contraseña coinciden
    if (usuarios.hasOwnProperty(usuario) && usuarios[usuario] === contraseña) {
      return usuario; 
    } else {
      alert("Nombre de usuario o contraseña incorrectos. Por favor, intentelo de nuevo.");
      return null; 
    }
  }
  
  // Funcion para agregar un producto al carrito
  function agregarProducto() {
    let producto = prompt("¿Qué producto desea agregar al carrito? (remera, buzo, mosculosa)");
  
    if (!producto || !productos.hasOwnProperty(producto)) {
      alert("Lo siento, ese producto no esta disponible.");
      return;
    }
  
    let cantidad = parseInt(prompt(`Ingrese la cantidad de ${producto}s:`));
    if (isNaN(cantidad) || cantidad <= 0) {
      alert("Por favor, ingrese una cantidad valida.");
      return;
    }
  
    carrito.push({ producto, cantidad });
    alert(`¡El producto ${producto} ha sido agregado correctamente al carrito!`);
  }
  
  // Mostrar el carrito y el total de la compra
  function mostrarCarrito() {
    let total = 0;
    let mensaje = "Productos en el carrito:\n\n";
  
    for (let item of carrito) {
      let subtotal = productos[item.producto] * item.cantidad;
      total += subtotal;
      mensaje += `${item.cantidad} ${item.producto}(s) - Precio por unidad: $${productos[item.producto]} - Subtotal: $${subtotal}\n`;
    }
  
    mensaje += `\nTotal de la compra: $${total}`;
    alert(mensaje);
  }
  
  // Operar en el carrito hasta que decida salir
  
let cerrarSesion = false;

while (true) {
  if (cerrarSesion) {
    break; 
  }

  let opcionInicio = prompt("¿Que deseas hacer?\n1. Iniciar sesion\n2. Registrarse\n3. Salir");

  if (opcionInicio === "1") {
    let usuarioAutenticado = iniciarSesion();
    if (!usuarioAutenticado) continue;

    while (true) {
      let opcion = prompt("¿Que deseas hacer?\n1. Agregar un producto al carrito\n2. Mostrar carrito y finalizar compra\n3. Cerrar sesion");

      if (opcion === "1") {
        agregarProducto();
      } else if (opcion === "2") {
        mostrarCarrito();
      } else if (opcion === "3") {
        alert("¡Gracias por visitarnos! Esperamos verte pronto.");
        cerrarSesion = true; 
        break;
      } else {
        alert("Por favor, selecciona una opcion valida.");
      }
    }
  } else if (opcionInicio === "2") {
    registrarUsuario();
  } else if (opcionInicio === "3") {
    alert("¡Gracias por visitarnos!");
    break;
  } else {
    alert("Por favor, selecciona una opcion valida.");
    continue; 
  }
}

  
  
  