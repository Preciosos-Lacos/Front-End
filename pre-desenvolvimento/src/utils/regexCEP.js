window.onload = function () {
    const input = document.getElementById("cep");

    input.addEventListener("input", function (e) {
       
        let value = e.target.value.replace(/\D/g, ""); // só números

        if (value.length > 8) value = value.substring(0, 8); // máximo 11 dígitos

          if (value.length == 8) {
            value = value.replace(/^(\d{5})(\d{3})$/, "$1-$2"); // celular
        }

    
        e.target.value = value;
    });
}
