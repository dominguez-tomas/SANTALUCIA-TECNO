class Producto {

    constructor({ id, nombre, precio, descripcion, img }) {
        this.id = id
        this.nombre = nombre
        this.precio = precio
        this.cantidad = 1
        this.descripcion = descripcion
        this.img = img
    }

    aumentarCantidad() {
        this.cantidad++
    }

    disminuirCantidad() {
        if (this.cantidad > 1) {
            this.cantidad--
            return true
        }

        return false
    }

    descripcionHTMLCarrito() {
        return `
        <div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${this.img}" class="img-fluid rounded-start" alt="...">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${this.nombre}</h5>
                        <p class="card-text">Cantidad: <button class="btn btn-dark" id="minus-${this.id}"><i class="fa-solid fa-minus fa-1x"></i></button>${this.cantidad}<button class="btn btn-dark" id="plus-${this.id}"><i class="fa-solid fa-plus"></i></button> </p>
                        <p class="card-text">Precio: $${this.precio}</p>
                        <button class="btn btn-danger" id="eliminar-${this.id}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>
        </div>`
    }

    descripcionHTML() {
        return `<div class="card" style="width: 18rem;">
        <img src="${this.img}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${this.nombre}</h5>
            <p class="card-text">${this.descripcion}</p>
            <p class="card-text">$${this.precio}</p>
            <button class="btn btn-primary" id="ap-${this.id}">Añadir al carrito</button>
        </div>
    </div>
        `
    }
}

class Carrito {
    constructor() {
        this.listaCarrito = []
        this.contenedor_carrito = document.getElementById('contenedor_carrito')
        this.total = document.getElementById('total')
        this.finalizar_compra = document.getElementById("finalizar_compra")
        this.keyStorage = "listaCarrito"
    }

    levantarStorage() {
        this.listaCarrito = JSON.parse(localStorage.getItem(this.keyStorage)) || []

        if (this.listaCarrito.length > 0) {
            let listaAuxiliar = []

            for (let i = 0; i < this.listaCarrito.length; i++) {
                let productoDeLaClaseProducto = new Producto(this.listaCarrito[i])
                listaAuxiliar.push(productoDeLaClaseProducto)
            }

            this.listaCarrito = listaAuxiliar
        }
    }

    guardarEnStorage() {
        let listaCarritoJSON = JSON.stringify(this.listaCarrito)
        localStorage.setItem(this.keyStorage, listaCarritoJSON)
    }

    agregar(productoAgregar) {
        let existeElProducto = this.listaCarrito.some(producto => producto.id == productoAgregar.id)

        if (existeElProducto) {
            let producto = this.listaCarrito.find(producto => producto.id == productoAgregar.id)
            producto.cantidad = producto.cantidad + 1
        } else {
            this.listaCarrito.push(productoAgregar)
        }
    }

    eliminar(productoEliminar) {
        let producto = this.listaCarrito.find(producto => producto.id == productoEliminar.id)
        let indice = this.listaCarrito.indexOf(producto)
        this.listaCarrito.splice(indice, 1)
    }

    limpiarContenedorCarrito() {
        this.contenedor_carrito.innerHTML = ""
    }

    mostrarProductos() {
        this.limpiarContenedorCarrito()

        this.listaCarrito.forEach(producto => {
            contenedor_carrito.innerHTML += producto.descripcionHTMLCarrito()
        })

        //Botón "Eliminar producto del carrito"
        this.listaCarrito.forEach(producto => {

            let btn_eliminar = document.getElementById(`eliminar-${producto.id}`)
            let btn_plus = document.getElementById(`plus-${producto.id}`)
            let btn_minus = document.getElementById(`minus-${producto.id}`)

            btn_eliminar.addEventListener("click", () => {
                this.eliminar(producto)
                this.guardarEnStorage()
                this.mostrarProductos()
            })

            btn_plus.addEventListener("click", () => {
                producto.aumentarCantidad()
                this.mostrarProductos()
            })

            btn_minus.addEventListener("click", () => {
                if (producto.disminuirCantidad()) {
                    this.mostrarProductos()
                }
            })

        })

        total.innerHTML = "Precio Total: $" + this.calcular_total()
    }

    calcular_total() {
        return this.listaCarrito.reduce((acumulador, producto) => acumulador + producto.precio * producto.cantidad, 0)
    }

    eventoFinalizarCompra() {
        this.finalizar_compra.addEventListener("click", () => {

            if (this.listaCarrito.length > 0) {
                let precio_total = this.calcular_total()
                //limpiar el carrito
                this.listaCarrito = []
                //limpiar el storage
                localStorage.removeItem(this.keyStorage)
                //total
                this.limpiarContenedorCarrito()
                this.total.innerHTML = ""
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: `¡La compra se registró con éxito por un total de:  $${precio_total}`,
                    text: "Para más detalle, revise su e-mail",
                    timer: 3000
                  })

            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: '¡Debes añadir productos para realizar la compra!',
                    timer: 3000
                  })
            }
        })
    }
}

class ProductoController {
    constructor() {
        this.listaProductos = []
    }

    cargarProductos() {
        //Productos
        const p1 = new Producto({ id: 1, nombre: "ryzen 3", precio: 100000, descripcion: "un procesador de gama baja", img: "https://img.xentra.com.mx/xentra_jbsystem/img/productos/YD3200C5FHBOX/YD3200C5FHBOX_842_31_07_21_06_39.webp" })
        const p2 = new Producto({ id: 2, nombre: "ryzen 5", precio: 150000, descripcion: "un procesador de gama media", img: "https://m.media-amazon.com/images/I/51f2hkWjTlL.__AC_SX300_SY300_QL70_ML2_.jpg" })
        const p3 = new Producto({ id: 3, nombre: "ryzen 7", precio: 300000, descripcion: "un procesador de gama media - alta", img: "https://m.media-amazon.com/images/I/51D3DrDmwkL.__AC_SX300_SY300_QL70_ML2_.jpg" })
        const p4 = new Producto({ id: 4, nombre: "ryzen 9", precio: 500000, descripcion: "un procesador de gama alta", img: "https://m.media-amazon.com/images/I/616VM20+AzL._AC_SX300_SY300_.jpg" })

        this.agregar(p1)
        this.agregar(p2)
        this.agregar(p3)
        this.agregar(p4)
    }

    agregar(producto) {
        this.listaProductos.push(producto)
    }

    mostrarProductos() {
        let contenedor_productos = document.getElementById("contenedor_productos")
        this.listaProductos.forEach(producto => {
            contenedor_productos.innerHTML += producto.descripcionHTML()
        })

        //Botón "añadir al carrito"
        this.listaProductos.forEach(producto => {

            const btn = document.getElementById(`ap-${producto.id}`)

            btn.addEventListener("click", () => {
                carrito.agregar(producto)
                carrito.guardarEnStorage()
                carrito.mostrarProductos()
                Toastify({
                    avatar: `${producto.img}`,
                    text: `¡${producto.nombre} añadido!`,
                    duration: 1000,
                    gravity: "bottom",
                    position: "right", 

                  }).showToast();
            })
        })
    }
}

const carrito = new Carrito()
carrito.levantarStorage()
carrito.mostrarProductos()
carrito.eventoFinalizarCompra()

const controlador_productos = new ProductoController()
controlador_productos.cargarProductos()
controlador_productos.mostrarProductos()