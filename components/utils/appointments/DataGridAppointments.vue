<template>
  <div class="appointment-table-wrapper">
    <div class="appointment-table-card">
      <div class="grid-view">
        <input type="text" class="form-control mb-3"
            placeholder="Buscar por nombre, doctor, área, estado..." v-model="searchQuery" />
        <button class="btn btn-primary icon-btn add-btn" @click="openModal()" title="Agregar cita">
            <svg-add-circle/>
        </button>
      </div>

      <!-- Modal Agregar/Editar Cita -->
      <div v-if="showModal" class="modal-overlay">
          <div class="modal-content">
              <h2 class="modal-title">{{ isEditing ? 'Editar' : 'Programar' }} Cita</h2>
              <form @submit.prevent="saveAppointment">
                  <div class="form-row" style="display: flex; flex-direction: column; gap: 10px;">
                      <div style="display: flex; gap: 10px;">
                          <div class="form-group" style="flex:1;">
                              <label for="name">Nombres</label>
                              <input type="text" id="name" v-model="currentAppointment.name" required class="form-control">
                          </div>
                          <div class="form-group" style="flex:1;">
                              <label for="lastName">Apellidos</label>
                              <input type="text" id="lastName" v-model="currentAppointment.lastName" required class="form-control">
                          </div>
                      </div>
                      <div style="display: flex; gap: 10px;">
                          <div class="form-group" style="flex:1;">
                              <label for="idCard">Cédula</label>
                              <input type="text" id="idCard" v-model="currentAppointment.idCard" required class="form-control">
                          </div>
                          <div class="form-group" style="flex:1;">
                              <label for="age">Edad</label>
                              <input type="number" id="age" v-model="currentAppointment.age" required class="form-control">
                          </div>
                      </div>
                      <div style="display: flex; gap: 10px;">
                          <div class="form-group" style="flex:1;">
                              <label for="sexology">Sexo</label>
                              <select id="sexology" v-model="currentAppointment.sexology" required class="form-control">
                                  <option value="Masculino">Masculino</option>
                                  <option value="Femenino">Femenino</option>
                                  <option value="Otro">Otro</option>
                              </select>
                          </div>
                          <div class="form-group" style="flex:1;">
                              <label for="phoneNumber">Nº de Teléfono</label>
                              <input type="tel" id="phoneNumber" v-model="currentAppointment.phoneNumber" required class="form-control">
                          </div>
                      </div>
                      <div style="display: flex; gap: 10px;">
                          <div class="form-group" style="flex:1;">
                              <label for="doctor">Médico</label>
                              <input type="text" id="doctor" v-model="currentAppointment.doctor" required class="form-control">
                          </div>
                          <div class="form-group" style="flex:1;">
                              <label for="date">Fecha de Cita</label>
                              <input type="date" id="date" v-model="currentAppointment.date" required class="form-control">
                          </div>
                      </div>
                      <div style="display: flex; gap: 10px;">
                          <div class="form-group" style="flex:1;">
                              <label for="time">Hora</label>
                              <input type="time" id="time" v-model="currentAppointment.time" required class="form-control">
                          </div>
                          <div class="form-group" style="flex:1;">
                              <label for="area">Área</label>
                              <input type="text" id="area" v-model="currentAppointment.area" required class="form-control">
                          </div>
                      </div>
                      <div style="display: flex; gap: 10px;">
                          <div class="form-group" style="flex:1;">
                              <label for="status">Estado</label>
                              <select id="status" v-model="currentAppointment.status" required class="form-control">
                                  <option value="Pendiente">Pendiente</option>
                                  <option value="Atendido">Atendido</option>
                              </select>
                          </div>
                          <div style="flex:1;"></div>
                      </div>
                  </div>
                  <div class="form-group button-group">
                        <button type="button" @click="closeModal" class="btn btn-secondary btn-lg icon-btn add-btn" title="Cerrar formulario">
                                <svg-close />
                        </button>
                        <button type="submit" class="btn btn-primary btn-lg icon-btn add-btn" :title="isEditing ? 'Actualizar cita' : 'Guardar cita'">
                            <svg-add-circle/>
                        </button>
                  </div>
              </form>
          </div>
      </div>

      <div class="table-responsive">
        <table class="table appointment-table">
            <thead>
                <tr>
                    <th>Estado</th>
                    <th>Nombre</th>
                    <th>Apellidos</th>
                    <th>Cédula</th>
                    <th>Médico</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Área</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="appointment in paginatedAppointments" :key="appointment.id">
                    <td>
                      <span :class="['status-oval', appointment.status === 'Pendiente' ? 'available' : 'out-of-stock']">
                        {{ appointment.status }}
                      </span>
                    </td>
                    <td>{{ appointment.name }}</td>
                    <td>{{ appointment.lastName }}</td>
                    <td>{{ appointment.idCard }}</td>
                    <td>{{ appointment.doctor }}</td>
                    <td>{{ appointment.date }}</td>
                    <td>{{ appointment.time }}</td>
                    <td>{{ appointment.area }}</td>
                    <td>
                        <div class="action-btn-group">
                          <button class="btn btn-success btn-sm icon-btn " @click="editAppointment(appointment.id)" title="Editar cita">
                              <svg-edit/>
                          </button>
                          <button class="btn btn-danger btn-sm icon-btn " @click="deleteAppointment(appointment.id)" title="Eliminar cita">
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
import api from '~/utils/simpleApi';
import EditSvg from '~/components/svg/edit.vue';
import DeleteSvg from '~/components/svg/delete.vue';
import AddCircleSvg from '~/components/svg/add-circle.vue';

