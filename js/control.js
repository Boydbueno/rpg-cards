var input_data = document.getElementsByClassName("input-data")[0];
var input_button = document.getElementsByClassName("input-button")[0];

input_data.value = "";
input_data.value += JSON.stringify(card_data, null, "  ");


input_button.onclick = function () {
    var card_data = JSON.parse(input_data.value);
    card_generate_html(card_data);
}
