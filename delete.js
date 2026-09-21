const ids = [55805, 55827, 55819, 55824, 55820, 55821, 55825, 55822, 55826, 55823, 55818];

ids.forEach(async e => {
    const res = await fetch("https://hapi.fhir.org/baseR4/Patient/"+e+'/$expunge', {
        method: "POST",
        headers: {
            "Content-Type": "application/fhir+json",
        },
        body: JSON.stringify({
            "resourceType": "Parameters",
            "parameter": [
                {
                "name": "limit",
                "valueInteger": 1
                },
                {
                "name": "expungeDeletedResources",
                "valueBoolean": true
                },
                {
                "name": "expungePreviousVersions",
                "valueBoolean": false
                },
                {
                "name": "expungeEverything",
                "valueBoolean": true
                }
            ]
        })
    })
    console.log(res.status, e);
})