export default {
    name: 'DataGridAppointments',
    components: {
        EditSvg,
        DeleteSvg,
        AddCircleSvg
    },
    data() {
        return {
            searchQuery: '',
            showModal: false,
            isEditing: false,
            currentAppointment: {
                id: null,
                name: '',
                lastName: '',
                idCard: '',
                age: '',
                sexology: '',
                phoneNumber: '',
                doctor: '',
                date: '',
                time: '',
                area: '',
                status: 'Pendiente'
            },
            appointments: [],
            currentPage: 1,
            itemsPerPage: 7,
        };
    },
    computed: {
        filteredAppointments() {
            const search = this.searchQuery.toLowerCase().trim();
            return this.appointments.filter(a => {
                return (
                    (a.name && a.name.toLowerCase().includes(search)) ||
                    (a.lastName && a.lastName.toLowerCase().includes(search)) ||
                    (a.doctor && a.doctor.toLowerCase().includes(search)) ||
                    (a.area && a.area.toLowerCase().includes(search)) ||
                    (a.status && a.status.toLowerCase().includes(search)) ||
                    (a.idCard && a.idCard.toLowerCase().includes(search))
                );
            });
        },
        paginatedAppointments() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            const pageAppointments = this.filteredAppointments.slice(start, end);
            if (pageAppointments.length === 0 && this.currentPage > 1) {
                this.currentPage = 1;
                return this.filteredAppointments.slice(0, this.itemsPerPage);
            }
            return pageAppointments;
        },
        totalPages() {
            return Math.ceil(this.filteredAppointments.length / this.itemsPerPage);
        },
    },
    created() {
        this.loadAppointments();
    },
    watch: {
        searchQuery() {
            this.currentPage = 1;
        },
        appointments() {
            this.currentPage = 1;
        }
    },
    methods: {
        async loadAppointments() {
            try {
                const response = await api.get('/api/appointment');
                // Mapear los datos a la estructura esperada para la tabla
                let arr = Array.isArray(response?.data?.Appointments)
                    ? response.data.Appointments
                    : Array.isArray(response) ? response : (response?.data || response?.appointments || []);
                this.appointments = arr
                    .filter(a => a && typeof a === 'object')
                    .map(a => {
                        const patient = a.Patient || {};
                        const employee = a.employee || {};
                        return {
                            id: a.id || a._id,
                            name: patient.firstName || '',
                            lastName: patient.lastName || '',
                            idCard: patient.identifier || '',
                            age: patient.birthDate ? String(new Date().getFullYear() - new Date(patient.birthDate).getFullYear()) : '',
                            sexology: patient.gender || '',
                            doctor: employee.user ? `Doc. ${employee.user.firstName} ${employee.user.lastName}` : '',
                            date: a.appointment_date ? a.appointment_date.split('T')[0] : '',
                            time: a.appointment_date ? (a.appointment_date.split('T')[1] ? a.appointment_date.split('T')[1].slice(0,5) : '') : '',
                            area: a.appointment_area || '',
                            status: a.appointment_status || 'Pendiente'
                        };
                    });
            } catch (e) {
                    this.appointments = [];
                    Swal.fire({ icon: 'error', title: 'Error', text: 'Error al cargar las citas' });
            }
        },
        async saveAppointment() {
            try {
                if (!this.currentAppointment.name || !this.currentAppointment.lastName || !this.currentAppointment.idCard || !this.currentAppointment.doctor || !this.currentAppointment.date || !this.currentAppointment.time || !this.currentAppointment.area) {
                    Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'Por favor complete todos los campos obligatorios' });
                    return;
                }
                // Mapear los datos a la estructura esperada por la API
                let data = {
                    appointment_date: `${this.currentAppointment.date}T${this.currentAppointment.time}:00.000Z`,
                    appointment_status: this.currentAppointment.status || 'Pendiente',
                    appointment_area: this.currentAppointment.area || '',
                    appointment_id: this.currentAppointment.appointment_id || null,
                    employee_id: this.currentAppointment.employee_id || null
                };
                let response;
                if (this.isEditing) {
                    response = await api.put(`/api/appointment/${this.currentAppointment.id}`, data);
                } else {
                    response = await api.post('/api/appointment', data);
                }
                Swal.fire({ icon: 'success', title: 'Éxito', text: this.isEditing ? 'Cita actualizada' : 'Cita creada' });
                await this.loadAppointments();
                this.closeModal();
            } catch (e) {
                Swal.fire({ icon: 'error', title: 'Error', text: 'Error al guardar la cita' });
            }
        },
        async deleteAppointment(id) {
            try {
                await api.del(`/api/appointments/${id}`);
                await this.loadAppointments();
                Swal.fire({ icon: 'success', title: 'Eliminado', text: 'Cita eliminada' });
            } catch (e) {
                Swal.fire({ icon: 'error', title: 'Error', text: 'Error al eliminar la cita' });
            }
        },
        async editAppointment(id) {
            try {
                const response = await api.get(`/api/appointment/${id}`);
                const a = response.data || response;
                // Mapear los datos a la estructura esperada para la tabla
                const appointment = a.appointment || {};
                const employee = a.employee || {};
                this.currentAppointment = {
                    id: a.id || a._id,
                    name: appointment.firstName || '',
                    lastName: appointment.lastName || '',
                    idCard: appointment.identifier || '',
                    age: appointment.birthDate ? String(new Date().getFullYear() - new Date(appointment.birthDate).getFullYear()) : '',
                    sexology: appointment.gender || '',
                    phoneNumber: employee.phone_number || '',
                    doctor: employee.home_address || '',
                    date: a.appointment_date ? a.appointment_date.split('T')[0] : '',
                    time: a.appointment_date ? (a.appointment_date.split('T')[1] ? a.appointment_date.split('T')[1].slice(0,5) : '') : '',
                    area: a.appointment_area || '',
                    status: a.appointment_status || 'Pendiente',
                    appointment_id: a.appointment_id || null,
                    employee_id: a.employee_id || null
                };
                this.isEditing = true;
                this.showModal = true;
            } catch (e) {
                Swal.fire({ icon: 'error', title: 'Error', text: 'Error al obtener la cita' });
            }
        },
        openModal() {
            this.isEditing = false;
            this.currentAppointment = {
                id: null,
                name: '',
                lastName: '',
                idCard: '',
                age: '',
                sexology: '',
                phoneNumber: '',
                doctor: '',
                date: '',
                time: '',
                area: '',
                status: 'Pendiente'
            };
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.isEditing = false;
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
/* Centrado y card visual para la tabla de appointmentes */
.appointment-table-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 70vh;
    width: 100%;
}

.appointment-table-card {
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

.appointment-table {
    width: 100%;
    background: #f8fafc;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border-collapse: separate;
    border-spacing: 0;
}
.appointment-table th, .appointment-table td {
    padding: 14px 12px;
    text-align: left;
}
.appointment-table th {
    background: #e0e7ef;
    font-weight: 700;
    color: #2563eb;
    border-bottom: 2px solid #d1d5db;
}
.appointment-table tr {
    transition: background 0.15s;
}
.appointment-table tr:hover {
    background: #e8f0fe;
}
.appointment-table td {
    font-size: 1.05rem;
    color: #222;
}

@media (max-width: 900px) {
    .appointment-table-card {
        padding: 18px 4px;
        max-width: 98vw;
    }
    .appointment-table th, .appointment-table td {
        padding: 10px 6px;
        font-size: 0.98rem;
    }
}

@media (max-width: 600px) {
    .appointment-table-card {
        padding: 8px 0;
        min-width: 0;
    }
    .appointment-table th, .appointment-table td {
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