<template>
  <div class="client-table-wrapper">
    <div class="client-table-card">
      <div class="grid-view">
        <input type="text" class="form-control mb-3" placeholder="Buscar por Nombre, Apellido, Email o Teléfono" v-model="searchQuery" />
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-primary icon-btn add-btn" @click="openModal()" title="Agregar Cliente">
            <svg-add-circle/>
          </button>
          <button class="btn btn-secondary icon-btn add-btn" @click="openInactiveModal()" title="Ver Inactivos">
            <svg-eye/>
          </button>
        </div>  
      </div>

      <div v-if="showInactiveModal" class="modal-overlay">
        <div class="modal-content">
          <h2 class="modal-title">Clientes Inactivos</h2>
          <table class="table client-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="client in inactiveClients" :key="client.id">
                <td>{{ client.name }}</td>
                <td>{{ client.last_name }}</td>
                <td>{{ client.email }}</td>
                <td>{{ client.phone_number }}</td>
                <td>
                  <button class="btn btn-success btn-sm icon-btn add-btn" @click="activateClient(client.id)" title="Activar cliente">
                    <svg-add-circle/>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="form-group button-group">
            <button type="button" @click="closeInactiveModal" class="btn btn-secondary btn-lg icon-btn add-btn">
              <svg-close />
            </button>
          </div>
        </div>
      </div>

      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h2 class="modal-title">{{ isEditing ? 'Editar' : 'Agregar' }} Cliente</h2>
          <form @submit.prevent="saveClient">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Nombre</label>
                <input type="text" id="name" v-model="currentClient.name" required class="form-control">
              </div>
              <div class="form-group">
                <label for="lastName">Apellido</label>
                <input type="text" id="lastName" v-model="currentClient.last_name" required class="form-control">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="currentClient.email" required class="form-control">
              </div>
              <div class="form-group">
                <label for="phoneNumber">Teléfono</label>
                <input type="text" id="phoneNumber" v-model="currentClient.phone_number" required class="form-control" pattern="[0-9]{4}-[0-9]{3}-[0-9]{4}" placeholder="0412-123-4567">
              </div>
            </div>
            <div class="form-group button-group">
              <button type="button" @click="closeModal" class="btn btn-secondary btn-lg icon-btn add-btn">
                <svg-close />
              </button>
              <button type="submit" class="btn btn-primary btn-lg icon-btn add-btn" :title="isEditing ? 'Actualizar cliente' : 'Guardar cliente'">
                <svg-add-circle/>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table client-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedClients.length === 0">
              <td colspan="5" style="text-align:center; color:#2563eb; font-weight:500;">No hay clientes para mostrar</td>
            </tr>
            <tr v-for="client in paginatedClients" :key="client.id">
              <td>{{ client.name }}</td>
              <td>{{ client.last_name }}</td>
              <td>{{ client.email }}</td>
              <td>{{ client.phone_number }}</td>
              <td>
                <div class="action-btn-group">
                  <button class="btn btn-success btn-sm icon-btn" @click="editClient(client.id)" title="Editar cliente">
                    <svg-edit/>
                  </button>
                  <button class="btn btn-danger btn-sm icon-btn" @click="deleteClient(client.id)" title="Eliminar cliente">
                    <svg-delete />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination-container" v-if="totalPages > 1">
        <div class="custom-pagination">
          <button class="pagination-btn" :disabled="currentPage === 1" @click="currentPage--">Anterior</button>
          <span class="pagination-info">Página {{ currentPage }} de {{ totalPages }}</span>
          <button class="pagination-btn" :disabled="currentPage === totalPages" @click="currentPage++">Siguiente</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import api from '@/utils/simpleApi';

