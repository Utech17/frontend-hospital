<template>
  <div class="patient-table-wrapper">
    <div class="patient-table-card">
      <div class="grid-view">
        <input type="text" class="form-control mb-3" placeholder="Buscar por descripción" v-model="searchQuery" />
        <button class="btn btn-primary icon-btn add-btn" @click="showModal = true" title="Agregar Transacción">
          <AddCircleSvg class="svg-btn" />
        </button>
      </div>
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h2 class="modal-title">{{ isEditing ? 'Editar' : 'Agregar' }} Transacción</h2>
          <form @submit.prevent="saveTransaction">
            <div class="form-row">
              <div class="form-group">
                <label>Fecha</label>
                <input type="date" class="form-control" v-model="newTransaction.date" />
              </div>
              <div class="form-group">
                <label>Categoría</label>
                <input type="text" class="form-control" v-model="newTransaction.category" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Cuentas</label>
                <input type="text" class="form-control" v-model="newTransaction.accounts" />
              </div>
              <div class="form-group">
                <label>Descripción</label>
                <input type="text" class="form-control" v-model="newTransaction.description" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Monto</label>
                <input type="number" class="form-control" v-model="newTransaction.amount" />
              </div>
            </div>
            <div class="form-group button-group">
              <button type="button" @click="closeModal" class="btn btn-secondary btn-lg">Cancelar</button>
              <button type="submit" class="btn btn-primary btn-lg">{{ isEditing ? 'Actualizar' : 'Guardar' }}</button>
            </div>
          </form>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table patient-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Categoría</th>
              <th>Cuentas</th>
              <th>Descripción</th>
              <th>Monto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in filteredTransactions" :key="transaction.id">
              <td>{{ formatDate(transaction.date) }}</td>
              <td>{{ transaction.category }}</td>
              <td>{{ transaction.accounts }}</td>
              <td>{{ transaction.description }}</td>
              <td>{{ formatCurrency(transaction.amount) }}</td>
              <td>
                <div class="action-btn-group">
                  <button class="btn btn-success btn-sm icon-btn" @click="editTransaction(transaction)" title="Editar transacción">
                    <EditSvg class="svg-btn" />
                  </button>
                  <button class="btn btn-danger btn-sm icon-btn" @click="deleteTransaction(transaction.id)" title="Eliminar transacción">
                    <DeleteSvg class="svg-btn" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import EditSvg from '~/components/svg/edit.vue';
import DeleteSvg from '~/components/svg/delete.vue';
import AddCircleSvg from '~/components/svg/add-circle.vue';
import { v4 as uuidv4 } from 'uuid'; 

export default {
  name: 'DataGridFinance',
  data() {
    return {
      searchQuery: '',
      transactions: [
        { id: uuidv4(), date: '2024-03-08', category: 'Compra', accounts: 'Banco', description: 'Compra de suministros de oficina', amount: 150.00 },
        { id: uuidv4(), date: '2024-03-07', category: 'Venta', accounts: 'Caja', description: 'Venta de producto A', amount: 200.00 },
      ],
      showModal: false,
      isEditing: false, 
      newTransaction: {
        date: '',
        category: '',
        accounts: '',
        description: '',
        amount: null,
      },
      editingTransaction: null, 
    };
  },
  computed: {
    filteredTransactions() {
      return this.transactions.filter(transaction =>
        transaction.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    formatCurrency(value) {
      return `$${parseFloat(value).toFixed(2)}`;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    editTransaction(transaction) {
      this.isEditing = true;
      this.showModal = true;
      this.editingTransaction = { ...transaction }; 
      this.newTransaction = { ...transaction }; 
    },
    deleteTransaction(id) {
      const confirmDelete = confirm(`¿Estás seguro de eliminar la transacción con ID: ${id}?`);
      if (confirmDelete) {
        this.transactions = this.transactions.filter(transaction => transaction.id !== id);
      }
    },
    saveTransaction() {
      if (!this.newTransaction.date || !this.newTransaction.category || !this.newTransaction.accounts || !this.newTransaction.description || !this.newTransaction.amount) {
        alert('Todos los campos son obligatorios.');
        return;
      }

      if (this.isEditing) {
        const index = this.transactions.findIndex(t => t.id === this.editingTransaction.id);
        if (index !== -1) {
          this.transactions.splice(index, 1, { ...this.editingTransaction, ...this.newTransaction });
        }
      } else {
        this.transactions.push({ id: uuidv4(), ...this.newTransaction });
      }

      this.closeModal();
    },
    closeModal() {
      this.showModal = false;
      this.isEditing = false;
      this.newTransaction = {
        date: '',
        category: '',
        accounts: '',
        description: '',
        amount: null,
      };
      this.editingTransaction = null;
    },
  },
};
</script>

<style scoped>
.patient-table-wrapper {
  margin-top: 20px;
}

.patient-table-card {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.grid-view {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-control {
  border-radius: 5px;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 0;
}

.add-btn {
  background-color: #007bff;
  border: none;
  color: #fff;
  font-size: 18px;
}

.add-btn:hover {
  background-color: #0056b3;
  cursor: pointer;
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

.modal-title {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 500;
}

.form-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.form-group {
  flex: 1;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-lg {
  padding: 10px 20px;
  font-size: 16px;
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
  border-bottom: 1px solid #ddd;
}

.patient-table th {
  background-color: #f8f9fa;
  font-weight: 500;
}

.action-btn-group {
  display: flex;
  gap: 5px;
}

.svg-btn {
  width: 20px;
  height: 20px;
  fill: currentColor;
}
</style>