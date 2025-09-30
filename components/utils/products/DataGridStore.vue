<template>
  <div class="patient-table-wrapper">
    <div class="patient-table-card">
      <div class="grid-view">
        <input type="text" class="form-control mb-3" placeholder="Buscar por nombre" v-model="searchQuery" />
        <button class="btn btn-primary icon-btn add-btn" @click="showForm = true" title="Agregar producto">
          <AddCircleSvg class="svg-btn" />
        </button>
      </div>
      <div class="table-responsive">
        <table class="table patient-table">
          <thead>
            <tr>
              <th>Estado</th>
              <th>Detalle</th>
              <th>Peso</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>{{ product.status }}</td>
              <td>{{ product.detail }}</td>
              <td>{{ product.weight }}</td>
              <td>{{ product.amount }}</td>
              <td>{{ product.price }}</td>
              <td>
                <div class="action-btn-group">
                  <button class="btn btn-success btn-sm icon-btn" @click="editProduct(product.id)" title="Editar producto">
                    <EditSvg class="svg-btn" />
                  </button>
                  <button class="btn btn-danger btn-sm icon-btn" @click="deleteProduct(product.id)" title="Eliminar producto">
                    <DeleteSvg class="svg-btn" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="showForm" class="modal-overlay" @click.self="cancelar">
        <div class="modal-content">
          <h2 class="modal-title">Agregar Producto</h2>
          <form @submit.prevent="guardarProducto" class="form">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" v-model="nuevoProducto.nombre" required />
            <label for="descripcion">Descripción</label>
            <input type="text" id="descripcion" v-model="nuevoProducto.descripcion" required />
            <label for="cantidad">Cantidad</label>
            <input type="number" id="cantidad" v-model="nuevoProducto.cantidad" required />
            <label for="peso">Peso</label>
            <input type="number" id="peso" v-model="nuevoProducto.peso" required />
            <label for="ubicacion">Ubicación</label>
            <input type="text" id="ubicacion" v-model="nuevoProducto.ubicacion" required />
            <label for="precio">Precio</label>
            <input type="number" id="precio" v-model="nuevoProducto.precio" required />
            <div class="form-group button-group">
              <button type="button" class="btn btn-secondary btn-lg" @click="cancelar">Cancelar</button>
              <button type="submit" class="btn btn-primary btn-lg">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EditSvg from '~/components/svg/edit.vue';
import DeleteSvg from '~/components/svg/delete.vue';
import AddCircleSvg from '~/components/svg/add-circle.vue';

export default {
  data() {
    return {
      searchQuery: '',
      showForm: false,  
      nuevoProducto: {
        nombre: '',
        descripcion: '',
        cantidad: '',
        peso: '',
        ubicacion: '',
        precio: '',
      },
      products: [
        { id: 1, status: 'Procesado', detail: 'Ibuprofeno', weight: '200 gr', amount: 40, price: 110.1 },
        { id: 2, status: 'Procesado', detail: 'Acetaminofén', weight: '500 gr', amount: 220, price: 90 },
      ],
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter((product) => {
        const fullDetail = `${product.status} ${product.detail}`.toLowerCase();
        return fullDetail.includes(this.searchQuery.toLowerCase());
      });
    },
  },
  methods: {
    guardarProducto() {
      const newProduct = {
        id: this.products.length + 1,
        ...this.nuevoProducto,
      };
      this.products.push(newProduct);
      this.showForm = false;
      this.resetForm();
    },
    cancelar() {
      this.showForm = false;
      this.resetForm();
    },
    resetForm() {
      this.nuevoProducto = {
        nombre: '',
        descripcion: '',
        cantidad: '',
        peso: '',
        ubicacion: '',
        precio: '',
      };
    },
    editProduct(id) {
      alert(`Editar producto con ID: ${id}`);
    },
    deleteProduct(id) {
      this.products = this.products.filter((product) => product.id !== id);
      alert(`Producto con ID: ${id} eliminado`);
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.patient-table-wrapper {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.patient-table-card {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.grid-view {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.form-control {
  flex-grow: 1;
  margin-right: 10px;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-btn {
  background-color: #007bff;
  color: white;
}

.add-btn:hover {
  background-color: #0056b3;
}

.table-responsive {
  overflow-x: auto;
}

.patient-table {
  width: 100%;
  border-collapse: collapse;
}

.patient-table th,
.patient-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.patient-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.action-btn-group {
  display: flex;
  gap: 5px;
}

.svg-btn {
  width: 20px;
  height: 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2.modal-title {
  text-align: center;
  margin-bottom: 20px;
}

.form {
  display: flex;
  flex-direction: column;
}

label {
  margin: 10px 0 5px;
  font-weight: bold;
}

input {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.form-group.button-group {
  display: flex;
  justify-content: space-between;
}

button {
  padding: 10px 20px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

/* Estilo para la barra de búsqueda y el botón con el mismo ancho */
.d-flex {
  display: flex;
  align-items: center;
}

.flex-grow-1 {
  flex-grow: 1;
}

.ms-3 {
  margin-left: 1rem; 
}

.mb-3 {
  margin-bottom: 1rem;
}
</style>








