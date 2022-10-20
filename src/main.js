import "./css/index.css"
import IMask from "imask"

const ccBgColor = document.querySelector(".cc-bg svg rect")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

/* Criei a const chamada "ccBgColor01", localizei ela no HTML ultilizando o querySelector com a seguinte lógica:

Procura a class "CC-BG" após isso entra na "SVG"  Depois ">" (procure o primeiro nivel de G), do primeiro nivel vai pegar o "g:nth-child(1)" ou seja o filho
numero 1 */

/*
ccBgColor01.setAttribute("fill", "green") // Seleciona o HTML e atribua o valor de "fill" para "green"
ccBgColor02.setAttribute("fill", "blue")
*/

// ESTRUTURA DE DADOS (objeto)

/*
const colors = {
  visa: ["#436D99", "#2D57F2"],
  mastercard: ["#C69347", "#DF6F29"],
  default: ["black", "gray"],
}
*/

// CRIANDO UMA FUNÇÃO

function setCardType(type) {
  // O type eu espero que seja "Visa" ou "mastercard", não sendo nenhum dos dois, será default
  const colors = {
    visa: "#000AFF",
    mastercard: "#EF0505",
    elo: "#00F",
    nubank: "#A405EF",
    default: "gray",
  }

  ccBgColor.setAttribute("fill", colors[type]) // mudar conforme o tipo de cartao passado a cima.  Seleciona 0 para visa
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType; // Executando a função que criamos

// security code

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    console.log(foundMask)

    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton= document.querySelector('#add-card');
addButton.addEventListener("click", () => {           // Vai ficar observando o botao
  alert("Cartão Adicionado")
})
document.querySelector("form").addEventListener("submit", (event) => {        // form = formulario no html     submit = enviar o formulario
  event.preventDefault()    // evento de atualizar a pagina
})    

const cardHolder = document.querySelector("#card-holder");
cardHolder.addEventListener("input", () => {  // observar quando a caixa de texto obter algum dado
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value; // cada letra que digitamos a function input observa e inseri no nosso form
})  

securityCodeMasked.on("accept", () => {  // capturar o conteudo, caso ele seja aceito

  updateSecurityCode(securityCodeMasked.value);
}) 

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value");

  ccSecurity.innerText = code.length === 0 ? "123" : code;  // se o tamanho (length) for igual a 0 (ou seja 'nenhum conteudo') mostre o texto "123", caso contrario mostre o conteudo do proprio codigo
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype;
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value);
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number;
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value);
})

function  updateExpirationDate(date){
  const ccExpiration = document.querySelector('.cc-extra .value');
  ccExpiration.innerText = date.length === 0 ? "02/32" : date;
}