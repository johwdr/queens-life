const Parcel = require('parcel-bundler');
const fs = require('fs-extra');
const readline = require('readline');

const config = require('./config');
const pathArray = __dirname.split('/');
const folderName = pathArray[pathArray.length -1];

const watcher = require('glob-watcher');

const replace = require('replace-in-file');

const htmlDevReplaceOptions = {
    files:'./dev/index.html',
    from:/https:\/\/www\.dr\.dk\/assets\/fonts\//g,
    to:'local-fonts/'
};

let type, vars, cssPathToDeployOptions;

let startPrompt = ()=>{
    const prompt = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return prompt;
}
let setVars = ()=>{
    if(process.argv.indexOf("-t") != -1){ //does our flag exist?
        type = process.argv[process.argv.indexOf("-t") + 1]; //grab the next item
    }
    vars = config[type];
    vars.OUT_DIR = `./${type}`;

    for(let a in vars.global){
        process.env[a] = vars.global[a];
    }
    
    cssPathToDeployOptions = {
        files:'./src/styles/global.scss',
        from:'http://localhost:1234/assets/',
        to:vars.global.ASSETS_PATH
    }

    cssPathFromDeployOptions = {
        files:'./src/styles/global.scss',
        from:vars.global.ASSETS_PATH,
        to:'http://localhost:1234/assets/'
    }
    
    if(type === 'dev'){
        dev();
    }else{
        build();
    }
}

let build = ()=>{
    const checkDestination = new Promise((resolve, reject)=>{
        if(fs.existsSync(vars.DEPLOY_FOLDER)){
            resolve();
        }else{
            reject('The destination folder doesn\'t exist. Check config.js and ensure the folder is mounted.');
        }
    });

    // Start the Party:
    checkDestination.then(
        (result)=>{
            return new Promise((resolve, reject)=>{
                if(fs.existsSync(vars.DEPLOY_FOLDER + folderName)){
                    if(vars.OVERWRITE_CONFIRM){
                        let prompt = startPrompt();
                        prompt.question(`"${vars.DEPLOY_FOLDER + folderName}" \nfindes allerede. Vil du overskrive den? y/n\n`, (answer)=>{
                            prompt.close();
                            (answer === 'y') ? resolve() : reject();
                        })
                    }else{
                        // prompt.close();
                        resolve();
                    }
                }else{
                    // prompt.close();
                    resolve();
                }
            }).then((result)=>{
                console.log('Pakker ...');
                return new Promise((resolve, reject)=>{
                    fs.emptyDirSync(vars.OUT_DIR);
                    replace(cssPathToDeployOptions);
                    const parcel = new Parcel(
                        ['./src/script/index.html','./src/script/index.js'],
                        {
                            outDir:vars.OUT_DIR,
                            watch:false,
                            contentHash:false,
                            publicUrl:'./',
                            minify:vars.MINIFY
                        });
                        parcel.on('bundled', (bundle)=>{
                            replace(cssPathFromDeployOptions);
                            resolve('pakkerne')
                        });
                        parcel.on('buildError', (err)=>{
                            replace(cssPathFromDeployOptions);
                            reject(err);
                        });
                        // reject('Oops');
                        parcel.bundle();
                    }).then((result)=>{
                        console.log('Kopierer ... ');
                        fs.emptyDirSync(vars.DEPLOY_FOLDER + folderName);
                        fs.copySync('./src/assets', vars.OUT_DIR + '/assets', {overwrite:true});

                        if(vars.WEBDOK){
                            fs.copySync('./src/webdok.html', vars.OUT_DIR + '/webdok.html', {overwrite:true});
                            replace.sync({
                                files: vars.OUT_DIR + '/webdok.html',
                                from:/\.\//g,
                                to:vars.BASE_URL + folderName + '/'
                            })
                        }
                        fs.copySync('./src/web.config', vars.OUT_DIR + '/web.config', {overwrite:true});
                        
                        fs.copySync(vars.OUT_DIR, vars.DEPLOY_FOLDER + folderName, {overwrite:true});
                        
                        console.log('Test URL:\n' + vars.BASE_URL + folderName);
                    }
                    ), (err)=>{
                        console.log(err);
                }
            },
            (err)=>{
                console.log('Jamen så lader vi være. Det skal da ikke komme an på det da.');
            }
        );
    },
    (err)=>{
        console.log('Error:', err);
        process.exit(0);
    })
}
let dev = ()=>{
    // console.log('dev', process.env.TYPE);
    const parcel = new Parcel(
        ['./src/script/index.html', '../assets/**/*'],
        {
            outDir:'./dev'
        }
    );
    fs.copy('./src/assets', './dev/assets', {overwrite:true});
    fs.copy('./src/local-fonts', './dev/local-fonts', {overwrite:true});

    const watch = watcher('./src/assets/**/*.*', (watchdone)=>{
        // console.log('watch triggered')
        fs.emptyDirSync('./dev/assets');
        fs.copy('./src/assets', './dev/assets', {overwrite:true});
        parcel.hmr.broadcast({
            type:'reload'
        })
        watchdone()
    });
   parcel.bundle()
    .then( ()=>{
        console.log('bundled')
            replace(htmlDevReplaceOptions);
        });
    parcel.serve();
}
setVars();