const cloudinary = require("cloudinary").v2;
const streamifier = require('streamifier');

module.exports = (buffer, folderName) => {

    return new Promise((resolve, reject) => {

        const cloudUploadStream = cloudinary.uploader.upload_stream(
            {
                folderName
            },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );

        streamifier.createReadStream(buffer).pipe(cloudUploadStream);
    });

};