export default {
    name: 'DataGridClient',
    data() {
        return {
            searchQuery: '',
            showModal: false,
            showInactiveModal: false,
            isEditing: false,
            currentClient: {
                id: null,
                name: '',
                last_name: '',
                email: '',
                phone_number: ''
            },
            clients: [],
            currentPage: 1,
            itemsPerPage: 7
        };
    },
    computed: {
        filteredClients() {
            return this.clients.filter(client => {
                const searchString = `${client.name} ${client.last_name} ${client.email} ${client.phone_number}`.toLowerCase();
                return searchString.includes(this.searchQuery.toLowerCase());
            });
        },
        activeFilteredClients() {
            return this.filteredClients
                .filter(client => !client.deletedAt)
                .sort((a, b) => a.id - b.id);
        },
        inactiveClients() {
            return this.clients
                .filter(client => client.deletedAt)
                .sort((a, b) => a.id - b.id);
        },
        paginatedClients() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.activeFilteredClients.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.activeFilteredClients.length / this.itemsPerPage);
        }
    },
    async created() {
        await this.loadClients();
    },
    methods: {
        async loadClients() {
      try {
        const response = await api.get('/api/client');
        // Mapear los datos a la estructura esperada para la tabla
        const rawClients = response.data?.clients || response.data?.data?.clients || [];
        this.clients = rawClients.map(client => ({
          id: client.id,
          name: client.name || '',
          last_name: client.last_name || '',
          email: client.email || '',
          phone_number: client.phone_number || '',
          deletedAt: client.deletedAt ?? null
        })).sort((a, b) => a.id - b.id);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar los clientes'
        });
      }
        },

        async saveClient() {
            try {
                const clientData = {
                    name: this.currentClient.name,
                    last_name: this.currentClient.last_name,
                    email: this.currentClient.email,
                    phone_number: this.currentClient.phone_number
                };

                const existingClient = this.clients.find(c => 
                    c.email === clientData.email && 
                    (!this.isEditing || c.id !== this.currentClient.id)
                );

                if (existingClient) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Advertencia',
                        text: 'Ya existe un cliente con este email'
                    });
                    return;
                }

                if (this.isEditing) {
                    await api.put(`/api/client/${this.currentClient.id}`, clientData);
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Cliente actualizado con éxito'
                    });
                } else {
                    await api.post('/api/client', clientData);
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Cliente creado con éxito'
                    });
                }
                
                await this.loadClients();
                this.closeModal();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'Error al guardar el cliente'
                });
            }
        },

        async deleteClient(id) {
            const client = this.clients.find(c => c.id === id);
            if (!client) return;

            const result = await Swal.fire({
                title: '¿Está seguro?',
                text: `¿Desea eliminar el cliente ${client.name} ${client.last_name}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                try {
                    await api.delete(`/api/client/${id}`);
                    await this.loadClients();
                    Swal.fire(
                        'Eliminado',
                        `El cliente ${client.name} ${client.last_name} ha sido eliminado con éxito`,
                        'success'
                    );
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al eliminar el cliente'
                    });
                }
            }
        },

        async activateClient(id) {
            try {
                const client = this.clients.find(c => c.id === id);
                if (client) {
                    await api.put(`${this.baseURL}/${id}`, {
                        name: client.name,
                        last_name: client.last_name,
                        email: client.email,
                        phone_number: client.phone_number,
                        deletedAt: null
                    });
                    await this.loadClients();
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Cliente activado con éxito'
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al activar el cliente'
                });
            }
        },

        async editClient(id) {
            try {
                const client = this.clients.find(c => c.id === id);
                if (client) {
                    this.currentClient = {
                        id: client.id,
                        name: client.name,
                        last_name: client.last_name,
                        email: client.email,
                        phone_number: client.phone_number
                    };
                    this.isEditing = true;
                    this.showModal = true;
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al obtener los datos del cliente'
                });
            }
        },

        openModal() {
            this.isEditing = false;
            this.currentClient = {
                id: null,
                name: '',
                last_name: '',
                email: '',
                phone_number: ''
            };
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
            this.isEditing = false;
        },

        openInactiveModal() {
            this.showInactiveModal = true;
        },

        closeInactiveModal() {
            this.showInactiveModal = false;
        }
    },
    watch: {
      // Resetear a la primera página cuando cambia el filtro
      searchQuery() {
        this.currentPage = 1;
      },
      // Resetear paginación cuando se actualiza la lista de clientes
      clients() {
        this.currentPage = 1;
      }
    }
};
</script>

<style scoped>
.add-btn {
    background: #2563eb;
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    min-width: 44px;
    min-height: 44px;
    box-shadow: 0 2px 8px rgba(37,99,235,0.10);
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.18s, box-shadow 0.18s;
    padding: 0;
}
.add-btn:hover {
    background: #1746b0;
    color: #fff;
    box-shadow: 0 4px 16px rgba(37,99,235,0.18);
}

.table {
    margin-top: 20px;
}

/* Modern grid for search and add button */
.grid-view {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 0;
    margin-bottom: 20px;
    width: 100%;
}
.grid-view input[type="text"] {
    flex: 1 1 320px;
    margin-right: 12px;
    min-width: 0;
}


/* Modal mejorado y siempre por encima */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(30, 41, 59, 0.55);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: background 0.2s;
    backdrop-filter: blur(2px);
}

.modal-content {
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 38px 30px 28px 30px;
    border-radius: 22px;
    width: 95vw;
    max-width: 420px;
    min-width: 260px;
    box-shadow: 0 12px 48px 0 rgba(30,41,59,0.22), 0 2px 8px rgba(0,0,0,0.10);
    justify-content: center;
    align-items: stretch;
    animation: modalIn .22s cubic-bezier(.4,0,.2,1);
    position: relative;
}

@keyframes modalIn {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
}

.modal-title {
    text-align: center;
    margin-bottom: 22px;
    color: #1e293b;
    font-size: 1.45rem;
    font-weight: 700;
    letter-spacing: 0.01em;
}

.form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 15px;
    justify-content: space-between;
}

.form-group {
    flex: 1 1 180px;
    min-width: 120px;
}

.form-group label {
    text-align: left;
    display: block;
    margin: 0 5px 6px 5px;
    font-weight: 600;
    color: #334155;
    font-size: 1rem;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 10px 12px;
    border: 1.5px solid #cbd5e1;
    border-radius: 8px;
    font-size: 1.05rem;
    background: #f8fafc;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-shadow: 0 1px 2px rgba(30,41,59,0.04);
}
.form-group input:focus,
.form-group select:focus {
    border-color: #2563eb;
    outline: none;
    box-shadow: 0 0 0 2px #2563eb22;
}

.button-group {
    display: flex;
    justify-content: flex-end;
    gap: 14px;
    margin-top: 32px;
}

.btn-block {
    align-items: center;
    padding: 8px 18px;
    font-size: 1.1rem;
    border-radius: 8px;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(37,99,235,0.08);
    transition: background 0.2s;
}

.table {
    width: 100%;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.table th, .table td {
    padding: 12px 10px;
    text-align: left;
}
.table th {
    background: #f1f5f9;
    font-weight: 600;
    color: #2563eb;
    border-bottom: 2px solid #e5e7eb;
}
.table tr {
    transition: background 0.15s;
}
.table tr:hover {
    background: #f3f6fa;
}
/* Centrado y card visual para la tabla de clientes */
.client-table-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 70vh;
    width: 100%;
}

.client-table-card {
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.10);
    padding: 32px 28px 28px 28px;
    width: 100%;
    max-width: 1100px;
    min-width: 320px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.table-responsive {
    width: 100%;
    overflow-x: auto;
    /* margin-top: 18px; */
}

.client-table {
    width: 100%;
    background: #f8fafc;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border-collapse: separate;
    border-spacing: 0;
}
.client-table th, .client-table td {
    padding: 14px 12px;
    text-align: left;
}
.client-table th {
    background: #e0e7ef;
    font-weight: 700;
    color: #2563eb;
    border-bottom: 2px solid #d1d5db;
}
.client-table tr {
    transition: background 0.15s;
}
.client-table tr:hover {
    background: #e8f0fe;
}
.client-table td {
    font-size: 1.05rem;
    color: #222;
}

@media (max-width: 900px) {
    .client-table-card {
        padding: 18px 4px;
        max-width: 98vw;
    }
    .client-table th, .client-table td {
        padding: 10px 6px;
        font-size: 0.98rem;
    }
}

@media (max-width: 600px) {
    .client-table-card {
        padding: 8px 0;
        min-width: 0;
    }
    .client-table th, .client-table td {
        padding: 7px 2px;
        font-size: 0.93rem;
    }
}
/* SVG button icon style */
.svg-btn {
    width: 20px;
    height: 20px;
    vertical-align: middle;
    margin-bottom: 2px;
}
.icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 8px;
    min-width: 32px;
    min-height: 32px;
    border-radius: 6px;
    transition: background 0.15s;
    position: relative;
}
.icon-btn:hover {
    background: #e8f0fe;
}
.action-btn-group {
    display: flex;
    flex-direction: row;
    gap: 8px;
    justify-content: flex-start;
    align-items: center;
}
.pagination-container {
  margin-top: 20px;
}

.custom-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  background: #f8fafc;
  border-radius: 8px;
  padding: 10px 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}
.pagination-btn {
  background: #2d60ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 18px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.pagination-btn:disabled {
  background: #bfcbe6;
  color: #fff;
  cursor: not-allowed;
}
.pagination-info {
  font-size: 15px;
  color: #2d60ff;
  font-weight: 500;
}
</style>