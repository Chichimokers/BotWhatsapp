const qrcode = require("qrcode-terminal");
const { messages, acciones } = require("./actions");
const { Client } = require("whatsapp-web.js");
const { LocalAuth } = require("whatsapp-web.js");
const { LocalWebCache } = require("whatsapp-web.js");
const client = new Client({
  authStrategy: new LocalAuth({ dataPath: "." }),
});

acciones(client);

client.initialize();
