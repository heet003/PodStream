const nodemailer = require("nodemailer");

//set mail password
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "",
    pass:""
    //pass: ""
  }
}); 

let mail = {};

mail.sendMail = function(to, subject, body, isHTML = 1,attachments = [],cc="",bcc="") {
  return new Promise(function(fulfill, reject) {
    var mailOptions = {
      from: '', // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: isHTML ? "" : body, // plaintext body
      html: isHTML ? body : "" // html body
    };

    if(cc)
      mailOptions["cc"] = cc;
    
    if(bcc)
      mailOptions["bcc"] = bcc;
    

    if(attachments && attachments.length > 0){
      mailOptions["attachments"] = attachments;
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        fulfill(0);
        return console.log(error);
      }
      fulfill(1);
    });
  });
};

module.exports = mail;
