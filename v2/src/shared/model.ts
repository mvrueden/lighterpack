export type Unit = 'oz' | 'g'
export type Weight = {
    unit: Unit;
    value: number
}
export type Price = {
    value: number,
    currency: string
}

export class Item {
    id: number
    name = ''
    description = ''
    weight: Weight = {
        value: 0,
        unit: 'g'
    }
    price: number = 0
    image = ''
    imageUrl = ''
    url = ''
    qty = 1
    worn = false
    consumable = false
    star = 0
    isNew = false

    constructor(id: number, unit?: Unit) {
        this.id = id;
        if (unit) {
            this.weight.unit = unit;
        }
    }
}

export class Category {
    id: number
    name = ''
    items: Item[] = []
    subtotalWeight = 0
    subtotalWornWeight = 0
    subtotalConsumableWeight = 0
    subtotalPrice = 0
    subtotalConsumablePrice = 0
    subtotalQty = 0
    isNew: boolean

    constructor(id: number, isNew: boolean) {
        this.id = id;
        this.isNew = isNew;
    }

    addItem(partialCategoryItem: Item) {
        this.items.push(partialCategoryItem)
    }

    updateItem(item: Item) {
        const currentItem = this.getCategoryItemById(item.id);
        if (currentItem) {
            Object.assign(currentItem, item);
        }
    }

    removeItem(item: Item) {
        const categoryItem = this.getCategoryItemById(item.id);
        if (categoryItem) {
            const index = this.items.indexOf(categoryItem);
            this.items.splice(index, 1);
        }
    }

    calculateSubtotals() {
        this.subtotalWeight = 0;
        this.subtotalWornWeight = 0;
        this.subtotalConsumableWeight = 0;
        this.subtotalPrice = 0;
        this.subtotalConsumablePrice = 0;
        this.subtotalQty = 0;
        this.items.forEach(item => {
            this.subtotalWeight += item.weight.value * item.qty;
            this.subtotalPrice += item.price * item.qty;
            if (item.worn) {
                // TODO MVR always store internally as g and convert back and forth :D
                this.subtotalWornWeight += item.weight.value * (item.qty > 0 ? 1 : 0)
            }
            if (item.consumable) {
                this.subtotalConsumableWeight += item.weight.value * item.qty;
                this.subtotalConsumablePrice += item.price * item.qty;
            }
            this.subtotalQty += item.qty;

        })
    }

    private getCategoryItemById(id: number): Item | undefined {
        return this.items.find(it => it.id == id);
    }

}

export class List {
    categories: Category[] = [];

    addCategory(category: Category) {
        this.categories.push(category);
    }

    calculateSubtotals() {
        this.categories.forEach(it => it.calculateSubtotals())
    }
}

export class Library {

}