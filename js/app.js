// Dados do evento e ingressos
const eventData = {
    title: "Festa Junina da Escola",
    date: "15 de Julho de 2024",
    time: "19:00 às 23:00",
    location: "Quadra da Escola Municipal",
    attractions: ["Quadrilha", "Forró ao vivo", "Comidas típicas", "Pescaria", "Correio elegante"]
};

const ticketTypes = {
    individual: {
        name: "Ingresso Individual",
        price: "R$ 15,00",
        priceValue: 15.00,
        description: "Entrada individual para a festa",
        available: 150,
        total: 200
    },
    combo: {
        name: "Combo Família",
        price: "R$ 40,00",
        priceValue: 40.00,
        description: "2 adultos + 2 crianças",
        available: 25,
        total: 50
    }
};

// Estado da aplicação
let isAdminMode = false;
let pendingPayments = [
    {
        id: 1,
        buyer: "João Silva",
        email: "joao@email.com",
        ticket: "Ingresso Individual",
        amount: "R$ 15,00",
        date: "10/06/2024",
        fileName: "comprovante_joao.pdf"
    }
];

// Elementos DOM
const adminToggle = document.getElementById('adminToggle');
const adminSection = document.getElementById('adminSection');
const purchaseModal = document.getElementById('purchaseModal');
const modalClose = document.getElementById('modalClose');
const cancelPurchase = document.getElementById('cancelPurchase');
const submitPurchase = document.getElementById('submitPurchase');
const fileUpload = document.getElementById('fileUpload');
const fileInput = document.getElementById('fileInput');
const fileUploadContent = document.getElementById('fileUploadContent');
const fileSelected = document.getElementById('fileSelected');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const buyerName = document.getElementById('buyerName');
const buyerEmail = document.getElementById('buyerEmail');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalQRInfo = document.getElementById('modalQRInfo');

// Estado do modal
let currentTicketType = null;
let selectedFile = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updatePendingPaymentsDisplay();
});

// Event Listeners
function initializeEventListeners() {
    // Toggle admin
    adminToggle.addEventListener('click', toggleAdminMode);
    
    // Botões de compra
    document.querySelectorAll('.purchase-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const ticketType = this.getAttribute('data-ticket');
            openPurchaseModal(ticketType);
        });
    });
    
    // Modal
    modalClose.addEventListener('click', closePurchaseModal);
    cancelPurchase.addEventListener('click', closePurchaseModal);
    submitPurchase.addEventListener('click', handlePurchaseSubmit);
    
    // Upload de arquivo
    fileUpload.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    
    // Validação de formulário
    buyerName.addEventListener('input', validateForm);
    buyerEmail.addEventListener('input', validateForm);
    
    // Fechar modal clicando fora
    purchaseModal.addEventListener('click', function(e) {
        if (e.target === purchaseModal) {
            closePurchaseModal();
        }
    });
    
    // Botões de pagamento pendente
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-receipt-btn')) {
            handleViewReceipt(e);
        } else if (e.target.classList.contains('confirm-payment-btn')) {
            handleConfirmPayment(e);
        } else if (e.target.classList.contains('reject-payment-btn')) {
            handleRejectPayment(e);
        }
    });
}

// Função para alternar modo admin
function toggleAdminMode() {
    isAdminMode = !isAdminMode;
    
    if (isAdminMode) {
        adminToggle.textContent = 'Sair Admin';
        adminToggle.className = 'btn btn-danger';
        adminSection.style.display = 'block';
        
        // Mostrar informações admin nos tickets
        document.querySelectorAll('.admin-info').forEach(info => {
            info.style.display = 'block';
        });
    } else {
        adminToggle.textContent = 'Admin';
        adminToggle.className = 'btn btn-outline';
        adminSection.style.display = 'none';
        
        // Esconder informações admin nos tickets
        document.querySelectorAll('.admin-info').forEach(info => {
            info.style.display = 'none';
        });
    }
}

