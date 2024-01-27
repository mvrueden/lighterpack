import Papa from "papaparse";

export type CsvRow = {
    item: string
    category: string,
    description: string,
    qty: number,
    weight: number
    unit: 'g' | 'oz',
    price: number
    worn: boolean
    consumable: boolean,
    url: string
}

export class CsvService {
    constructor() {

    }

    parse(csvAsString: string): CsvRow[] {
        const result = Papa.parse(csvAsString, {
            header: true,
            skipEmptyLines: true,
        });
        if (result.errors?.length > 0) {
            throw new Error("Error while parsing csv. Bailing"); // TODO MVR
        }
        return result.data.map((row:any) => {
            return {
                item: row["Item Name"],
                category: row["Category"],
                description: row["desc"],
                qty: parseInt(row["qty"]),
                weight: parseFloat(row["weight"]),
                unit: row['unit'] === 'gram' ? 'g' : 'oz',
                price: parseFloat(row["price"]),
                worn: row['worn'] === 'Worn',
                consumable: row["consumable"] === 'Consumable',
                url: row["url"]
            } as CsvRow
        })
    }
}

