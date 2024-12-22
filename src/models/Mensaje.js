const { Message } = require("whatsapp-web.js");

class Mensaje extends Message  {
     /**
     * @param {string} Owner - El propietario del mensaje.
     * @param {string} Body - El contenido del mensaje.
     */
 constructor(Owner ,Body,image){
        super();
        this.image = image;
        this.Owner = Owner;
        this.Body = Body
    }
 /**
     * Método para obtener el propietario del mensaje.
     * @returns {string} - El propietario del mensaje.
     */
    GetOwner(){
       
        return this.Owner;
    }
     /**
     * Método para obtener el propietario del mensaje.
     * @returns {string} - El propietario del mensaje.
     */
    getBody(){
        return this.Body;
    }

}
module.exports = Mensaje;
