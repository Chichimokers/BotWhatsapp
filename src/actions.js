const qrcode = require("qrcode-terminal");

const { Client } = require("whatsapp-web.js");

const Mensaje = require("./models/Mensaje");
const DBMANAGER = require("./db/dbmanager");
const WAWebJS = require("whatsapp-web.js");
const { randomUUID } = require("crypto");
const path = require("path");
const fs = require("fs");
const { measureMemory } = require("vm");

let timer = 0;

let database = new DBMANAGER();
/**  @type {Mensaje} **/
let messages = [];
/**
 * @param {import('whatsapp-web.js').Message} message - El contenido del mensaje.
 */
function checkadmin(message) {
  owner = message.from.split("@")[0].trim();
  if (owner != "5358126024") {
    return false;
  }
  return true;
}
async function loadMessagea() {
  return new Promise((resolve, reject) => {
    messages = [];
    console.log("Conectado a la db......");

    database.getMessages().then(
      (data) => {
        console.log("Loading Messages......");
        for (var a in data) {
          console.log(data[a]);
          let setimage = null;
          if (data[a].image != null) {
          }
          messages.push(
            new Mensaje(data[a].owner, data[a].body, data[a].image)
          );
        }

        resolve(true);
      },
      (errr) => {
        console.log(errr);
      }
    );
  });
}
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * @param {Client} client - El propietario del mensaje.
 * @param {import('whatsapp-web.js').Message} message - El contenido del mensaje.
 */

async function proccesmessaje(client, message) {
  if (!message.fromMe) {
    await sleep(1000);
    message.getChat().then(
      /** 
 @param {import('whatsapp-web.js').Chat} datos - El contenido del mensaje.
 **/
      (datos) => {
        console.log(datos.name + "/" + message.from + " :" + message.body);
      }
    );

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    if (message.body.includes("!add")) {
      if (checkadmin(message)) {
        let a = message.body.split(" ")[1].split("/");
        let faltante = message.body.split(" ");

        let owner = a[0].trim();
        /** @type {String} */
        let body = a[1].trim();

        for (i = 2; i < faltante.length; i++) {
          console.log(faltante[i]);
          body += " " + faltante[i];
        }

        let photoname = null;

        if (message.hasMedia) {
          const media = await message.downloadMedia();
          photoname = randomUUID() + ".jpg"; // Generate a unique filename
          const mediaPath = path.join("media", photoname);
          photoname = mediaPath;
          // Save the media file
          await fs.promises.writeFile(mediaPath, media.data, "base64");
          console.log("Media file saved successfully:", mediaPath);
        } else {
          console.log("No tiene media");
        }
        const data = { owner: owner, body: body, image: photoname };
        console.log("Guardando información del anuncio", data);

        await database.createMessage(data);
        await loadMessagea();

        if (photoname == null) {
          await client.sendMessage(message.from, body);
        } else {
          const media = WAWebJS.MessageMedia.fromFilePath(photoname);
          await client.sendMessage(message.from, media, { caption: body });
        }
        return;
      } else {
        message.reply("No estas autorizado");
        return;
      }
    }

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    if (message.body === "!listgroup") {
      client
        .getChats()
        .then((/**@type {import('whatsapp-web.js').Chat[]} */ chats) => {
          chats.forEach((chat) => {
            if (chat.isGroup) {
              console.log(
                "ID :" +
                  chat.id._serialized +
                  "\n" +
                  "Name :" +
                  chat.name +
                  "\n" +
                  "Cant Personas :" +
                  chat.participants.length
              );
              message.reply(
                "ID :" +
                  chat.id._serialized +
                  "\n" +
                  "Name :" +
                  chat.name +
                  "Cant Personas :" +
                  chat.participants.length
              );
            }
          });
        });
      return;
    }
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    if (message.body.includes("!eeeeeeeeeeeadasdsad")) {
      let idchat = message.body.split(" ")[1];
      if (!idchat.includes("@")) {
        message.reply("error");
        return;
      }

      client.getChatById(idchat).then((chat) => {
        if (chat.participants.length === 0) {
        }
        chat.participants.forEach(async (contact) => {
          if (!contact.isAdmin) {
            if (!contact.isSuperAdmin) {
              /** @type {Mensaje} */
              const randomMessage =
                messages[Math.floor(Math.random() * messages.length)];
              await sleep(1000);
              if (randomMessage.image != null) {
                const media = WAWebJS.MessageMedia.fromFilePath(
                  randomMessage.image
                );
                await client.sendMessage(message.from, media, {
                  caption: randomMessage.Body,
                });
              } else {
                await client.sendMessage(
                  contact.id._serialized,
                  randomMessage.Body
                );
              }
            }
          }
        });
      });
      message.reply("Todos los avisos correctos ");
      return;
    }
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    if (message.body === "!test") {
      message.reply("Este es el comando test ");
      return;
    } 
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
  } else {
    console.log("Es de ti mismo");
  }
}

function acciones(client = Client) {
  client.once("ready", async () => {

    console.log("Client is ready!");
    console.log("Goin to make connections");

    await loadMessagea();
    client
    .getChats()
    .then(async (/**@type {import('whatsapp-web.js').Chat[]} */ chats) => {
    chats.forEach(async (chat) => {
       
  
        if (chat.isGroup) {
   
          await sleep(1000);
          try{
          console.log("Escribiendo en el grupo :-> "+chat.name )
          /** @type {Mensaje} */

          const randomMessage =
            messages[Math.floor(Math.random() * messages.length)];

          console.log(randomMessage);
          if (randomMessage.image != null) {
            const media = WAWebJS.MessageMedia.fromFilePath(
              randomMessage.image
            );
            
            await client.sendMessage(chat.id._serialized, media, {
              caption: randomMessage.Body,
            });
          }

          if (randomMessage.image === null) {
            await client.sendMessage(chat.id._serialized, randomMessage.Body);
          }
        }catch{
          console.log("Error  al enviar mensaje")
        }
        }
      });
    });

    setInterval(() => {
      console.log("mensaje cada 20 segundos ")
      client
        .getChats()

        .then(async (/**@type {import('whatsapp-web.js').Chat[]} */ chats) => {

          chats.forEach(async (chat) => {
           
      
            if (chat.isGroup) {
       
              await sleep(1000);
              try{
              console.log("Escribiendo en el grupo :-> "+chat.name )
              /** @type {Mensaje} */

              const randomMessage =
                messages[Math.floor(Math.random() * messages.length)];

              console.log(randomMessage);
              if (randomMessage.image != null) {
                const media = WAWebJS.MessageMedia.fromFilePath(
                  randomMessage.image
                );
                
                await client.sendMessage(chat.id._serialized, media, {
                  caption: randomMessage.Body,
                });
              }

              if (randomMessage.image === null) {
                await client.sendMessage(chat.id._serialized, randomMessage.Body);
              }
            }catch{
              console.log("Error  al enviar mensaje")
            }
            }
          });
        });
    }, 1200000);
  });

  client.on("qr", (qr) => {
    console.log("QR RECEIVED", qr);
    qrcode.generate(qr, { small: true });
  });

  client.on("message_create", async (message) => {
    proccesmessaje(client, message);
  });
  client.on("media_uploaded", async (message) => {
    proccesmessaje(client, message);
  });
}

module.exports = {
  acciones,
  messages,
};
