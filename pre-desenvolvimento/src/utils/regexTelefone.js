document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById("telefone");

    input.addEventListener("input", function (e) {
       
        let value = e.target.value.replace(/\D/g, ""); // só números

        if (value.length > 11) value = value.substring(0, 11); // máximo 11 dígitos

        // aplica máscara
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3"); // celular
        } else if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3"); // fixo
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
        } else {
            value = value.replace(/^(\d*)$/, "($1");
        }

        e.target.value = value;
    });
});
