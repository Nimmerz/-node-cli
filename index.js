#!/usr/bin/env node


const fs = require('fs');
const path = require('path');

const nodeParams = process.argv.slice(2);

const customParams = nodeParams.reduce((accParams, currentParams) => {
    const [type, value] = currentParams.split('=');
    return {
        ...accParams,
        [type]: value
    }
}, {});
console.log(customParams);


function readAllFiles(dir) {
    let files = fs.readdirSync(dir);
    let allFilesName = [];
    for (let x in files) {
        let next = path.join(dir, files[x]);
        if (fs.lstatSync(next).isDirectory()) {
            allFilesName.push({dir, fileName: files[x]})
            allFilesName = allFilesName.concat(readAllFiles(next));
        }
        else {
            allFilesName.push({dir, fileName: files[x]})
        }
    }
    return allFilesName
}


function filterByExtension(item) {
    const extensionParam = customParams['--PATTERN'];
    if (!extensionParam) {
        return true

    }
    return item.includes(extensionParam)
}


function filterByType(item) {
    const typeParams = customParams['--TYPE'];

    if (!typeParams) {
        return true
    }

    const stats = fs.statSync(item);

    if (typeParams === 'D') {
        return stats.isDirectory()
    }
    return stats.isFile()
}


const parseSizeToBytes = sizeStr => {
    const value = parseInt(sizeStr);
    switch (sizeStr.slice(-1)) {
        case 'B':
            return value;
        case 'K':
            return value * 2 ** 10;
        case 'M':
            return value * 2 ** 20;
        case 'G':
            return value * 2 ** 30;
    }
};

function filterBytes(item) {
    const typeBytesMin = customParams['--MIN-SIZE'];
    const typeBytesMax = customParams['--MAX-SIZE'];
    const stats = fs.statSync(item);

    if ((!typeBytesMin || parseSizeToBytes(typeBytesMin) < stats['size']) &&
        (!typeBytesMax || parseSizeToBytes(typeBytesMax) > stats['size'])) {
        return true;
    }

    return false;

}


function crawler(dir) {
    const allFilesName = readAllFiles(dir);

    const filtered = allFilesName
        .filter(({fileName, dir} = {}) => {
            const pathItem = path.join(dir, fileName);
            return filterByExtension(fileName) && filterByType(pathItem) && filterBytes(pathItem);
        });

    filtered.forEach(({fileName, dir} = {}) => {
        console.log(path.join(dir, fileName))
    })

}


crawler(customParams['--DIR']);





