import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { AllergyIntolerance, Bundle, Condition, Encounter, Immunization, MedicationAdministration, MedicationDispense, MedicationRequest, MedicationStatement, Observation, Patient, Procedure } from 'fhir/r4';
@Injectable({
    providedIn: 'root',
})
export class FhirService {

    // Base url
    //baseurl = 'http://localhost:32783/fhir/r4';

    baseurl = 'http://' + location.hostname + ':' + location.port + '/fhir/r4';


    constructor(private http: HttpClient) { }

    // Http Headers
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    };

    getAllPatients(): Observable<Bundle<Patient>> {
        return this.http
            .get<Bundle<Patient>>(`${this.baseurl}/Patient`)
            .pipe(retry(1), catchError(this.errorHandl));
    }


    getPatientById(patientId: number): Observable<Patient> {
        return this.http
            .get<Patient>(`${this.baseurl}/Patient/${patientId}`)
            .pipe(retry(1), catchError(this.errorHandl));
    }

    getPatientByUrl(url: string): Observable<Patient> {
        return this.http
            .get<Patient>(url)
            .pipe(retry(1), catchError(this.errorHandl));
    }

    getAllEncounters(patientId: number): Observable<Bundle<Encounter>> {
        return this.http
            .get<Bundle<Encounter>>(`${this.baseurl}/Encounter?patient=${patientId}`)
            .pipe(retry(1), catchError(this.errorHandl));
    }

    getAllProcedures(patientId: number): Observable<Bundle<Procedure>> {
        return this.http
            .get<Bundle<Procedure>>(`${this.baseurl}/Procedure?patient=${patientId}`)
            .pipe(retry(1), catchError(this.errorHandl));
    }

    getAllMedicationRequests(patientId: number): Observable<Bundle<MedicationRequest>> {
        return this.http
            .get<Bundle<MedicationRequest>>(`${this.baseurl}/MedicationRequest?patient=${patientId}`)
            .pipe(retry(1), catchError(this.errorHandl));
    }

    getAllMedicationDispenses(patientId: number): Observable<Bundle<MedicationDispense>> {
        return this.http
            .get<Bundle<MedicationDispense>>(`${this.baseurl}/MedicationDispense?patient=${patientId}`)
            .pipe(retry(1), catchError(this.errorHandl));
    }

    getAllMedicationAdministrations(patientId: number): Observable<Bundle<MedicationAdministration>> {
        return this.http
            .get<Bundle<MedicationAdministration>>(`${this.baseurl}/MedicationAdministration?patient=${patientId}`)
            .pipe(retry(1), catchError(this.errorHandl));
    }

    getAllMedicationStatements(patientId: number): Observable<Bundle<MedicationStatement>> {
        return this.http
            .get<Bundle<MedicationStatement>>(`${this.baseurl}/MedicationStatement?patient=${patientId}`)
            .pipe(retry(1), catchError(this.errorHandl));
    }

    getAllAllergies(patientId: number): Observable<Bundle<AllergyIntolerance>> {
        return this.http
            .get<Bundle<AllergyIntolerance>>(`${this.baseurl}/AllergyIntolerance?patient=${patientId}`)
            .pipe(retry(1), catchError(this.errorHandl));
    }

    getAllImmunizations(patientId: number): Observable<Bundle<Immunization>> {
        return this.http
            .get<Bundle<Immunization>>(`${this.baseurl}/Immunization?patient=${patientId}`)
            .pipe(retry(1), catchError(this.errorHandl));
    }

    getAllConditions(patientId: number): Observable<Bundle<Condition>> {
        return this.http
            .get<Bundle<Condition>>(`${this.baseurl}/Condition?patient=${patientId}`)
            .pipe(retry(1), catchError(this.errorHandl));
    }

    getAllObservations(patientId: number): Observable<Bundle<Observation>> {
        return this.http
            .get<Bundle<Observation>>(`${this.baseurl}/Observation?patient=${patientId}`)
            .pipe(retry(1), catchError(this.errorHandl));
    }
    
    // Error handling
    errorHandl(error: any) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(() => {
            return errorMessage;
        });
    }
}