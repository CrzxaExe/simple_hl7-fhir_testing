class FHIR {

    /**
     * Convert to FHIR data
     * @param {{
     *      pin_lokal: string;
     *      nama_lengkap: string;
     *      nik: string;
     *      tgl_lahir: string;
     *      gender: "P" | "L"
     *      alamat: string;
     *      no_telepon: string;
     *      cin_kunjungan: string;
     * }} data 
     */
    static convertToFHIR(data) {
        return {
            resourceType: "Patient",
            identifier: [
                {
                    system: "https://test-rs/identifier",
                    value: data.pin_lokal,
                },
                {
                    use: "official",
                    system: "http://dukcapil.kemendagri.go.id/nik",
                    value: data.nik
                }
            ],
            name: [{
                    use: "official",
                    text: data.nama_lengkap
            }],
            gender: data.gender === "L" ? "male" : data.gender === "P" ? "female" : "none",
            birthDate: data.tgl_lahir,
            telecom: [{
                    system: "phone",
                    value: data.no_telepon,
                    use: "mobile"
            }],
            address: [{
                    text: data.alamat
            }]
        };
    }

    /**
     * Create Patient
     * @param {Object} patient 
     * @returns {Promise<string | undefined>}string | undefined
     */
    static async createPatient(patient) {
        try {
            const req = await fetch("https://hapi.fhir.org/baseR4/Patient/", {
                headers: {
                    "Content-Type": "application/fhir+json"
                },
                method: "POST",
                body: JSON.stringify(patient),
            });
            
            const json = await req.json();
            if([200, 201].includes(req.status) || json.id) return json.id;
            return;
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Get Patient
     * @param {string | undefined} id 
     * @returns {Promise<Patient | undefined>} Patient
     */
    static async getPatient(id) {
        if(!id || id.length < 1) return undefined;

        const response = await fetch(`https://hapi.fhir.org/baseR4/Patient/${id}`, {
            method: "GET",
            headers: {
                "Accept": "application/fhir+json"
            }
        });

        const patient = await response.json();

        return patient;
    }
}

export { FHIR }