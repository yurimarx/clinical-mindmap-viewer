 [![Gitter](https://img.shields.io/badge/Available%20on-Intersystems%20Open%20Exchange-00b2a9.svg)](https://openexchange.intersystems.com/package/clinical-mindmap-viewer)

# clinical-mindmap-viewer
This is a Clinical Viewer as a mindmap

## Installation 

### IPM

Open IRIS for Health installation with IPM client installed. Call in any namespace:

```
USER>zpm "install clinical-mindmap-viewer"
```

This will install FHIR server in FHIRSERVER namespace.

Or call the following for installing programmatically:
```
set sc=$zpm("install clinical-mindmap-viewer")
```

### Docker (e.g. for dev purposes)

Clone/git pull the repo into any local directory

```
$ git clone https://github.com/yurimarx/clinical-mindmap-viewer.git
```

Open the terminal in this directory and run:

```
$ docker-compose up -d
```

## View the patients as mindmap

Go to http://localhost:32783/mindmap/index.html

## Articles about it

https://community.intersystems.com/post/mind-map-your-fhir-patient-data

## Videos about it

https://youtu.be/Yyw8iCRq-Hg

## Patient data
This app goes with 5 preloaded patents in [/data/fhir](https://github.com/intersystems-community/iris-fhir-server-template/tree/master/data/fhir) folder which are being loaded during [docker build](https://github.com/intersystems-community/iris-fhir-server-template/blob/8bd2932b34468f14530a53d3ab5125f9077696bb/iris.script#L26)
You can generate more patients doing the following. Open shel terminal in repository folder and call:
```
#./synthea-loader.sh 10
```
this will create 10 more patients in data/fhir folder.
Then open IRIS terminal in FHIRSERVER namespace with the following command:
```
docker-compose exec iris iris session iris -U FHIRServer
```
and call the loader method:
```
FHIRSERVER>d ##class(fhirtemplate.Setup).LoadPatientData("/irisdev/app/output/fhir","FHIRSERVER","/fhir/r4")
```

 with using the [following project](https://github.com/intersystems-community/irisdemo-base-synthea)

## Testing FHIR R4 API

Open URL http://localhost:32783/fhir/r4/metadata
you should see the output of fhir resources on this server

## Testing Postman calls
Get fhir resources metadata
GET call for http://localhost:32783/fhir/r4/metadata
<img width="881" alt="Screenshot 2020-08-07 at 17 42 04" src="https://user-images.githubusercontent.com/2781759/89657453-c7cdac00-d8d5-11ea-8fed-71fa8447cc45.png">


Open Postman and make a GET call for the preloaded Patient:
http://localhost:32783/fhir/r4/Patient/1
<img width="884" alt="Screenshot 2020-08-07 at 17 42 26" src="https://user-images.githubusercontent.com/2781759/89657252-71606d80-d8d5-11ea-957f-041dbceffdc8.png">


## Testing FHIR API calls in simple frontend APP

the very basic frontend app with search and get calls to Patient and Observation FHIR resources could be found here:
http://localhost:32783/fhirUI/FHIRAppDemo.html
or from VSCode ObjectScript menu:
<img width="616" alt="Screenshot 2020-08-07 at 17 34 49" src="https://user-images.githubusercontent.com/2781759/89657546-ea5fc500-d8d5-11ea-97ed-6fbbf84da655.png">

While open the page you will see search result for female anemic patients and graphs a selected patient's hemoglobin values:
<img width="484" alt="Screenshot 2020-08-06 at 18 51 22" src="https://user-images.githubusercontent.com/2781759/89657718-2b57d980-d8d6-11ea-800f-d09dfb48f8bc.png">


## Development Resources
[InterSystems IRIS FHIR Documentation](https://docs.intersystems.com/irisforhealth20203/csp/docbook/Doc.View.cls?KEY=HXFHIR)
[FHIR API](http://hl7.org/fhir/resourcelist.html)
[Developer Community FHIR section](https://community.intersystems.com/tags/fhir)
