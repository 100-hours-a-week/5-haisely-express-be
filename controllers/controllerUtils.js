const fs = require('fs');

const loadData = (dataFilePath) => {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading file:', err);
        return null;
    }
}

const saveData = (data, filePath) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log('Data saved successfully');
    } catch (err) {
        console.error('Error saving file:', err);
    }
}

const makeRes = (statusNum, message, data) => {
    return {
        "status" : statusNum,
        "message" : message,
        "data" : data
    }
}

const getTimeNow = () => {
    const now = new Date();
    return now.toLocaleString();
}

module.exports = {
    loadData,
    saveData,
    makeRes,
    getTimeNow
}