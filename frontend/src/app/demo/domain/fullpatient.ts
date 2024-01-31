import { Encounter, Patient } from "fhir/r4";

export class FullPatient {
    patient: Patient;
    encounters: Encounter[];
}