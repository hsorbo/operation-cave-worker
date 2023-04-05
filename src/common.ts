export enum ImportType {
    Mnemo = "Mnemo",
    Dmp = "Dmp",
}
export interface Import {
    id: number;
    date: Date;
    type: ImportType;
    data: Array<number>;
}


export class SurveyStorage {
    public static getImports(): Array<Import> {
        const s = window.localStorage.getItem(`RAW_IMPORTS`);
        return s === null ? [] : JSON.parse(s);
    }


    public static addImport(imp: Import): void {
        const updated = this.getImports().push(imp);
        window.localStorage.setItem(`RAW_IMPORTS`, JSON.stringify(updated));
    }

    public static addImportData(type: ImportType, data: Array<number>): Import {
        const imports = this.getImports();
        console.log(imports);
        const newImport: Import = {
            id: imports.map(x => x.id).reduce((a, b) => Math.max(a, b), 0) + 1,
            date: new Date(),
            type,
            data,
        }
        imports.push(newImport);
        window.localStorage.setItem(`RAW_IMPORTS`, JSON.stringify(imports));
        return newImport;
    }
}