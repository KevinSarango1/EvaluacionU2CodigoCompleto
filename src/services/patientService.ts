import { Patient, ClinicalHistory } from '../types/patient';

const STORAGE_KEY = 'patients';

export const patientService = {
  getAllPatients: (): Patient[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getPatientById: (id: string): Patient | null => {
    const patients = patientService.getAllPatients();
    return patients.find(p => p.id === id) || null;
  },

  createPatient: (patient: Omit<Patient, 'id'>): Patient => {
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
    };
    const patients = patientService.getAllPatients();
    patients.push(newPatient);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    return newPatient;
  },

  updatePatient: (id: string, updates: Partial<Patient>): Patient | null => {
    const patients = patientService.getAllPatients();
    const index = patients.findIndex(p => p.id === id);
    if (index === -1) return null;
    patients[index] = { ...patients[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    return patients[index];
  },

  updateClinicalHistory: (patientId: string, history: ClinicalHistory): Patient | null => {
    return patientService.updatePatient(patientId, {
      clinicalHistory: { ...history, updatedAt: new Date().toISOString() }
    });
  },

  emailExists: (email: string): boolean => {
    const patients = patientService.getAllPatients();
    return patients.some(p => p.email.toLowerCase() === email.toLowerCase());
  },
};
