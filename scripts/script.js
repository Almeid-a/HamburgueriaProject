const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItensContainer = document.getElementById("cart-itens");
const cartTotal = document.getElementById("cart-total");
const paymentTotal = document.getElementById("payment-total");
const cartFooterTotal = document.getElementById("cartFooter-total");
const cartCounter = document.getElementById("cart-count");
const addressWarn = document.getElementById("address-warn");
const cartWarn = document.getElementById("cart-warn");
const cepInput = document.getElementById("cep");
const nameInput = document.getElementById("name");
const numberInput = document.getElementById("numero");
const number = document.getElementById("number-input");

const closeModalBtn = document.getElementById("close-modal-btn");
const addressBtn = document.getElementById("address-btn");

const addressModal = document.getElementById("address-modal");
const returnCartBtn = document.getElementById("return-cart-btn");

const paymentBtn = document.getElementById("payment-btn");
const paymentModal = document.getElementById("payment-modal");

const returnAddressBtn = document.getElementById("return-address-btn");
const finishBtn = document.getElementById("finish-btn");

let cart = [];

//ABRIR O MODAL DO CARRINHO
cartBtn.addEventListener("click", function() {
    cartModal.style.display = "flex"
    updateCartModal();
})

//FECHAR O MODAL DO CARRINHO QUANDO CLICAR FORA
cartModal.addEventListener("click" , function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

//FECHAR O MODAL QUANDO CLICAR NO FECHAR
closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none"
})

//FECHAR O MODAL DO ENDEREÇO QUANDO CLICAR FORA
addressModal.addEventListener("click" , function(event){
    if(event.target === addressModal){
        addressModal.style.display = "none"
    }
})

//VOLTA PARA O MODAL DO CARRINHO (ESTANDO NO ENDEREÇO)
returnCartBtn.addEventListener("click", function() {
    addressModal.style.display = "none"
    cartModal.style.display = "flex"
})

//ABRIR O MODAL DO PAGAMENTO (ESTANDO NO ENDEREÇO)
paymentBtn.addEventListener("click", function() {
     // Verificar se alguma opção de entrega foi selecionada
     const deliveryOption = document.querySelector('input[type="radio"][name="address"]:checked');
     if (!deliveryOption) {
         // Se nenhuma opção de entrega estiver selecionada, exibir uma mensagem de erro e retornar
         mostrarToast("Selecione uma opção de entrega.");
         return;
     }    
    
    const allFieldsFilled = checkRequiredFields();
    
        if (allFieldsFilled) {
            addressModal.style.display = "none";
            paymentModal.style.display = "flex";
        }
        
})

//FECHAR O MODAL DO PAGAMENTO QUANDO CLICAR FORA
paymentModal.addEventListener("click" , function(event){
    if(event.target === paymentModal){
        paymentModal.style.display = "none"
    }
})

//VOLTA PARA O MODAL DO ENDEREÇO (ESTANDO NO PAGAMENTO)
returnAddressBtn.addEventListener("click", function() {
    paymentModal.style.display = "none"
    addressModal.style.display = "flex"
})

//ADICIONA ITEM NO CARRINHO MODAL
menu.addEventListener("click", function(event){

    let parentButton = event.target.closest(".add-to-cart-btn")
    
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        //ADICIONARNO CARRINHO
        addToCart(name, price)
    }
})

//FUNÇÃO PARA ADICIONAR NO CARRINHO
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)
    
    if(existingItem){
        //SE O ITEM JA EXISTE AUMENTA A QUANTIDADE + 1 E SOMA O PREÇO
        existingItem.quantity += 1
        updateCartModal();
        return;
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
}

