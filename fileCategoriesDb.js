const fs = require("fs").promises;

const fileName = "./categoriesDb.json";

let data = [];

module.exports = {
    async init() {
        try {
            const content = await fs.readFile(fileName, "utf-8");
            data = JSON.parse(content);

        } catch (error) {
            data = [];
        }
    },
    getItems() {
        return data;
    },
    async addItem(category) {
        data.push(category);
        await this.save();
    },
    async save() {
        await fs.writeFile(fileName, JSON.stringify(data, null, 2));
    },
    async deleteItem(id) {
        const index = data.findIndex(item=>  item.id === id)
        if(index === -1) {
            return false; 
        }
        data.splice(index, 1);
        await this.save();
        return true;
    },
};


