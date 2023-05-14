const nodemailer = require("nodemailer");
const CONFIG = require("../config");

function sendEmail(
    recipientEmail,
    subject,
    body,
    attachments = null,
    cc_email
) {
    return new Promise((resolve, reject) => {
        try {
            console.log(
                recipientEmail,
                subject,
                body,
            );
            // if (Array.isArray(recipientEmail)) {
            //     const promises = [];
            //     recipientEmail.forEach(function (email) {
            //         promises.push(sendEmailSingle(email, subject, body, attachments));
            //     });
            //     resolve(Promise.all(promises))
            // } else {
            resolve(
                sendEmailSingle(
                    recipientEmail,
                    subject,
                    body,
                    attachments,
                    cc_email
                )
            );
            // }
        } catch (e) {
            reject(e.toString());
        }
    });
}

function sendEmailSingle(
    recipientEmail,
    subject,
    body,
    attachments = null,
    cc_email = [] || ''
) {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: CONFIG.EMAIL.SERVICE,
            auth: {
                user: CONFIG.EMAIL.USER,
                pass: CONFIG.EMAIL.PASSWORD
            }
        });
        let attach = [];
        if (attachments?.length > 0) {
            attachments.map((file) => {
                if (file.filename && file.content) {
                    attach.push(file);
                } else {
                    let obj = {
                        path: file
                    };
                    attach.push(obj);
                }
            });
        }
        const mailOptions = {
            from: CONFIG.EMAIL.USER,
            to: recipientEmail,
            cc: cc_email,
            subject: subject,
            html: body,
            attachments: attach
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
}

module.exports = sendEmail;
