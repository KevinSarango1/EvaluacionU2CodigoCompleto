import { Patient, ClinicalHistory } from '../types/patient';

const STORAGE_KEY = 'patients';

type PatientObserver = (patients: Patient[]) => void;
const observers: PatientObserver[] = [];

export const patientService = {
  // Observer Pattern - Métodos de suscripción
  subscribe: (observer: PatientObserver): (() => void) => {
    observers.push(observer);
    return () => {
      const index = observers.indexOf(observer);
      if (index > -1) observers.splice(index, 1);
    };
  },

  notify: (): void => {
    const patients = patientService.getAllPatients();
    observers.forEach(observer => observer(patients));
  },

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
    patientService.notify();
    return newPatient;
  },

  updatePatient: (id: string, updates: Partial<Patient>): Patient | null => {
    const patients = patientService.getAllPatients();
    const index = patients.findIndex(p => p.id === id);
    if (index === -1) return null;
    patients[index] = { ...patients[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    patientService.notify();
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

  deletePatient: (id: string): boolean => {
    const patients = patientService.getAllPatients();
    const index = patients.findIndex(p => p.id === id);
    if (index === -1) return false;
    patients.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    patientService.notify();
    return true;
  },
};
