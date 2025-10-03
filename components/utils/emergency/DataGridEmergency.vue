<template>
  <div class="emergency-table-wrapper">
    <div class="emergency-table-card">
      <div class="grid-view">
        <input
          type="text"
          class="form-control mb-3"
          placeholder="Buscar por paciente, médico, detalles..."
          v-model="searchQuery"
        />
        <button
          class="btn btn-primary icon-btn add-btn"
          @click="openModal()"
          title="Agregar Emergencia"
        >
          <svg-add-circle/>
        </button>
      </div>

      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h2 class="modal-title">
            {{ isEditing ? "Editar" : "Agregar" }} Emergencia
          </h2>
          <form @submit.prevent="saveEmergency">
            <div class="form-row">
              <div class="form-group">
                <label for="date">Fecha</label>
                <input
                  type="date"
                  id="date"
                  v-model="form.date"
                  required
                  class="form-control"
                />
              </div>
              <div class="form-group">
                <label for="time">Hora</label>
                <input
                  type="time"
                  id="time"
                  v-model="form.time"
                  required
                  class="form-control"
                />
              </div>
            </div>
            <div class="section-title">Paciente</div>
            <div class="form-row">
              <div class="form-group">
                <label for="emergency">Nombres*</label>
                <input
                  type="text"
                  id="emergency"
                  v-model="form.emergency"
                  required
                  class="form-control"
                />
              </div>
              <div class="form-group">
                <label for="lastName">Apellidos*</label>
                <input
                  type="text"
                  id="lastName"
                  v-model="form.lastName"
                  required
                  class="form-control"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="cedula">Cédula*</label>
                <input
                  type="text"
                  id="cedula"
                  v-model="form.cedula"
                  required
                  class="form-control"
                />
              </div>
              <div class="form-group">
                <label for="age">Edad</label>
                <input
                  type="number"
                  id="age"
                  v-model="form.age"
                  class="form-control"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="gender">Sexo</label>
                <input
                  type="text"
                  id="gender"
                  v-model="form.gender"
                  class="form-control"
                />
              </div>
              <div class="form-group">
                <label for="phone">Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  v-model="form.phone"
                  class="form-control"
                />
              </div>
            </div>
            <div class="section-title">Datos de la Emergencia</div>
            <div class="form-row">
              <div class="form-group">
                <label for="doctor">Médico</label>
                <input
                  type="text"
                  id="doctor"
                  v-model="form.doctor"
                  class="form-control"
                />
              </div>
              <div class="form-group">
                <label for="details">Detalles</label>
                <input
                  type="text"
                  id="details"
                  v-model="form.details"
                  class="form-control"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="result">Resultado</label>
                <input
                  type="text"
                  id="result"
                  v-model="form.result"
                  class="form-control"
                />
              </div>
            </div>
            <div class="form-group button-group">
              <button
                type="button"
                @click="closeModal"
                class="btn btn-secondary btn-lg icon-btn add-btn"
              >
                <svg-close />
              </button>
              <button
                type="submit"
                class="btn btn-primary btn-lg icon-btn add-btn"
                :title="isEditing ? 'Actualizar emergencia' : 'Guardar emergencia'"
              >
                <svg-add-circle/>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table emergency-table">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Detalles</th>
              <th>Fecha</th>
              <th>Resultado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="emergency in paginatedEmergencies" :key="emergency.id">
              <td>{{ emergency.emergency }}</td>
              <td>{{ emergency.doctor }}</td>
              <td>{{ emergency.details }}</td>
              <td>{{ emergency.date }}</td>
              <td>{{ emergency.result }}</td>
              <td>
                <div class="action-btn-group">
                  <button
                    class="btn btn-info btn-sm icon-btn"
                    @click="openMiniModal(emergency)"
                    title="Ver detalles"
                  >
                    <svg-eye />
                  </button>
                  <button
                    class="btn btn-success btn-sm icon-btn"
                    @click="editEmergency(emergency)"
                    title="Editar emergencia"
                  >
                    <svg-edit/>
                  </button>
                  <button
                    class="btn btn-danger btn-sm icon-btn"
                    @click="deleteEmergency(emergency.id)"
                    title="Eliminar emergencia"
                  >
                    <svg-delete />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mini modal para ver detalles -->
      <div v-if="showMiniModal" class="modal-overlay" @click.self="closeMiniModal">
        <div class="modal-content" style="max-width:340px;">
          <h3 class="modal-title">Detalles de la emergencia</h3>
          <div v-if="miniModalData">
            <div style="margin-bottom:10px;"><b>Paciente:</b> {{ miniModalData.emergency }}</div>
            <div style="margin-bottom:10px;"><b>Médico:</b> {{ miniModalData.doctor }}</div>
            <div style="margin-bottom:10px;"><b>Fecha:</b> {{ miniModalData.date }} {{ miniModalData.time }}</div>
            <div style="margin-bottom:10px;"><b>Detalles:</b> {{ miniModalData.details }}</div>
            <div style="margin-bottom:10px;"><b>Resultado:</b> {{ miniModalData.result }}</div>
          </div>
          <div class="button-group">
            <button class="btn btn-secondary btn-lg icon-btn add-btn" @click="closeMiniModal">
              <svg-close />
            </button>
          </div>
        </div>
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
import api from '~/utils/simpleApi';
export default {
  data() {
    return {
      searchQuery: "",
      emergencies: [],
      showModal: false,
      isEditing: false,
      currentId: null,
      form: {
        date: "",
        time: "",
        emergency: "",
        lastName: "",
        cedula: "",
        age: null,
        gender: "",
        phone: "",
        doctor: "",
        details: "",
        result: "",
      },
      showMiniModal: false,
      miniModalData: null,
      currentPage: 1,
      itemsPerPage: 7,
    };
  },
  async mounted() {
    await this.loadEmergencies();
  },
  computed: {
    paginatedEmergencies() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredEmergencies.slice(start, start + this.itemsPerPage);
    },
    filteredEmergencies() {
      return this.emergencies.filter((emergency) =>
        `${emergency.emergency} ${emergency.doctor} ${emergency.details}`
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredEmergencies.length / this.itemsPerPage) || 1;
    },
  },
  methods: {
    async loadEmergencies() {
      try {
        const response = await api.get("/api/EventDetail");
        // Mapeo robusto desde eventDetails
        this.emergencies = (response?.data?.eventDetails || []).map((item) => {
          const patient = item.event?.medical_history?.Patient;
          const doctor = item.event?.employee?.user;
          return {
            id: item.id,
            emergency: patient ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim() : '',
            doctor: doctor ? `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim() : '',
            details: item.action?.name_actions || '',
            date: item.event?.event_date ? item.event.event_date.split('T')[0] : '',
            time: item.event?.event_date ? item.event.event_date.split('T')[1]?.slice(0,5) : '',
            result: item.event?.results || '',
            raw: item,
          };
        });
      } catch (e) {
        this.emergencies = [];
      }
    },
    openModal() {
      this.resetForm();
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    openMiniModal(emergency) {
      this.miniModalData = emergency;
      this.showMiniModal = true;
    },
    closeMiniModal() {
      this.showMiniModal = false;
      this.miniModalData = null;
    },
    saveEmergency() {
      // Aquí iría la lógica para guardar en la API si se requiere
      const mapFormToEmergency = (form, id) => {
        return {
          id: id,
          emergency: `${form.emergency || ''} ${form.lastName || ''}`.trim(),
          doctor: form.doctor || '',
          details: form.details || '',
          date: form.date || '',
          time: form.time || '',
          result: form.result || '',
          raw: { ...form },
        };
      };
      if (this.isEditing) {
        const index = this.emergencies.findIndex((e) => e.id === this.currentId);
        if (index !== -1)
          this.emergencies.splice(index, 1, mapFormToEmergency(this.form, this.currentId));
      } else {
        this.emergencies.push(mapFormToEmergency(this.form, Date.now()));
      }
      this.closeModal();
    },
    editEmergency(emergency) {
      // Si el registro viene de la API, reconstruye el form desde raw
      if (emergency.raw) {
        const patient = emergency.raw.event?.medical_history?.Patient;
        this.form = {
          date: emergency.date,
          time: emergency.time,
          emergency: patient?.firstName || '',
          lastName: patient?.lastName || '',
          cedula: patient?.identifier || '',
          age: patient?.birthDate ? new Date().getFullYear() - new Date(patient.birthDate).getFullYear() : '',
          gender: patient?.gender || '',
          phone: emergency.raw.event?.employee?.phone_number || '',
          doctor: emergency.doctor,
          details: emergency.details,
          result: emergency.result,
        };
      } else {
        this.form = { ...emergency };
      }
      this.currentId = emergency.id;
      this.isEditing = true;
      this.showModal = true;
    },
    deleteEmergency(id) {
      this.emergencies = this.emergencies.filter((e) => e.id !== id);
    },
    resetForm() {
      this.form = {
        date: "",
        time: "",
        emergency: "",
        lastName: "",
        cedula: "",
        age: null,
        gender: "",
        phone: "",
        doctor: "",
        details: "",
        result: "",
      };
      this.isEditing = false;
      this.currentId = null;
    },
  },
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
.emergency-table-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 70vh;
    width: 100%;
}

.emergency-table-card {
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

.emergency-table {
    width: 100%;
    background: #f8fafc;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border-collapse: separate;
    border-spacing: 0;
}
.emergency-table th, .emergency-table td {
    padding: 14px 12px;
    text-align: left;
}
.emergency-table th {
    background: #e0e7ef;
    font-weight: 700;
    color: #2563eb;
    border-bottom: 2px solid #d1d5db;
}
.emergency-table tr {
    transition: background 0.15s;
}
.emergency-table tr:hover {
    background: #e8f0fe;
}
.emergency-table td {
    font-size: 1.05rem;
    color: #222;
}

@media (max-width: 900px) {
    .emergency-table-card {
        padding: 18px 4px;
        max-width: 98vw;
    }
    .emergency-table th, .emergency-table td {
        padding: 10px 6px;
        font-size: 0.98rem;
    }
}

@media (max-width: 600px) {
    .emergency-table-card {
        padding: 8px 0;
        min-width: 0;
    }
    .emergency-table th, .emergency-table td {
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