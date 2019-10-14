const fs = require('fs');
const path = require('path')
const address = process.argv.slice(2);
const newAddress = address[0];
const contentJson = require('./content');
var dir = './converted';
if (fs.existsSync(newAddress)){
fs.writeFile(path.join(newAddress,'tsconfig.json'),JSON.stringify(contentJson),(err)=> {
    if(err) console.log(err)
})

const converter = (address)=> {
    fs.readdirSync(address).map((file)=> {
        

        const relativePath = path.join(address, file);
        const stat = fs.lstatSync(relativePath);
        // if(!stat.isDirectory()&& path.extname(file)== '.ts') {
        //     updateFile(relativePath, 'let', /var/g, (err)=> {
        //         console.log(err)
        //     })
        // }
        let packageJson;
        if(file=='package.json') {
            fs.readFile(relativePath,'utf8',(err, json)=> {
                 packageJson = JSON.parse(json);
                packageJson.dependencies["typescript"] = "latest";
                packageJson.scripts["tsc"] = "tsc";
                if(packageJson.scripts.start !== "tsc && ".concat(packageJson.scripts.start))
                packageJson.scripts["start"] = "tsc && ".concat(packageJson.scripts.start) 
                packageJson.dependencies["@types/node"] = "latest";
                fs.writeFile(relativePath, JSON.stringify(packageJson), (err)=> {
                    if(err) console.log(err)
                })
            })
            
        }
        if(stat.isDirectory() && file!== 'node_modules')
        converter(path.join(address, file));
        if(path.extname(file)=='.js') {
            const newFileName = file.split('.js').join('.ts');
            fs.rename(relativePath,path.join(address, newFileName), (err)=> {
                if(err)
                console.log(err)
                updateFile(path.join(address, newFileName), 'let', /var/g, (err)=> {
                    console.log(err)
                })
            })
        }
        // if(file == 'www') {  
        //     console.log(file);
        //     updateFile(relativePath, '../build/app', /..\/app\//g, (err)=> {
        //         console.log(err)
        //     })
        // }
    })
    
}


// fs.readdirSync(address[0]) //read all files in the svg folder
//    .filter(function (name) {
//        console.log(!name.startsWith('.'))
//     return !name.startsWith('.');
//    }) //let’s hide hidden files
//    .map(function (name) {
//        console.log( path.normalize("".concat(address[0], "/").concat(name)))
//     return path.normalize("".concat(address[0], "/").concat(name));
//    })
converter(newAddress);
}
else console.log('Directory not found');

function updateFile(filename, replacement,regex) {
    return new Promise(function(resolve) {
        fs.readFile(filename, 'utf-8', function(err, data) {
            if (err) {
                throw (err);
            } else {
                    data = data.replace(regex, replacement);
                    data = 'export{}\n'.concat(data);
            }
            fs.writeFile(filename, data, 'utf-8', function(err) {

                if (err) {
                    throw (err);
                } else {
                    resolve();
                }
            });
        });
    })
}
