export interface IProduct {
    id: string;
    name: string;
    parents: Parents;
    size: string;

}

interface Parents {
    subline: string;
    line: string;
    department: string;
}