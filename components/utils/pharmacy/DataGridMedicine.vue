<template>
  <div class="patient-table-wrapper">
    <div class="patient-table-card">
      <div class="grid-view">
        <input
          type="text"
          class="form-control mb-3"
          placeholder="Buscar por nombre de medicamento"
          v-model="searchQuery"
        />
        <button
          class="btn btn-primary icon-btn add-btn"
          @click="showModal = true"
          title="Ingresar producto"
        >
          <AddCircleSvg class="svg-btn" />
        </button>
      </div>
      <div class="table-responsive">
        <table class="table patient-table">
          <thead>
            <tr>
              <th>Estado</th>
              <th>Nombre</th>
              <th>Peso</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="med in filteredMedicines" :key="med.id">
              <td>
                <span
                  :class="['status-oval', med.state === 'Disponible' ? 'available' : 'out-of-stock']"
                >
                  {{ med.state }}
                </span>
              </td>
              <td>{{ med.name }}</td>
              <td>{{ med.weight }} kg</td>
              <td>{{ med.stock }}</td>
              <td>{{ formatCurrency(med.price) }}</td>
              <td>
                <div class="action-btn-group">
                  <button
                    class="btn btn-success btn-sm icon-btn"
                    @click="editItem(med)"
                    title="Editar medicamento"
                  >
                    <EditSvg class="svg-btn" />
                  </button>
                  <button
                    class="btn btn-danger btn-sm icon-btn"
                    @click="deleteItem(med)"
                    title="Eliminar medicamento"
                  >
                    <DeleteSvg class="svg-btn" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Agregar Producto</h5>
            <button
              type="button"
              class="close close-btn"
              @click="showModal = false"
            >
              &times;
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label>Nombre</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Nombre"
                    v-model="newProduct.name"
                  />
                </div>
                <div class="form-group col-md-6">
                  <label>Descripción</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Descripción"
                    v-model="newProduct.description"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label>Cantidad</label>
                  <input
                    type="number"
                    class="form-control"
                    placeholder="Cantidad"
                    v-model="newProduct.quantity"
                  />
                </div>
                <div class="form-group col-md-6">
                  <label>Peso</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Peso"
                    v-model="newProduct.weight"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label>Ubicación</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Ubicación"
                    v-model="newProduct.location"
                  />
                </div>
                <div class="form-group col-md-6">
                  <label>Precio</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Precio"
                    v-model="newProduct.price"
                  />
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showModal = false"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="saveProduct"
            >
              Guardar
            </button>
          </div>
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
  name: 'DataGridMedicine',
  data() {
    return {
      searchQuery: '',
      showModal: false,
      newProduct: {
        name: '',
        description: '',
        quantity: null,
        weight: null,
        location: '',
        price: null,
      },
      medicines: [
        { id: 1, name: 'Paracetamol', state: 'Disponible', weight: 0.05, stock: 100, price: 1.2 },
         { id: 2, name: 'Ibuprofeno', state: 'Disponible', weight: 0.07, stock: 50, price: 2.5 },
        { id: 3, name: 'Omeprazol', state: 'Disponible', weight: 0.04, stock: 80, price: 3.0 },
        { id: 4, name: 'Amoxicilina', state: 'Agotado', weight: 0.03, stock: 0, price: 1.8 },
        { id: 5, name: 'Loratadina', state: 'Disponible', weight: 0.02, stock: 60, price: 1.5 },
        { id: 6, name: 'Cetirizina', state: 'Disponible', weight: 0.05, stock: 120, price: 1.3 },
        { id: 7, name: 'Claritromicina', state: 'Disponible', weight: 0.08, stock: 200, price: 4.0 },
        { id: 8, name: 'Ranitidina', state: 'Disponible', weight: 0.03, stock: 85, price: 1.9 },
        { id: 9, name: 'Ciproflaxacino', state: 'Agotado', weight: 0.12, stock: 0, price: 2.8 },
        { id: 10, name: 'Fexofenadina', state: 'Disponible', weight: 0.06, stock: 150, price: 2.0 },
        { id: 11, name: 'Loperamida', state: 'Disponible', weight: 0.02, stock: 95, price: 1.6 },
        { id: 12, name: 'Dextrometorfano', state: 'Disponible', weight: 0.04, stock: 110, price: 1.7 },
        { id: 13, name: 'Metformina', state: 'Disponible', weight: 0.04, stock: 180, price: 2.2 },
        { id: 14, name: 'Simvastatina', state: 'Disponible', weight: 0.03, stock: 130, price: 2.6 },
        { id: 15, name: 'Levotiroxina', state: 'Agotado', weight: 0.01, stock: 0, price: 3.3 },
        { id: 16, name: 'Amlodipina', state: 'Disponible', weight: 0.07, stock: 50, price: 2.9 },
        { id: 17, name: 'Atorvastatina', state: 'Disponible', weight: 0.06, stock: 75, price: 3.5 },
        { id: 18, name: 'Fluoxetina', state: 'Disponible', weight: 0.05, stock: 65, price: 2.7 },
        { id: 19, name: 'Acetaminofén', state: 'Disponible', weight: 0.04, stock: 90, price: 1.0 },
        { id: 20, name: 'Escitalopram', state: 'Agotado', weight: 0.03, stock: 0, price: 3.2 },
        // Agregar datos
      ],
    };
  },
  computed: {
    filteredMedicines() {
      return this.medicines.filter((med) =>
        med.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    formatCurrency(value) {
      return `$${parseFloat(value).toFixed(2)}`;
    },
    editItem(item) {
      alert(`Editar medicamento con ID: ${item.id}`);
    },
    deleteItem(item) {
      const confirmDelete = confirm(
        `¿Estás seguro de eliminar el medicamento con ID: ${item.id}?`
      );
      if (confirmDelete) {
        this.medicines = this.medicines.filter((med) => med.id !== item.id);
      }
    },
    saveProduct() {
      if (this.newProduct.name && this.newProduct.quantity) {
        this.medicines.push({
          id: this.medicines.length + 1,
          name: this.newProduct.name,
          description: this.newProduct.description,
          state: 'Disponible',
          weight: this.newProduct.weight || 0,
          stock: this.newProduct.quantity,
          location: this.newProduct.location,
          price: parseFloat(this.newProduct.price) || 0,
        });
        this.resetForm();
        this.showModal = false;
      } else {
        alert('Completa los campos obligatorios');
      }
    },
    resetForm() {
      this.newProduct = {
        name: '',
        description: '',
        quantity: null,
        weight: null,
        location: '',
        price: null,
      };
    },
  },
};
</script>

<style scoped>
.patient-table-wrapper {
  margin-top: 30px;
}

.patient-table-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.grid-view {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-control {
  border-radius: 20px;
  padding: 10px 20px;
  border: 1px solid #ced4da;
  transition: border-color 0.3s;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.add-btn {
  background-color: #007bff;
  border-color: #007bff;
}

.add-btn:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.table-responsive {
  margin-top: 20px;
}

.patient-table {
  width: 100%;
  border-collapse: collapse;
}

.patient-table th,
.patient-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.patient-table th {
  background-color: #f8f9fa;
  font-weight: 500;
}

.patient-table tbody tr:hover {
  background-color: #f1f1f1;
}

.action-btn-group {
  display: flex;
  gap: 5px;
}

.status-oval {
  display: inline-block;
  padding: 5px 15px;
  border-radius: 20px;
  color: #fff;
  text-align: center;
  font-size: 14px;
}

.status-oval.available {
  border: 2px solid green;
  background-color: white;
  color: green;
}

.status-oval.out-of-stock {
  border: 2px solid red;
  background-color: white;
  color: red;
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
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dropdown-menu {
  min-width: 160px;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border: 1px solid #f5f9fb;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  color: #333;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item.text-danger:hover {
  background-color: #fff5f5;
}

.btn-link {
  padding: 0;
  border: none;
}

.btn-link:hover .actions-icon {
  color: #2d60ff;
}

.actions-icon {
  font-size: 20px;
  color: #6c757d;
  cursor: pointer;
  display: inline-block;
  letter-spacing: 2px;  /* Aumentado el espaciado entre puntos */
}
</style>
