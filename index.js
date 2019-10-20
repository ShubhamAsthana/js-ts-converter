const fs = require('fs');
const path = require('path')
const contentJson = require('./content');
let response;
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

readline.question(`Select your preference React or Node\n`, (preference) => {
     response = preference.toLocaleLowerCase();
    if (preference == 'exit') {
        console.log('Exited');
        readline.close();
    }
    if (response !== 'react' && response != 'node' && response != 'exit') {
        console.log('Invalid selection');
        readline.close();
    }
    else {
        if (response == 'react') {
            readline.question('Enter directory absolute address\n', (address) => {
                react(address);
                readline.close();
            });
        }
        else {
            readline.question('Enter directory absolute address\n', (address) => {
                node(address, response);
                readline.close();
            });
        }
    }
})


const react = (newAddress) => {
    if (fs.existsSync(newAddress)) {
        fs.writeFile(path.join(newAddress, 'tsconfig.json'), JSON.stringify(contentJson), (err) => {
            if (err) console.log(err)
        })

        const converter = (address) => {
            fs.readdirSync(address).map((file) => {


                const relativePath = path.join(address, file);
                const stat = fs.lstatSync(relativePath);
                // if(!stat.isDirectory()&& path.extname(file)== '.ts') {
                //     updateFile(relativePath, 'let', /var/g, (err)=> {
                //         console.log(err)
                //     })
                // }
                let packageJson;
                if (file == 'package.json') {
                    fs.readFile(relativePath, 'utf8', (err, json) => {
                        packageJson = JSON.parse(json);
                        packageJson.dependencies["typescript"] = "latest";
                        packageJson.dependencies["@types/node"] = "latest";
                        packageJson.dependencies["@types/react"] = "latest";
                        packageJson.dependencies["@types/react-dom"] = "latest";
                        packageJson.dependencies["@types/jest"] = "latest";

                        fs.writeFile(relativePath, JSON.stringify(packageJson), (err) => {
                            if (err) console.log(err)
                        })
                    })

                }
                if (stat.isDirectory() && file !== 'node_modules')
                    converter(path.join(address, file));
                if (path.extname(file) == '.js' || path.extname(file) == '.jsx') {
                    const newFileName = path.extname(file) == '.js' ? file.split('.js').join('.tsx') : file.split('.jsx').join('.tsx');
                    fs.rename(relativePath, path.join(address, newFileName), (err) => {
                        if (err)
                            console.log(err)
                        // updateFile(path.join(address, newFileName), 'let', /var/g, (err) => {
                        //     console.log(err)
                        // })
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
        console.log('done');
    }
    else console.log('Directory not found');
}


const node = (newAddress, response) => {
    if (fs.existsSync(newAddress)) {
        fs.writeFile(path.join(newAddress, 'tsconfig.json'), JSON.stringify(contentJson), (err) => {
            if (err) console.log(err)
        })

        const converter = (address) => {
            fs.readdirSync(address).map((file) => {


                const relativePath = path.join(address, file);
                const stat = fs.lstatSync(relativePath);
                // if(!stat.isDirectory()&& path.extname(file)== '.ts') {
                //     updateFile(relativePath, 'let', /var/g, (err)=> {
                //         console.log(err)
                //     })
                // }
                let packageJson;
                if (file == 'package.json') {
                    fs.readFile(relativePath, 'utf8', (err, json) => {
                        packageJson = JSON.parse(json);
                        packageJson.dependencies["typescript"] = "latest";
                        packageJson.scripts["tsc"] = "tsc";
                        if (packageJson.scripts.start !== "tsc && ".concat(packageJson.scripts.start))
                            packageJson.scripts["start"] = "tsc && ".concat(packageJson.scripts.start)
                        packageJson.dependencies["@types/node"] = "latest";
                        fs.writeFile(relativePath, JSON.stringify(packageJson), (err) => {
                            if (err) console.log(err)
                        })
                    })

                }
                if (stat.isDirectory() && file !== 'node_modules')
                    converter(path.join(address, file));
                if (path.extname(file) == '.js') {
                    const newFileName = file.split('.js').join('.ts');
                    fs.rename(relativePath, path.join(address, newFileName), (err) => {
                        if (err)
                            console.log(err)
                        updateFile(path.join(address, newFileName), 'let', /var/g, response,  (err) => {
                            console.log(err)
                        },)
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
        console.log('done');
    }
    else console.log('Directory not found');
}

function updateFile(filename, replacement, regex, response) {
    return new Promise(function (resolve) {
        fs.readFile(filename, 'utf-8', function (err, data) {
            if (err) {
                throw (err);
            } else {
                data = data.replace(regex, replacement);
                if(response)
                data = 'export{}\n'.concat(data);
            }
            fs.writeFile(filename, data, 'utf-8', function (err) {

                if (err) {
                    throw (err);
                } else {
                    resolve();
                }
            });
        });
    })
}
