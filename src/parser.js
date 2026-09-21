import * as xlsx from "xlsx";

class XLSX {

    /**
     * Parse XLSX to Array
     * @param {string[]} argv 
     * @returns string[]
    */
    static ParseXLSX(argv) {
       // Options
       const [filename, withHeader, headerSize, ..._] = [...argv].slice(2);
       const withinHeader = withHeader === "true";
       
       let headerSizes = (parseInt(headerSize) ?? 1);
       
       // Sheet Loader
       const file = xlsx.readFile(filename);
       const worksheet = file.Sheets[file.SheetNames];
       
       // Sheet Parser
       const parsed = xlsx.utils.sheet_to_json(worksheet, { header: 1 }).flat(2);
       return parsed.slice(withinHeader ? headerSizes : 0);
    }
    
    /**
     * Array string to Object
     * @param {string[]} arr 
     * return { keys: string[], result: {} }
    */
   static JSONify (arr) {
       const [header, ...content] = arr;
       const keys = header.split(/\|/g);
       
       const result = content.map(data => {
           const items = data.split(/\|/g);
           
           const res = keys.reduce((all, cur, i) => {
               all[(cur.toLowerCase()).replace(/ /g, "_")] = items[i];
               if(cur === "PIN_LOKAL") all[(cur.toLowerCase()).replace(/ /g, "_")] = items[i]+"3";
               
               return all;
            }, {});
            
            return res;
        })
        
        return { keys, result };
    }
}

export { XLSX }