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


function* readAllFiles(pathDire) {
    let res = fs.readdirSync(pathDire);
    for (let i = 0, n = res.length; i < n; i++) {
        let newPath = path.join(pathDire, res[i]);
        yield newPath;
        let stat = fs.lstatSync(newPath);
        if (stat && stat.isDirectory()) {
            yield* readAllFiles(newPath);
        }
    }
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
    const allFilesName = [...readAllFiles(dir)];

    const filtered = allFilesName
        .filter((item) => {
            return filterByExtension(item) && filterByType(item) && filterBytes(item);
        });

    filtered.forEach((item) => {
        console.log(item);
    })

}


crawler(customParams['--DIR']);





