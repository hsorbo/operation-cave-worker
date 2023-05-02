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

export interface SurveyComments {
    importId: number;
    surveyId: number;
    comments: string[];
}
interface Storage {
    imports: Array<Import>;
    comments: Array<SurveyComments>;
}

export class SurveyStorage {
    static zero(): Storage {
        return { imports: [], comments: [] };
    }

    static read(): Storage {
        const s = window.localStorage.getItem(`STORAGE`);
        return s === null ? this.zero() : JSON.parse(s);
    }
    static write(storage: Storage) {
        window.localStorage.setItem(`STORAGE`, JSON.stringify(storage));
    }

    public static getImports(): Array<Import> {
        return this.read().imports;
    }

    public static addImport(imp: Import): void {
        const storage = this.read();
        storage.imports.push(imp);
        this.write(storage);
    }

    public static addImportData(type: ImportType, data: Array<number>): Import {
        const storage = this.read();
        const newImport: Import = {
            id: storage.imports.map(x => x.id).reduce((a, b) => Math.max(a, b), 0) + 1,
            date: new Date(),
            type,
            data,
        }
        storage.imports.push(newImport);
        this.write(storage);
        return newImport;
    }

    
    static filterComments(comments: SurveyComments[], importId: number, surveyId: number) {
        return comments
            .filter(x => x.importId === importId)
            .filter(x => x.surveyId === surveyId)
            .flatMap(x => x.comments)
    }

    public static getComments(importId: number, surveyId: number) {
        const storage = this.read();
        return this.filterComments(storage.comments, importId, surveyId);
    }

    public static setComments(importId: number, surveyId: number, comments: string[]) {
        console.log(`setComments importId=${importId} surveyId=${surveyId} comments=${comments}`);
        const storage = this.read();
        
        console.log(storage.comments);
        storage.comments = storage.comments.filter(x => !(x.importId === importId && x.surveyId === surveyId));
        console.log(storage.comments);
        storage.comments.push({ importId, surveyId, comments });
        this.write(storage);
    }
}