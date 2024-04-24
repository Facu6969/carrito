const shopContent = document.getElementById("shopContent");
const verCarrito = document.getElementById("verCarrito");
const modalContainer = document.getElementById("modal-container");
const cantidadCarrito = document.getElementById("cantidadCarrito");


let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const getProducts = async () => {
  const respuesta = await fetch("./producto.json");
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
  totalCompra.innerHTML = `total a pagar: $${total}`;
  modalContainer.append(totalCompra);
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



// Agregar datos del dólar blue desde la API
const obtenerDatosDolarBlue = async () => {
  try {
    const respuesta = await fetch('https://dolarapi.com/v1/dolares/blue');
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error('Error al obtener los datos del dólar blue:', error);
    return null;
  }
};


obtenerDatosDolarBlue().then((datos) => {
  if (datos !== null) {
    const contenidoPrincipal = document.getElementById('contenidoPrincipal');
    contenidoPrincipal.innerHTML += `
      <div>
        <h2>Precio de compra: $${datos.compra}</h2>
        <h2>Precio de venta: $${datos.venta}</h2>
        <p>Última actualización: ${datos.nombre}</p>
      </div>
    `;
  } else {
    console.log('No se pudieron obtener los datos del dólar blue.');
  }
});



