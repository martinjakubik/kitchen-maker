let sMessage = 'let\'s make some kitchens!';
console.log(sMessage);

let contentParagraph = document.createElement('p');
let contentText = document.createTextNode(sMessage);
contentParagraph.appendChild(contentText);
document.body.appendChild(contentParagraph);
