const API_URL = "http://localhost:3000/users/1"; 

async function carregarPerfil() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Erro na requisição");

    const user = await res.json();

    // Preenche os campos do perfil
    document.querySelector("#nome").value = user.nome_completo || "";
    document.querySelector("#telefone").value = user.telefone || "";
    document.querySelector("#cpf").value = user.cpf || "";
    document.querySelector("#email").value = user.email || "";
    document.querySelector("#senha").value = user.senha || "";
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar o perfil!");
  }
}

// Chama a função quando a página carregar
document.addEventListener("DOMContentLoaded", carregarPerfil);
