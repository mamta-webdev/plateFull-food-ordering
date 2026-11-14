const Imagekit = require("imagekit")

const imagekit = new Imagekit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: "https://ik.imagekit.io/jimjahbxt"
})

async function uploadFiles(file, fileName){
    const result = await imagekit.upload({
        file: file,             //file is the data that we got in buffer.we will upload this file to imagekit server 
        fileName: fileName
    })
    return result;            //url of the uploaded file
}

module.exports = {
    uploadFiles
}