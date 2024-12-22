let strins = "!add +5358126024/Servicios informaticos s"


let separatae = strins.split(" ")[1].split("/")
let body = separatae[1];
let phone = separatae[0];

let bodycomlete = strins.split(" ");
for(i = 2 ; i<bodycomlete.length;i++)
{
    body +=" "+bodycomlete[i];
}
console.log(body)
