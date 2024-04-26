const shopContent = document.getElementById("shopContent");
const verCarrito = document.getElementById("verCarrito");
const modalContainer = document.getElementById("modal-container");
const cantidadCarrito = document.getElementById("cantidadCarrito");


let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const getProducts = async () => {
  const respuesta = await fetch("./data/producto.json");
  const producto = await respuesta.json();
  producto.forEach((product)=> {
    let content= document.createElement("div");
    content.className = "card";
    content.innerHTML = `
      <img src="${product.img}">
      <h3>${product.nombre}</h3>
      <p class="price">$${product.precio}</p>
    `;
  
    shopContent.append(content);
  
    let comprar = document.createElement("Button");
    comprar.innerText = "comprar";
    comprar.className = "comprar";
  
    content.append(comprar);
  
    comprar.addEventListener("click", () =>{
  
      const repeat = carrito.some((repeatProduct) => repeatProduct.id === product.id);
      
      if (repeat) {
        carrito.map((prod) => {
          if(prod.id === product.id){
            prod.cantidad++;
          }
        });
      } else {
        carrito.push({
         id : product.id,
         img: product.img,
         nombre: product.nombre,
         precio: product.precio,
         cantidad : product.cantidad,
       });
       carritoCounter();
       saveLocal();
      }
    });
  });
};

getProducts();


function saveLocal() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}


// carrito //

const crearBotonCompraTotal = () => {
  const botonCompraTotal = document.createElement("button");
  botonCompraTotal.textContent = "Comprar";
  botonCompraTotal.className = "boton-compra-total";
  botonCompraTotal.style.backgroundColor = "green";  
  botonCompraTotal.style.color = "white"; 
  botonCompraTotal.style.border = "10px"; 
  botonCompraTotal.style.padding = "10px 20px"; 
  botonCompraTotal.style.cursor = "pointer";
  botonCompraTotal.style.margin = "20px auto";
  botonCompraTotal.style.borderRadius = "5px";
  botonCompraTotal.style.opacity = "0.8";
  botonCompraTotal.addEventListener("mouseover", () => {
    botonCompraTotal.style.opacity = "1";
  });
  
  botonCompraTotal.addEventListener("mouseout", () => {
    botonCompraTotal.style.opacity = "0.8";
  }); 
  botonCompraTotal.addEventListener("click", () => {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "estas seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "si, comprar!",
      cancelButtonText: "No, cancelar!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        carrito = [];
        carritoCounter();
        saveLocal();
        pintarCarrito();
        swalWithBootstrapButtons.fire({
          title: "comprado!",
          text: "Tu compra ha sido completada con exito.",
          icon: "success"
        });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelado",
          text: "Tu compra ha sido cancelada :)",
          icon: "error"
        });
      }
    });
  });
  return botonCompraTotal;
};


function pintarCarrito() {
  modalContainer.innerHTML = "";
  modalContainer.style.display = "flex";
  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  modalHeader.innerHTML = `
    <h1 class="modal-header-title">Carrito</h1>
  `;
  modalContainer.append(modalHeader);

  const modalButton = document.createElement("h1");
  modalButton.innerText = "X";
  modalButton.className = "modal-header-button";

  modalButton.addEventListener("click", () => {
    modalContainer.style.display = "none";
  });

  modalHeader.append(modalButton);

  carrito.forEach((product) => {
    let carritoContent = document.createElement("div");
    carritoContent.className = "modal-content";
    carritoContent.innerHTML = `
      <img src="${product.img}">
      <h3>${product.nombre}</h3>
      <p>$${product.precio}</p>
      <span class="restar"> - </span>
      <P>Cantidad : ${product.cantidad}</p>
      <span class="sumar"> + </span>
      <p>Total: $${product.cantidad * product.precio}</p>
      <span class="delete-product"> ✖ </span>
    `;
    modalContainer.append(carritoContent);

    let restar = carritoContent.querySelector(".restar");

    restar.addEventListener("click", () => {
      if (product.cantidad !== 1) {
        product.cantidad--;
      }
      saveLocal();
      pintarCarrito();
    });

    let sumar = carritoContent.querySelector(".sumar");
    sumar.addEventListener("click", () =>{
      product.cantidad++;
      saveLocal();
      pintarCarrito();
    });

    let eliminar = carritoContent.querySelector(".delete-product");

    eliminar.addEventListener("click", () => {
      eliminarProducto(product.id);
    });
    
  });
  const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);

  const totalCompra = document.createElement("div");
  totalCompra.className = "total-content";
  totalCompra.innerHTML = `
     <p>total a pagar: $${total}</p>
  `;
  modalContainer.append(totalCompra);

  // Agregar el botón de compra total 

  const botonCompraTotal = crearBotonCompraTotal();
  modalContainer.appendChild(botonCompraTotal);
}

verCarrito.addEventListener("click", pintarCarrito);

const eliminarProducto = (id) => {
  const foundId = carrito.find((element) => element.id === id);

  carrito = carrito.filter((carritoId) => {
    return carritoId !== foundId;
  });
  
  carritoCounter();
  saveLocal();
  pintarCarrito();
};


const carritoCounter = () => {
  cantidadCarrito.style.display = "block";

  const carritoLength = carrito.length;

  localStorage.setItem("carritoLength", JSON.stringify(carritoLength));

  cantidadCarrito.innerText = JSON.parse(localStorage.getItem("carritoLength"));
  
};
carritoCounter();



// Agregar datos del dólar tarjeta desde la API //
const obtenerDatosDolarTarjeta = async () => {
  try {
    const respuesta = await fetch("https://dolarapi.com/v1/dolares/tarjeta");
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return null;
  }
};


const formatearFecha = (fecha) => {
  const date = new Date(fecha);
  const dia = date.getDate();
  const mes = date.toLocaleString('default', { month: 'long' });
  const año = date.getFullYear();
  const hora = date.getHours();
  const minutos = date.getMinutes();
  return `${dia}/ ${mes}/ ${año}, ${hora}:${minutos}Hs`;
};

obtenerDatosDolarTarjeta().then((datos) => {
  if (datos !== null) {
    const dolarTarjeta = document.getElementById("dolarTarjeta");
    dolarTarjeta.innerHTML += `
      <div class="api-dolar">
        <div class="scrolling-text">
          <h2>Dolar  ${datos.nombre}: Precio de compra: $${datos.compra}  Precio de venta: $${datos.venta}  Última actualización: ${formatearFecha(datos.fechaActualizacion)}</h2>
        </div>
      </div>
    `;
  } else {
    console.log("No se pudieron obtener los datos.");
  }
});

const scrollingText = document.querySelector('.scrolling-text');
const containerWidth = document.querySelector('.scrolling-text-container').offsetWidth;
const textWidth = scrollingText.offsetWidth;

// Calcular la duración de la animación basada en el ancho del texto y del contenedor
const animationDuration = textWidth / containerWidth * 20; 

scrollingText.style.animationDuration = animationDuration + 's';










