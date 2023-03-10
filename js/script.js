const apiCep = "https://viacep.com.br/ws/value/json/";

const body = document.querySelector("body");
const form = document.querySelector("#pesquisa-cep");
const list = document.querySelector("#results");
const table = document.querySelector("#table-enderecos");
const tableBody = document.querySelector("#enderecos-tbody");
const startWrapper = document.querySelector("#start-wrapper");
const cepInput = document.querySelector("#cep");
const btnLimpar = document.querySelector("#btn-limpar");

let listaEnderecos = JSON.parse(localStorage.getItem("enderecos"));

table.classList.add("d-none");
startWrapper.classList.add("d-block");
btnLimpar.classList.add("d-none");

if (!!listaEnderecos && listaEnderecos.length > 0) {
  listaEnderecos.map((endereco) => render(endereco));

  table.classList.remove("d-none");
  startWrapper.classList.remove("d-block");
  startWrapper.classList.add("d-none");
  btnLimpar.classList.remove("d-none");
  btnLimpar.classList.add("d-block");
}

function filtro(cep) {
  return listaEnderecos.filter(
    (endereco) => normalizeString(endereco.cep) === normalizeString(cep)
  );
}

function normalizeString(str) {
  return str.replace("-", "").trim();
}

function render(endereco) {
  if (!listaEnderecos) {
    startArrayEnderecos(endereco);
  }

  if (!!listaEnderecos && listaEnderecos.indexOf(endereco) === -1) {
    listaEnderecos.push(endereco);
  }

  localStorage.setItem("enderecos", JSON.stringify(listaEnderecos));

  renderTable(endereco);
  table.classList.remove("d-none");
  startWrapper.classList.remove("d-block");
  startWrapper.classList.add("d-none");
  btnLimpar.classList.remove("d-none");
  btnLimpar.classList.add("d-block");
}

function renderTable(endereco) {
  const { logradouro, bairro, localidade, uf, cep } = endereco;
  const tableRow = document.createElement("tr");

  const colunas = {
    cep,
    logradouro,
    bairro,
    localidade,
  };

  Object.entries(colunas).map(([key, value]) => {
    const tableColumn = document.createElement("td");
    tableColumn.innerText = key === "localidade" ? `${value} (${uf})` : value;
    tableRow.appendChild(tableColumn);
  });

  tableBody.appendChild(tableRow);
}

function startArrayEnderecos(endereco) {
  listaEnderecos = [];
  listaEnderecos.push(endereco);
}

async function get(cep) {
  const res = await fetch(apiCep.replace("value", normalizeString(cep)));
  const body = await res.json();

  body.hasOwnProperty("erro") ? swal("CEP digitado inexistente") : render(body);
}

//LISTENERS
form.addEventListener("submit", (e) => {
  e.preventDefault();

  !!listaEnderecos &&
  !!listaEnderecos.length &&
  !!listaEnderecos.find(
    (e) => normalizeString(e.cep) === normalizeString(cepInput.value)
  )
    ? swal(`O CEP ${cepInput.value} já consta na lista.`)
    : get(cepInput.value);

  cepInput.value = null;
  cepInput.focus();
});

btnLimpar.addEventListener("click", (e) => {
  e.preventDefault();

  localStorage.removeItem("enderecos", null);
  listaEnderecos = JSON.parse(localStorage.getItem("enderecos"));

  tableBody.innerHTML = "";
  table.classList.remove("d-block");
  table.classList.add("d-none");
  btnLimpar.classList.remove("d-block");
  btnLimpar.classList.add("d-none");
  startWrapper.classList.remove("d-none");
  startWrapper.classList.add("d-block");
});