// Função para abrir modal de compra
function openPurchaseModal(ticketType) {
    currentTicketType = ticketType;
    const ticket = ticketTypes[ticketType];
    
    if (!ticket) return;
    
    // Atualizar conteúdo do modal
    modalTitle.textContent = `Comprar ${ticket.name}`;
    modalPrice.textContent = ticket.price;
    modalQRInfo.textContent = `PIX: festa.junina@escola.com.br | Valor: ${ticket.price} | Ref: ${ticket.name}`;
    
    // Resetar formulário
    resetForm();
    
    // Mostrar modal
    purchaseModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Função para fechar modal de compra
function closePurchaseModal() {
    purchaseModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetForm();
}

// Função para resetar formulário
function resetForm() {
    buyerName.value = '';
    buyerEmail.value = '';
    selectedFile = null;
    fileSelected.style.display = 'none';
    fileUploadContent.style.display = 'block';
    fileUpload.style.borderColor = '';
    fileUpload.style.background = '';
    validateForm();
}

// Função para lidar com seleção de arquivo
function handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        alert('Por favor, envie apenas arquivos JPG, PNG ou PDF');
        fileInput.value = '';
        return;
    }
    
    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 5MB');
        fileInput.value = '';
        return;
    }
    
    // Arquivo válido
    selectedFile = file;
    
    // Atualizar interface
    fileName.textContent = file.name;
    fileSize.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
    
    fileUploadContent.style.display = 'none';
    fileSelected.style.display = 'flex';
    
    fileUpload.style.borderColor = 'var(--festa-green)';
    fileUpload.style.background = 'rgba(22, 163, 74, 0.05)';
    
    validateForm();
}

// Função para validar formulário
function validateForm() {
    const nameValid = buyerName.value.trim().length > 0;
    const emailValid = buyerEmail.value.trim().length > 0 && isValidEmail(buyerEmail.value);
    const fileValid = selectedFile !== null;
    
    const isValid = nameValid && emailValid && fileValid;
    
    submitPurchase.disabled = !isValid;
    
    return isValid;
}

// Função para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para lidar com envio da compra
function handlePurchaseSubmit() {
    if (!validateForm()) {
        alert('Por favor, preencha todos os campos e anexe o comprovante');
        return;
    }
    
    // Simular loading
    submitPurchase.disabled = true;
    submitPurchase.innerHTML = `
        <span style="display: inline-block; width: 16px; height: 16px; border: 2px solid white; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></span>
        Enviando...
    `;
    
    // Simular envio
    setTimeout(() => {
        const newPayment = {
            id: pendingPayments.length + 1,
            buyer: buyerName.value.trim(),
            email: buyerEmail.value.trim(),
            ticket: ticketTypes[currentTicketType].name,
            amount: ticketTypes[currentTicketType].price,
            date: new Date().toLocaleDateString('pt-BR'),
            fileName: selectedFile.name
        };
        
        pendingPayments.push(newPayment);
        updatePendingPaymentsDisplay();
        
        // Resetar botão
        submitPurchase.disabled = false;
        submitPurchase.innerHTML = `
            <span class="upload-icon-small"></span>
            Enviar Comprovante
        `;
        
        closePurchaseModal();
        alert('Comprovante enviado com sucesso! Aguarde a confirmação do pagamento.');
    }, 2000);
}

