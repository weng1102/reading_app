let emailaddress: string;
emailaddress = "wen.eng_saratoga-ca@map.google.co.uk";
//let parts: string[] = emailaddress.split(/(?=[_-.@])|(?<=[_-.@])/g);
let parts: string[] = emailaddress.split(/(?=[.\-_@])|(?<=[.\-_@])/g);
console.log(parts);
