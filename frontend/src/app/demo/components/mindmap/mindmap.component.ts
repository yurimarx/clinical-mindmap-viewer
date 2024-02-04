import { Component, OnInit, ViewEncapsulation, Renderer2, AfterViewInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import MindElixir from "mind-elixir";
import painter from 'mind-elixir/dist/painter';
import { AllergyIntolerance, BundleEntry, Condition, Encounter, Immunization, MedicationAdministration, MedicationDispense, MedicationRequest, MedicationStatement, Observation, Patient, Procedure } from 'fhir/r4';
import { v4 as uuidv4 } from 'uuid';
import { FhirService } from '../../service/fhir.service';
import { HttpClient } from '@angular/common/http';

@Component({
    providers: [MessageService],
    templateUrl: './mindmap.component.html'
})

export class MindmapComponent implements OnInit {

    patients: BundleEntry<Patient>[] = [];

    encounters: BundleEntry<Encounter>[] = [];

    procedures: BundleEntry<Procedure>[] = [];

    medications: BundleEntry<MedicationRequest>[] = [];

    medicationStatements: BundleEntry<MedicationStatement>[] = [];

    allergies: BundleEntry<AllergyIntolerance>[] = [];

    immunizations: BundleEntry<Immunization>[] = [];

    conditions: BundleEntry<Condition>[] = [];

    observations: BundleEntry<Observation>[] = [];

    medicationDispenses: BundleEntry<MedicationDispense>[] = [];

    medicationAdministrations: BundleEntry<MedicationAdministration>[] = [];

    patient: Patient = { "resourceType": "Patient" };

    selectedPatients: Patient[] = [];

    patientCols: any[] = [];

    display: boolean = false;

    public ME = new MindElixir({
        el: "#map",
        direction: MindElixir.LEFT,
        data: MindElixir.new("Select a patient"),
        draggable: true, // default true
        contextMenu: true, // default true
        toolBar: true, // default true
        nodeMenu: true, // default true
        keypress: true // default true
    });

    constructor(
        private fhirService: FhirService,
        private http: HttpClient,
        private messageService: MessageService) {
    }

    ngOnInit() {
        this.fhirService.getAllPatients().subscribe(data => this.patients = data.entry!);

        this.patientCols = [
            { field: 'resource.identifier.2.value', header: 'Number' },
            { field: 'resource.birthDate', header: 'Birth Date' },
            { field: 'resource.gender', header: 'Gender' },
            { field: 'patient.resource.name[0].given[0]', header: 'Name' },
            { field: 'patient.resource.name[0].family[0]', header: 'Family Name' }
        ];

        this.ME = new MindElixir({
            el: "#map",
            direction: MindElixir.LEFT,
            data: MindElixir.new("Select a new patient"),
            draggable: true, // default true
            contextMenu: true, // default true
            toolBar: true, // default true
            nodeMenu: true, // default true
            keypress: true // default true
        });
        this.ME.init(MindElixir.new("new topic"));

    }

    getMindmapOptions() {
        return (
            {
                el: '#map',
                direction: MindElixir.SIDE,
                data: this.patient == null ? MindElixir.new('Select a patient') : this.renderExistentMindmap(),
                draggable: true, // default true
                contextMenu: true, // default true
                toolBar: true, // default true
                nodeMenu: true, // default true
                keypress: true, // default true
                contextMenuOption: {
                    focus: true,
                    link: true,
                    extend: [
                        {
                            name: 'Export as PNG Image',
                            onclick: () => {
                                painter.exportPng(this.ME, 'mindmap.png')
                            },
                        },
                        {
                            name: 'Export as SVG Image',
                            onclick: () => {
                                painter.exportSvg(this.ME, 'mindmap')
                            },
                        },
                        {
                            name: 'Export as Markdown',
                            onclick: () => {
                                this.downloadMD('mindmap.md', this.ME.getAllDataMd())
                            },
                        },
                    ],
                },
            });

    }

    exportPNG() {
        painter.exportPng(this.ME, 'mindmap.png')
    }

    exportSVG() {
        painter.exportSvg(this.ME, 'mindmap')
    }

    exportMarkdown() {
        this.downloadMD('mindmap.md', this.ME.getAllDataMd())
    }

    renderExistentMindmap() {

        let root = this.patient;

        let nodeData = {
            id: root.id,
            topic: root.name[0].given[0],
            root: true,
            style: {
                background: 'blue',
                color: 'white',
                fontSize: '30',
            },
            hyperLink: root.link,
            children: []
        }

        let demographicChildren = [
            {
                id: uuidv4(),
                topic: 'Name: ' + root.name[0].given[0]
            },
            {
                id: uuidv4(),
                topic: 'Family: ' + root.name[0].family[0]
            },
            {
                id: uuidv4(),
                topic: 'Gender: ' + root.gender
            },
            {
                id: uuidv4(),
                topic: 'Birth Date: ' + root.birthDate
            },
            {
                id: uuidv4(),
                topic: 'Marital Status: ' + root.maritalStatus.text
            },
            {
                id: uuidv4(),
                topic: 'Race: ' + root.extension[0].extension[0].valueCoding.display
            },
            {
                id: uuidv4(),
                topic: 'Ethnicity: ' + root.extension[1].extension[0].valueCoding.display
            },
            {
                id: uuidv4(),
                topic: 'Mother\'s Maiden Name: ' + root.extension[2].valueString
            },
            {
                id: uuidv4(),
                topic: 'Birth Sex: ' + root.extension[3].valueCode
            },
            {
                id: uuidv4(),
                topic: 'Birth Place: ' + root.extension[4].valueAddress.city + ', ' + root.extension[4].valueAddress.state + ', ' + root.extension[4].valueAddress.country
            },
        ]
        this.createMindItem(nodeData, 'Demographic data', 'purple', 'white', 20, demographicChildren);

        let contactChildren = [
            {
                id: uuidv4(),
                topic: 'Telecom: ' + root.telecom[0].value
            },
            {
                id: uuidv4(),
                topic: 'Address/Zip Code: ' + root.address[0].line + ', ' + root.address[0].postalCode
            },
            {
                id: uuidv4(),
                topic: 'City/State/Country: ' + root.address[0].city + ', ' + root.address[0].state + ', ' + root.address[0].country
            },
        ]

        this.createMindItem(nodeData, 'Contact data', 'orange', 'white', 20, contactChildren);

        let identificationChildren = [
            {
                id: uuidv4(),
                topic: 'MRN: ' + root.identifier[1].value
            },
            {
                id: uuidv4(),
                topic: 'SSN: ' + root.identifier[2].value
            },
            {
                id: uuidv4(),
                topic: 'Driver\'s License: ' + root.identifier[3].value
            },
            {
                id: uuidv4(),
                topic: 'Passport: ' + root.identifier[4].value
            }
        ]

        this.createMindItem(nodeData, 'Identification data', 'green', 'white', 20, identificationChildren);

        let encounterChildren = [];

        this.encounters.map((encounter) => {
            encounterChildren.push({
                id: uuidv4(),
                topic: encounter.resource.type[0].text + ' - ' +  this.formatDateTime(encounter.resource.period.start) + ' to ' + this.formatDateTime(encounter.resource.period.end)
            })
        })

        this.createMindItem(nodeData, 'Encounters', 'red', 'white', 20, encounterChildren);

        let procedureChildren = [];

        this.procedures.map((procedure) => {
            procedureChildren.push({
                id: uuidv4(),
                topic: procedure.resource.code.text + ' - ' +  this.formatDateTime(procedure.resource.performedPeriod.start) + ' to ' + this.formatDateTime(procedure.resource.performedPeriod.end)
            })
        })

        this.createMindItem(nodeData, 'Procedures', 'black', 'white', 20, procedureChildren);

        let medicationChildren = [];

        this.medications.map((medication) => {
            medicationChildren.push({
                id: uuidv4(),
                topic: medication.resource.medicationCodeableConcept.text // + ' - ' +  this.formatDateTime(medication.resource..start) + ' to ' + this.formatDateTime(procedure.resource.performedPeriod.end)
            })
        })

        let immunizationChildren = [];

        this.immunizations.map((immunization) => {
            immunizationChildren.push({
                id: uuidv4(),
                topic: immunization.resource.vaccineCode.text // + ' - ' +  this.formatDateTime(medication.resource..start) + ' to ' + this.formatDateTime(procedure.resource.performedPeriod.end)
            })
        })

        this.createMindItem(nodeData, 'Immunizations', 'grey', 'white', 20, immunizationChildren);

        let conditionChildren = [];

        this.conditions.map((condition) => {
            conditionChildren.push({
                id: uuidv4(),
                topic: condition.resource.code.text // + ' - ' +  this.formatDateTime(medication.resource..start) + ' to ' + this.formatDateTime(procedure.resource.performedPeriod.end)
            })
        })

        this.createMindItem(nodeData, 'Conditions', 'olive', 'white', 20, conditionChildren);

        let observationChildren = [];

        this.observations.map((observation) => {
            observationChildren.push({
                id: uuidv4(),
                topic: observation.resource.code.text // + ' - ' +  this.formatDateTime(medication.resource..start) + ' to ' + this.formatDateTime(procedure.resource.performedPeriod.end)
            })
        })

        this.createMindItem(nodeData, 'Observations', 'teal', 'white', 20, observationChildren);

        return { nodeData } 
    }

    createDemograficData(nodeData, data: Patient) {
        let newNode = {
            id: data.id + 'rootDemografic',
            topic: 'Demographic Data',
            expanded: false,
            root: false,
            style: {
                background: 'purple',
                color: 'white',
                fontSize: 20,
            },
            children: []
        }
        nodeData.children.push(newNode)
    }

    createMindItem(nodeData, text: string, background: string, color: string, fontSize: number, children: any[]) {
        let newNode = {
            id: uuidv4(),
            topic: text,
            expanded: false,
            root: false,
            style: {
                background: background,
                color: color,
                fontSize: fontSize,
            },
            children: children
        }
        nodeData.children.push(newNode)
        return newNode
    }


    downloadMD(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    getRecord(patientId: number) {

        this.fhirService.getPatientById(patientId).subscribe(data => {
            this.patient = data;
            this.getEncounters(patientId);
            this.getProcedures(patientId);
            this.getMedicationRequests(patientId);
            this.getAllergies(patientId);
            this.getImmunizations(patientId);
            this.getConditions(patientId);
            this.getObservations(patientId);
            this.refreshMindmap();
            this.display = false;
        });

    }

    refreshMindmap() {
        this.ME = new MindElixir(this.getMindmapOptions());
        this.ME.init();
    }

    getEncounters(patientId: number) {
        this.fhirService.getAllEncounters(patientId).subscribe(data => {
            this.encounters = data.entry!;
            this.refreshMindmap();
        });
    }

    getProcedures(patientId: number) {
        this.fhirService.getAllProcedures(patientId).subscribe(data => {
            this.procedures = data.entry!;
            this.refreshMindmap();
        });
    }

    getMedicationRequests(patientId: number) {
        this.fhirService.getAllMedicationRequests(patientId).subscribe(data => {
            this.medications = data.entry!;
            this.refreshMindmap();
        });
    }

    getMedicationAdministrations(patientId: number) {
        this.fhirService.getAllMedicationAdministrations(patientId).subscribe(data => {
            this.medicationAdministrations = data.entry!;
            this.refreshMindmap();
        });
    }

    getMedicationDispenses(patientId: number) {
        this.fhirService.getAllMedicationDispenses(patientId).subscribe(data => {
            this.medicationDispenses = data.entry!;
            this.refreshMindmap();
        });
    }

    getMedicationStatements(patientId: number) {
        this.fhirService.getAllMedicationStatements(patientId).subscribe(data => {
            this.medicationStatements = data.entry!;
            this.refreshMindmap();
        });
    }

    getAllergies(patientId: number) {
        this.fhirService.getAllAllergies(patientId).subscribe(data => {
            this.allergies = data.entry!;
            this.refreshMindmap();
        });
    }

    getImmunizations(patientId: number) {
        this.fhirService.getAllImmunizations(patientId).subscribe(data => {
            this.immunizations = data.entry!;
            this.refreshMindmap();
        });
    }

    getConditions(patientId: number) {
        this.fhirService.getAllConditions(patientId).subscribe(data => {
            this.conditions = data.entry!;
            this.refreshMindmap();
        });
    }

    getObservations(patientId: number) {
        this.fhirService.getAllObservations(patientId).subscribe(data => {
            this.observations = data.entry!;
            this.refreshMindmap();
        });
    }

    formatDate(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
    
    formatDateTime(dateStr: string): string {
        const date = new Date(dateStr);
        const formattedDate = this.formatDate(date); // Reuse formatDate function
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${formattedDate} ${hours}:${minutes}:${seconds}`;
    }

}