// Função para atualizar display de pagamentos pendentes
function updatePendingPaymentsDisplay() {
    const pendingContainer = document.getElementById('pendingPayments');
    const noPendingContainer = document.getElementById('noPendingPayments');
    const pendingCount = document.getElementById('pendingCount');
    
    pendingCount.textContent = pendingPayments.length;
    
    if (pendingPayments.length === 0) {
        pendingContainer.style.display = 'none';
        noPendingContainer.style.display = 'block';
    } else {
        pendingContainer.style.display = 'block';
        noPendingContainer.style.display = 'none';
        
        pendingContainer.innerHTML = pendingPayments.map(payment => `
            <div class="payment-item" data-payment-id="${payment.id}">
                <div class="payment-info">
                    <h4>${payment.buyer}</h4>
                    <p>${payment.email}</p>
                    <p>${payment.ticket} - ${payment.amount}</p>
                    <p class="payment-file">
                        <span class="file-icon"></span>
                        ${payment.fileName} - ${payment.date}
                    </p>
                </div>
                <div class="payment-actions">
                    <button class="btn btn-outline btn-sm view-receipt-btn">Ver Comprovante</button>
                    <button class="btn btn-success btn-sm confirm-payment-btn">
                        <span class="check-icon"></span>
                        Confirmar
                    </button>
                    <button class="btn btn-danger btn-sm reject-payment-btn">
                        <span class="x-icon"></span>
                        Rejeitar
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Função para visualizar comprovante
function handleViewReceipt(event) {
    const paymentItem = event.target.closest('.payment-item');
    const paymentId = parseInt(paymentItem.getAttribute('data-payment-id'));
    const payment = pendingPayments.find(p => p.id === paymentId);
    
    if (payment) {
        alert(`Visualizando comprovante: ${payment.fileName}\n\nEm um sistema real, isso abriria o arquivo para visualização.`);
    }
}

// Função para confirmar pagamento
function handleConfirmPayment(event) {
    const paymentItem = event.target.closest('.payment-item');
    const paymentId = parseInt(paymentItem.getAttribute('data-payment-id'));
    
    if (confirm('Confirmar este pagamento?')) {
        // Remover da lista de pendentes
        pendingPayments = pendingPayments.filter(p => p.id !== paymentId);
        updatePendingPaymentsDisplay();
        
        // Atualizar contador de ingressos (simulação)
        updateTicketCounter();
        
        alert('Pagamento confirmado com sucesso!');
    }
}

// Função para rejeitar pagamento
function handleRejectPayment(event) {
    const paymentItem = event.target.closest('.payment-item');
    const paymentId = parseInt(paymentItem.getAttribute('data-payment-id'));
    
    if (confirm('Rejeitar este pagamento?')) {
        // Remover da lista de pendentes
        pendingPayments = pendingPayments.filter(p => p.id !== paymentId);
        updatePendingPaymentsDisplay();
        
        alert('Pagamento rejeitado.');
    }
}

// Função para atualizar contador de ingressos
function updateTicketCounter() {
    // Simular venda de um ingresso
    // Em um sistema real, isso seria baseado no tipo de ingresso confirmado
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const currentWidth = parseInt(bar.style.width) || 25;
        const newWidth = Math.min(currentWidth + 1, 100);
        bar.style.width = `${newWidth}%`;
    });
}

// Adicionar animação de loading CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Função para gerar QR Code simples (placeholder)
function generateQRCode(ticketType) {
    const ticket = ticketTypes[ticketType];
    return `PIX: festa.junina@escola.com.br | Valor: ${ticket.price} | Ref: ${ticket.name}`;
}

// Função para formatar moeda
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Função para formatar data
function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR').format(date);
}

// Função para debounce (otimização)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Adicionar validação em tempo real com debounce
const debouncedValidation = debounce(validateForm, 300);
buyerName.addEventListener('input', debouncedValidation);
buyerEmail.addEventListener('input', debouncedValidation);

// Função para lidar com tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && purchaseModal.style.display === 'flex') {
        closePurchaseModal();
    }
});

// Função para prevenir envio do formulário com Enter
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
        event.preventDefault();
        if (validateForm()) {
            handlePurchaseSubmit();
        }
    }
});

// Função para smooth scroll (se necessário)
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Função para mostrar notificações (placeholder)
function showNotification(message, type = 'info') {
    // Em um sistema real, isso seria uma notificação toast
    console.log(`${type.toUpperCase()}: ${message}`);
}

// Função para log de eventos (analytics placeholder)
function logEvent(eventName, data = {}) {
    console.log(`Event: ${eventName}`, data);
}

// Log de inicialização
logEvent('page_loaded', {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
});

// Função para detectar dispositivo móvel
function isMobile() {
    return window.innerWidth <= 768;
}

// Ajustar comportamento para mobile
if (isMobile()) {
    // Adicionar classe para estilos específicos de mobile
    document.body.classList.add('mobile');
}

// Listener para mudanças de orientação/tamanho
window.addEventListener('resize', debounce(function() {
    if (isMobile()) {
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
    }
}, 250));

// Função para salvar dados no localStorage (persistência local)
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
    }
}

// Função para carregar dados do localStorage
function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Erro ao carregar do localStorage:', error);
        return null;
    }
}

// Salvar estado dos pagamentos pendentes
function savePendingPayments() {
    saveToLocalStorage('pendingPayments', pendingPayments);
}

// Carregar estado dos pagamentos pendentes
function loadPendingPayments() {
    const saved = loadFromLocalStorage('pendingPayments');
    if (saved && Array.isArray(saved)) {
        pendingPayments = saved;
        updatePendingPaymentsDisplay();
    }
}

// Carregar dados salvos na inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadPendingPayments();
});

// Salvar dados quando houver mudanças
function updatePendingPaymentsWithSave() {
    updatePendingPaymentsDisplay();
    savePendingPayments();
}

// Substituir chamadas diretas por versões que salvam
// (isso seria feito nas funções de confirmar/rejeitar pagamento)

