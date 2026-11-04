const form = document.getElementById("reservaForm");
form.addEventListener("submit", function(e){
    e.preventDefault();
    alert(
        "Gracias por elegir EcoSierra Adventure.\n\nTu solicitud de reserva fue enviada correctamente."
    );
    form.reset();
});
