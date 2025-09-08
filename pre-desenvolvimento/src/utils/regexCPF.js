document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById("cpf");

    input.addEventListener("input", function (e) {
       
        let value = e.target.value.replace(/\D/g, ""); // só números

        if (value.length > 11) value = value.substring(0, 11); // máximo 11 dígitos

         if (value.length == 11) {
            value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4"); // celular
        }

        e.target.value = value;
    });
});



