import { FHIR } from "./src/fhir.js";
import { XLSX } from "./src/parser.js";
import fs from "fs/promises";

export async function runPatientFlow(fhirDataInput) {
  const source = fhirDataInput ?? (() => {
    const parsed = XLSX.ParseXLSX(process.argv);
    const json = XLSX.JSONify(parsed);
    return json.result.map((e) => FHIR.convertToFHIR(e));
  })();

  await fs.writeFile("./output.json", JSON.stringify(source, null, 2));
  
  // POST Patient
  const ids = await Promise.all(
    source.map((patient) => FHIR.createPatient(patient))
  );
    
  console.log("IDs:", ids);
  
  // Get Patient
  const result = await Promise.all(
    ids.map((id) => FHIR.getPatient(id))
  );
  
  await fs.writeFile("./result.json", JSON.stringify({ ids, result }, null, 2));
  return result;
}

// Run Process
if (process.argv[1]?.endsWith("main.js")) {
  await runPatientFlow();
}
