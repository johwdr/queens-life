let config = {
    dev: {
        global:{
            TYPE:'Local development',
            DEBUGGING:true,
            ASSETS_PATH:'assets/',
            STATS_PREFIX: 'LOCAL-',
        }
    },
    stage: {
        global:{
            TYPE:'Staging',
            DEBUGGING:true,
            ASSETS_PATH:'http://localhost:8888/local-deploy/stage/parceljs-boilerplate/assets/',
            STATS_PREFIX: 'STAGING-',
        },
        DEPLOY_FOLDER:'/Volumes/staging/',
        OVERWRITE_CONFIRM:true,
        MINIFY:false,
        WEBDOK:true,
        BASE_URL:'https://www.dr.dk/tjenester/visuel/staging/',
    },
    deploy: {
        global:{
            TYPE:'Production',
            DEBUGGING:false,
            ASSETS_PATH:'http://localhost:8888/local-deploy/deploy/parceljs-boilerplate/assets/',
            STATS_PREFIX: '',
        },
        DEPLOY_FOLDER:'/Volumes/2019/',
        OVERWRITE_CONFIRM:true,
        WEBDOK:true,
        MINIFY:true,
        BASE_URL:'https://www.dr.dk/nyheder/htm/grafik/2019/',
    }
}
module.exports = config;