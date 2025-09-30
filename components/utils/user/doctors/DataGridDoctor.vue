<template>
  <div class="doctors-table-wrapper">
    <div class="doctors-table-card">
      <div class="grid-view">
        <input type="text" class="form-control mb-3" placeholder="Buscar por nombre, apellido o cédula" v-model="searchQuery" />
        <button class="btn btn-primary icon-btn add-btn" @click="openModal()" title="Agregar doctor">
          <svg-add-circle/>
        </button>
      </div>

      <!-- Modal Agregar/Editar Doctor -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h2 class="modal-title">{{ isEditing ? 'Editar' : 'Agregar' }} Doctor</h2>
          <form @submit.prevent="saveDoctor">
            <div class="form-row">
              <div class="form-group">
                <label for="first_name">Nombres</label>
                <input type="text" id="first_name" v-model="currentDoctor.first_name" required class="form-control">
              </div>
              <div class="form-group">
                <label for="last_name">Apellidos</label>
                <input type="text" id="last_name" v-model="currentDoctor.last_name" required class="form-control">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="correo">Cédula</label>
                <input type="text" id="correo" v-model="currentDoctor.correo" required class="form-control">
              </div>
              <div class="form-group">
                <label for="birth_date">Fecha de Nacimiento</label>
                <input type="date" id="birth_date" v-model="currentDoctor.birth_date" required class="form-control">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="gender">Sexo</label>
                <select id="gender" v-model="currentDoctor.gender" required class="form-control">
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
              </div>
              <div class="form-group">
                <label for="phone_number">Nro de Teléfono</label>
                <input type="text" id="phone_number" v-model="currentDoctor.phone_number" required class="form-control">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="city">Ciudad</label>
                <input type="text" id="city" v-model="currentDoctor.city" required class="form-control">
              </div>
              <div class="form-group">
                <label for="state">Estado</label>
                <input type="text" id="state" v-model="currentDoctor.state" required class="form-control">
              </div>
            </div>
            <div class="form-group button-group">
              <button type="button" @click="closeModal" class="btn btn-secondary btn-lg icon-btn add-btn">
                <svg-close />
              </button>
              <button type="submit" class="btn btn-primary btn-lg icon-btn add-btn" :title="isEditing ? 'Actualizar doctor' : 'Guardar doctor'">
                <svg-add-circle/>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table doctors-table">
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Correo</th>
              <th>Nro de Teléfono</th>
              <th>Ciudad de Residencia</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedDoctors.length === 0">
              <td colspan="7" style="text-align:center; color:#2563eb; font-weight:500;">No hay doctores para mostrar</td>
            </tr>
            <tr v-for="doctor in paginatedDoctors" :key="doctor.id">
              <td>{{ doctor.first_name }}</td>
              <td>{{ doctor.last_name }}</td>
              <td>{{ doctor.correo }}</td>
              <td>{{ doctor.phone_number }}</td>
              <td>{{ doctor.city }}</td>
              <td>{{ doctor.state }}</td>
              <td>
                <div class="action-btn-group">
                  <button class="btn btn-success btn-sm icon-btn" @click="editDoctor(doctor.id)" title="Editar doctor">
                    <EditSvg class="svg-btn" />
                  </button>
                  <button class="btn btn-danger btn-sm icon-btn" @click="deleteDoctor(doctor.id)" title="Eliminar doctor">
                    <DeleteSvg class="svg-btn" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
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
import EditSvg from '~/components/svg/edit.vue';
import DeleteSvg from '~/components/svg/delete.vue';
import AddCircleSvg from '~/components/svg/add-circle.vue';
export default {
  name: "DataGridDoctor",
  components: {
        AddCircleSvg,
        EditSvg,
        DeleteSvg
    },
  data() {
    return {
      searchQuery: "",
      showModal: false,
      isEditing: false,
      currentDoctor: {
        id: null,
        first_name: "",
        last_name: "",
        correo: "",
        birth_date: "",
        gender: "masculino",
        phone_number: "",
        city: "",
        state: ""
      },
  doctors: [],
      currentPage: 1,
      itemsPerPage: 7
    };
  },
  computed: {
    filteredDoctors() {
      return this.doctors.filter((doctor) => {
        const searchString = `${doctor.first_name} ${doctor.last_name} ${doctor.correo}`.toLowerCase();
        return searchString.includes(this.searchQuery.toLowerCase());
      });
    },
    paginatedDoctors() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      const pageDoctors = this.filteredDoctors.slice(start, end);
      if (pageDoctors.length === 0 && this.currentPage > 1) {
        this.currentPage = 1;
        return this.filteredDoctors.slice(0, this.itemsPerPage);
      }
      return pageDoctors;
    },
    totalPages() {
      return Math.ceil(this.filteredDoctors.length / this.itemsPerPage);
    }
  },
  async created() {
    await this.loadDoctors();
  },
  methods: {
    async loadDoctors() {
      try {
        const res = await api.get('/api/employee');
        // Mapear los empleados a la estructura de doctor para la tabla
        this.doctors = (res.data?.employees || []).map(emp => ({
          id: emp.id,
          first_name: emp.user?.firstName || '',
          last_name: emp.user?.lastName || '',
          correo: emp.user?.email || '', // Si tienes cédula en user, cámbialo aquí
          birth_date: '', // No viene en la respuesta, dejar vacío o mapear si existe
          gender: '', // No viene en la respuesta, dejar vacío o mapear si existe
          phone_number: emp.phone_number || '',
          city: emp.home_address || '',
          state: emp.status || '',
          // Puedes agregar más campos si lo necesitas
        }));
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Error al cargar los doctores' });
      }
    },
    openModal() {
      this.isEditing = false;
      this.currentDoctor = {
        id: null,
        first_name: "",
        last_name: "",
        correo: "",
        birth_date: "",
        gender: "masculino",
        phone_number: "",
        city: "",
        state: ""
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.isEditing = false;
    },
    async saveDoctor() {
      try {
        // Mapear los datos del formulario a la estructura esperada por la API
        const doctorData = {
          phone_number: this.currentDoctor.phone_number,
          home_address: this.currentDoctor.city,
          status: this.currentDoctor.state,
          user: {
            firstName: this.currentDoctor.first_name,
            lastName: this.currentDoctor.last_name,
            email: this.currentDoctor.correo, // Si tienes cédula real, cámbialo aquí
            // Otros campos de user si son requeridos
          }
        };
        const existingDoctor = this.doctors.find(d => d.correo === doctorData.user.email && (!this.isEditing || d.id !== this.currentDoctor.id));
        if (existingDoctor) {
          Swal.fire({ icon: 'warning', title: 'Advertencia', text: 'Ya existe un doctor con esta cédula' });
          return;
        }
        if (this.isEditing) {
          await api.put(`/api/employee/${this.currentDoctor.id}`, doctorData);
          Swal.fire({ icon: 'success', title: 'Éxito', text: 'Doctor actualizado con éxito' });
        } else {
          await api.post('/api/employee', doctorData);
          Swal.fire({ icon: 'success', title: 'Éxito', text: 'Doctor creado con éxito' });
        }
        await this.loadDoctors();
        this.closeModal();
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Error al guardar el doctor' });
      }
    },
    async editDoctor(id) {
      try {
        const res = await api.get(`/api/employee/${id}`);
        const emp = res.data?.employee || res.data;
        this.currentDoctor = {
          id: emp.id,
          first_name: emp.user?.firstName || '',
          last_name: emp.user?.lastName || '',
          correo: emp.user?.email || '',
          birth_date: '',
          gender: '',
          phone_number: emp.phone_number || '',
          city: emp.home_address || '',
          state: emp.status || ''
        };
        this.isEditing = true;
        this.showModal = true;
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Error al obtener los datos del doctor' });
      }
    },
    async deleteDoctor(id) {
      const doctor = this.doctors.find(d => d.id === id);
      if (!doctor) return;
      const result = await Swal.fire({
        title: '¿Está seguro?',
        text: `¿Desea eliminar el doctor con cédula: ${doctor.correo}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/employee/${id}`);
          await this.loadDoctors();
          Swal.fire('Eliminado', `El doctor ${doctor.correo} ha sido eliminado con éxito`, 'success');
        } catch (error) {
          Swal.fire({ icon: 'error', title: 'Error', text: 'Error al eliminar el doctor' });
        }
      }
    }
  },
  watch: {
    searchQuery() {
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
/* Centrado y card visual para la tabla de pacientes */
.doctors-table-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 70vh;
    width: 100%;
}

.doctors-table-card {
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

.doctors-table {
    width: 100%;
    background: #f8fafc;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border-collapse: separate;
    border-spacing: 0;
}
.doctors-table th, .doctors-table td {
    padding: 14px 12px;
    text-align: left;
}
.doctors-table th {
    background: #e0e7ef;
    font-weight: 700;
    color: #2563eb;
    border-bottom: 2px solid #d1d5db;
}
.doctors-table tr {
    transition: background 0.15s;
}
.doctors-table tr:hover {
    background: #e8f0fe;
}
.doctors-table td {
    font-size: 1.05rem;
    color: #222;
}

@media (max-width: 900px) {
    .doctors-table-card {
        padding: 18px 4px;
        max-width: 98vw;
    }
    .doctors-table th, .doctors-table td {
        padding: 10px 6px;
        font-size: 0.98rem;
    }
}

@media (max-width: 600px) {
    .doctors-table-card {
        padding: 8px 0;
        min-width: 0;
    }
    .doctors-table th, .doctors-table td {
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