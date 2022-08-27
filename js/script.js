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

  body.hasOwnProperty("erro") ? swal("Endereço não existe") : render(body);
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

/*const apiCep = "https://viacep.com.br/ws/${search}/json/";
const cep = document.querySelector("#cep");

const showData = (result) => {
  for (const campo in result) {
    if (document.querySelector("#" + campo)) {
      document.querySelector("#" + campo).value = result[campo];
    }
  }
};

      document
        .querySelectorAll("main table#lista tbody tr")
        .forEach((linha) => linha.remove());
      let cor = "corDois";
      total.dados.map((item) => {
        cor = cor == "corUm" ? "corDois" : "corUm";
        var lista = document.querySelector("table#lista tbody");
        lista.innerHTML += `<tr class='${cor}>
      <td>${item.cep}</td>
      <td>${item.logradouro}</td>
      <td>${item.bairro}</td>
      <td>${item.localidade}</td>
      <td>${item.uf}</td>
      <td class="text-center acoes>
        <img src="./img/edit.png" border="0" height="20px" onclick=""/>
        <img src="./img/delete.png" border="0" height="20px" onclick=""/>
      </td>
      </tr>`;
      });
    }
  }
};

/*
  for (const campo in result) {
    if (document.querySelector("#" + campo)) {
      document.querySelector("#" + campo).value = result[campo];
    }
  }
};

cep.addEventListener("blur", (e) => {
  let search = cep.value.replace("-", "");
  const options = {
    method: "GET",
    mode: "cors",
    cache: "default",
  };

  fetch(`https://viacep.com.br/ws/${search}/json/`, options)
    .then((response) => {
      response.json().then((data) => showData(data));
    })
    .catch((e) => console.log("Erro: " + e, message));
});

const apiCep = "https://viacep.com.br/ws/${search}/json/";

//consumindo a api
async function buscaCep() {
  try {
    const response = await fletch(apiCep, {
      method: "GET",
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

//inserindo dados na tabela
async function guardaCep(formulario) {
  try {
    const response = await fletch(apiCep, {
      method: "POST",
      body: formulario
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

function listaCep() {
  buscaCep().then((total) => {
    document
      .querySelectorAll("main table#lista tbody tr")
      .forEach((linha) => linha.remove());
    let cor = "corDois";
    total.dados.map((item) => {
      cor = cor == "corUm" ? "corDois" : "corUm";
      var lista = document.querySelector("table#lista tbody");
      lista.innerHTML += `<tr class='${cor}>
      <td>${item.cep}</td>
      <td>${item.logradouro}</td>
      <td>${item.bairro}</td>
      <td>${item.localidade}</td>
      <td>${item.uf}</td>
      <td class="text-center acoes>
        <img src="./img/edit.png" border="0" height="20px" onclick=""/>
        <img src="./img/delete.png" border="0" height="20px" onclick=""/>
      </td>
      </tr>`;
    });
  });

  function guardaCep(formulario) {
    let res = api
  }
}
*/