//ATUALIZA O CARRINHO
function updateCartModal() {
    cartItensContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium mt-4">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-1">${item.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}</p>
                </div>

                    <div class="bg-gray-900 rounded">
                    <button class="fa fa-trash-can text-white px-2 remove-cart-btn" data-name="${item.name}">
                    </button>
                </div>
            </div>
        `

        total += item.price * item.quantity;

        cartItensContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    paymentTotal.textContent = cartTotal.textContent;
    cartFooterTotal.textContent = cartTotal.textContent;

    cartCounter.innerText = cart.length;

    if (cart.length != 0) {
        cartWarn.style.display = "none"; // Exibe a mensagem de aviso
    }
}

//FUNÇÃO PARA REMOVER ITEM DO CARRINHO
cartItensContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        console.log(item);

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

//ABRIR O MODAL DO ENDEREÇO (ESTANDO NO CARRINHO). ANTES VERIFICA SE O CARRINHO ESTA VAZIO E O RESTURANTE ESTA ABERTO
addressBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        mostrarToast("Infelizmente estamos Fechados no momento!");
        return;
    }

    if(cart.length === 0) {
        cartWarn.style.display = "flex"
        return;
    }else {
        cartModal.style.display = "none";
        addressModal.style.display = "flex"
    }
})

//VERIFICA A HORA E MANIPULA O CARD DO HORARIO
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 23;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}

function mostrarToast(mensagem, tipo) {
    let estilo;
    if (tipo === "success") {
        estilo = {
            background: "#10B981",
        };
    } else {
        estilo = {
            background: "#ef4444",
        };
    }

    Toastify({
        text: mensagem,
        duration: 4000,
        close: true,
        gravity: "top", 
        position: "right",
        stopOnFocus: true,
        style: estilo,
    }).showToast();
}

const addressOptions = document.querySelectorAll('.address-option');
const addressForm = document.querySelector('.address-form');

addressOptions.forEach(option => {
    option.addEventListener("click", function() {
        const radio = this.querySelector('input[type="radio"][name="address"]');
        if (radio) {
            radio.checked = true;

            nameInput.value = '';
            cepInput.value = '';
            nameInput.classList.remove("border-red-500");
            cepInput.classList.remove("border-red-500");
            numberInput.classList.remove("border-red-500");
            const parentDiv = this.closest('.border-gray-300');

            if (parentDiv) {
                const siblingDivs = parentDiv.parentElement.querySelectorAll('.border-gray-300');

                siblingDivs.forEach(div => {
                    if (div !== parentDiv) {
                        div.classList.remove('bg-slate-200', 'text-grey-900', 'border-slate-600');
                        div.classList.add('bg-white', 'text-black', 'ring-black', 'border-gray-200');
                    }
                });

                if (radio.checked) {
                    parentDiv.classList.add('bg-slate-200', 'text-grey-900', 'border-slate-600');
                    parentDiv.classList.remove('bg-white', 'text-black', 'ring-black', 'border-gray-200');
                    const entregaSelecionado = parentDiv.id;

                    // Verifica se a opção selecionada é "delivery" e mostra o formulário de endereço correspondente
                    if (entregaSelecionado === "delivery") {
                        addressForm.classList.remove('hidden');
                        cepInput.classList.remove('hidden');
                        numberInput.classList.remove('hidden');
                    } else {
                        // Se a opção selecionada não for "delivery", esconde o formulário de endereço
                        addressForm.classList.remove('hidden');
                        cepInput.classList.add('hidden');
                        numberInput.classList.add('hidden');
                        limparEndereco();
                    }
                } else {
                    parentDiv.classList.remove('bg-slate-200', 'text-grey-900', 'border-slate-600');
                    parentDiv.classList.add('bg-white', 'text-black', 'ring-black', 'border-gray-200');
                }
            }
        }
    });
});

//CHAMA A FUNCAO DE PESQUISAR CEP
cepInput.addEventListener('focusout', function () {
    pesquisarCep();
});

//VALIDA SE O CEP DIGITADO ATENDE AO REQUISITOS
const cepValido = (cep) => {
    // Verifica se o CEP possui 8 dígitos, com ou sem traço
    if (!/^\d{5}-?\d{3}$/.test(cep)) {
        return false;
    }
    
    // Remove o traço (se houver) para contar apenas os dígitos
    const cepLimpo = cep.replace('-', '');

    // Verifica se o CEP contém apenas números
    if (!/^\d+$/.test(cepLimpo)) {
        return false;
    }

    // Verifica se o CEP não está em um formato inválido (por exemplo, todos os dígitos iguais)
    if (/^(\d)\1{7}$/.test(cepLimpo)) {
        return false;
    }

    return true;
};

//FUNÇÃO PARA PESQUISAR O CEP
async function pesquisarCep() {
    limparEndereco();
    const cep = document.getElementById('cep').value;
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    console.log(cep);

    if (cepValido(cep)) {
        const response = await fetch(url);
        const endereco = await response.json();
        if (endereco.hasOwnProperty('erro')) {
            mostrarToast('CEP não encontrado!');
        } else {
            preencherFormulario(endereco);
        }
    } else {
        mostrarToast('CEP incorreto!');
    }
}

//PREENCHE FORMULARIO DE ENDEREÇO
const preencherFormulario = (endereco) => {
    document.getElementById("endereco").value = endereco.logradouro || '';
    document.getElementById("bairro").value = endereco.bairro || '';
    document.getElementById("cidade").value = endereco.localidade || '';
    document.getElementById("estado").value = endereco.uf || '';

    document.getElementById("address-input").classList.remove("hidden");
    document.getElementById("number-input").classList.remove("hidden");
    document.getElementById("bairro-input").classList.remove("hidden");
    document.getElementById("state-input").classList.remove("hidden");
    document.getElementById("city-input").classList.remove("hidden");
};

//LIMPA O FORMULARIO DE ENDEREÇO
function limparEndereco() {
    document.getElementById("endereco").value = '';
    document.getElementById("numero").value = '';
    document.getElementById("bairro").value = '';
    document.getElementById("cidade").value = '';
    document.getElementById("estado").value = '';

    document.getElementById("address-input").classList.add("hidden");
    document.getElementById("number-input").classList.add("hidden");
    document.getElementById("bairro-input").classList.add("hidden");
    document.getElementById("state-input").classList.add("hidden");
    document.getElementById("city-input").classList.add("hidden");
}

//VERIFICA SE OS CAMPOS DE ENDEREÇO OBRIGATORIO FORAM PREENCHIDOS
function checkRequiredFields() {
    const nameValue = nameInput.value.trim();
    const cepValue = cepInput.value.trim();
    const numberValue = numberInput.value.trim();

    // Verifica se os campos obrigatórios estão preenchidos de acordo com a opção selecionada
    const deliveryOption = document.getElementById("delivery");
    const isDeliverySelected = deliveryOption.querySelector('input[type="radio"][name="address"]').checked;

    if (isDeliverySelected) {
        // Se a opção de entrega for "Delivery", todos os campos (nome, cep, número) são obrigatórios
        if (nameValue === '' || cepValue === '' || numberValue === '') {
            // Se algum campo estiver vazio, exiba uma mensagem de erro, adicione a classe que define a borda vermelha e retorne false
            if (cepValue === '') {
                cepInput.classList.add("border-2", "border-red-500");
                mostrarToast("O campo CEP é obrigatório.");
            }
            if (nameValue === '') {
                nameInput.classList.add("border-2", "border-red-500");
                mostrarToast("O campo Nome é obrigatório.");
            }
            if (cepValue != '' && numberValue === '') {
                numberInput.classList.add("border-2", "border-red-500");
                mostrarToast("O campo Número é obrigatório.");
            }
            return false;
        }
    } else {
        // Se a opção de entrega for "Retirar no Local", apenas o campo de nome é obrigatório
        if (nameValue === '') {
            // Se o campo de nome estiver vazio, exiba uma mensagem de erro, adicione a classe que define a borda vermelha e retorne false
            mostrarToast("O campo Nome é obrigatório.");
            nameInput.classList.add("border-2", "border-red-500");
            return false;
        }
    }

    // Se todos os campos obrigatórios estiverem preenchidos, remova a classe que define a borda vermelha e retorne true
    nameInput.classList.remove("border-2", "border-red-500");
    cepInput.classList.remove("border-2", "border-red-500");
    numberInput.classList.remove("border-2", "border-red-500");

    // Se todos os campos obrigatórios estiverem preenchidos, retorne true
    return true;
}

//SELECIONAR FORMA DE PAGAMENTO E COLOCAR OS ESTILOS
const paymentOptions = document.querySelectorAll('.payment-option');
let formaPagamentoSelecionada = "";

paymentOptions.forEach(option => {
    option.addEventListener("click", function() {
        const radio = this.querySelector('input[type="radio"][name="payment"]');
        if (radio) {
            radio.checked = true;

            const parentDiv = this.closest('.border-gray-300');
            const trocoInput = document.getElementById('troco-input');

            if (parentDiv) {
                const siblingDivs = parentDiv.parentElement.querySelectorAll('.border-gray-300');

                siblingDivs.forEach(div => {
                    if (div !== parentDiv) {
                        div.classList.remove('bg-slate-200', 'text-grey-900', 'border-slate-600');
                        div.classList.add('bg-white', 'text-black', 'ring-black', 'border-gray-200');
                    }
                });

                if (radio.checked) {
                    parentDiv.classList.add('bg-slate-200', 'text-grey-900', 'border-slate-600');
                    parentDiv.classList.remove('bg-white', 'text-black', 'ring-black', 'border-gray-200');
                    formaPagamentoSelecionada = parentDiv.id;

                    // Verifica se a opção selecionada é "Dinheiro" e mostra o campo de entrada de troco correspondente
                    if (formaPagamentoSelecionada === "dinheiro") {
                        if (trocoInput) {
                            trocoInput.classList.remove('hidden');
                        }
                    } else {
                        // Se a opção selecionada não for "Dinheiro", esconde o campo de entrada de troco
                        trocoInput.classList.add('hidden');
                    }
                } else {
                    parentDiv.classList.remove('bg-slate-200', 'text-grey-900', 'border-slate-600');
                    parentDiv.classList.add('bg-white', 'text-black', 'ring-black', 'border-gray-200');
                }
            }
        }
    });
});

const trocoInput = document.getElementById('troco');
trocoInput.addEventListener('input', function(event) {
    // Remove todos os caracteres que não são números
    const valor = this.value.replace(/\D/g, '');
    // Formata o valor com duas casas decimais
    const valorFormatado = (parseFloat(valor) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    // Atualiza o valor do input com a máscara
    this.value = valorFormatado;
});

function verificarTroco(trocoValue, totalPedido, formaPagamentoSelecionada) {

    console.log(trocoValue);
    console.log(formaPagamentoSelecionada)

     // Verificar se foi escolhida uma forma de pagamento
     if (formaPagamentoSelecionada === "") {
        mostrarToast("Por favor, selecione uma forma de pagamento.");
        return false;
    }

    // Verificar se a forma de pagamento é dinheiro e se o troco é menor que o total do pedido
    if (formaPagamentoSelecionada === "dinheiro" && (trocoValue === '' || isNaN(trocoValue))) {
        mostrarToast("Por favor, insira um valor para o troco.");
        return false;
    }

    if (formaPagamentoSelecionada === "dinheiro") {
        const troco = parseInt(trocoValue * 100); // Convertendo para centavos
        const total = parseInt(totalPedido * 100); // Convertendo para centavos

        if (troco < total) {
            mostrarToast("O valor de troco é menor que o total do pedido.");
            return false;
        }
    }

    return true;
}

function resetarPagamento() {
    // Limpar o valor do input de troco
    trocoInput.value = '';

    // Resetar a opção de pagamento selecionada
    formaPagamentoSelecionada = '';

    // Desmarcar a opção de pagamento selecionada e resetar os estilos
    paymentOptions.forEach(option => {
        const radio = option.querySelector('input[type="radio"][name="payment"]');
        if (radio) {
            radio.checked = false;
            option.classList.remove('bg-slate-200', 'text-grey-900', 'border-slate-600');
            option.classList.add('bg-white', 'text-black', 'ring-black', 'border-gray-200');
        }
    });
}


finishBtn.addEventListener("click", async function() {
    const formaPagamentoCapitalizada = formaPagamentoSelecionada.charAt(0).toUpperCase() + formaPagamentoSelecionada.slice(1);
    const trocoValue = parseFloat(trocoInput.value.trim().replace('R$', '').replace(',', '.')).toFixed(2);
    const totalPedido = parseFloat(cartTotal.textContent.trim().replace('R$', '').replace(',', '.')).toFixed(2);

    // Verificar o troco
    if (!verificarTroco(trocoValue, totalPedido, formaPagamentoSelecionada)) {
        return;
    }

    // Se a verificação do troco passar, prosseguir com o restante do código...
    const trocoDevolvido = trocoValue - totalPedido;

    // ENVIA O PEDIDO PARA API WHATS
    const cartItems = cart.map((item) => {
        return (
            `\n${item.name} - Quantidade: ${item.quantity} - Preço: R$ ${item.price.toFixed(2)}`
        )
    }).join("")

    let mensagem = `Cliente: ${nameInput.value}\nPedido recebido:${cartItems}\nValor total: ${totalPedido}\nForma de pagamento: ${formaPagamentoCapitalizada}\nTroco para: R$ ${trocoValue}\nTroco a ser devolvido: R$ ${trocoDevolvido.toFixed(2)}`

    const deliveryOption = document.getElementById("delivery");
    const isDeliverySelected = deliveryOption.querySelector('input[type="radio"][name="address"]').checked;
    let enderecoCompleto = "";
    if(isDeliverySelected ){
        enderecoCompleto = `${document.getElementById("endereco").value}, ${document.getElementById("numero").value}, ${document.getElementById("bairro").value}, ${document.getElementById("cidade").value}, ${document.getElementById("estado").value}`;
        mensagem += `\nEndereço de entrega: ${enderecoCompleto}`;
    }else{
        mensagem += "\nForma de Entrega: Retirada no Local";
    }

    // Constrói a mensagem para enviar via WhatsApp
    const mensagemCodificada = encodeURIComponent(mensagem);

    // Número de telefone do destinatário (substitua com o número da loja)
    const numero = "42999999999";

    // Constrói a URL do WhatsApp com a mensagem pré-preenchida
    const urlWhatsapp = `https://wa.me/${numero}?text=${mensagemCodificada}`;

    // Abre a URL do WhatsApp em uma nova janela
    window.open(urlWhatsapp, "_blank");
    paymentModal.style.display = "none";

    cart = [];
    updateCartModal();

    mostrarToast("Pedido finalizado com sucesso!", "success");

    // Resetar os inputs de pagamento e a opção selecionada chamando a função resetarPagamento
    resetarPagamento();

});