// Função para salvar e exibir configuração do dispositivo
function saveDeviceConfig() {
    // Capturar valores dos campos
    const deviceDescription = document.getElementById('deviceDescription').value;
    const deviceIp = document.getElementById('deviceIp').value;
    const deviceOid = document.getElementById('deviceOid').value;

    // Validar se os campos obrigatórios estão preenchidos
    if (!deviceIp || !deviceOid) {
        alert('Por favor, preencha o Endereço IP e o Valor OID.');
        return;
    }

    // Verificar se já existe um container, se não existir, criar o cabeçalho
    const container = document.getElementById('savedDataContainer');
    if (container.innerHTML.trim() === '') {
        container.innerHTML = '<h3>📊 Configurações SNMP Salvas</h3>';
    }

    // Criar um novo item de configuração
    const configId = Date.now(); // ID único baseado no timestamp
    const newConfigHtml = `
        <div class="config-item" id="config-${configId}" style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 15px; margin-bottom: 15px; border-left: 4px solid #2ecc71;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="color: #2ecc71; margin: 0;">Configuração #${getConfigCount() + 1}</h4>
                <button onclick="removeConfig('config-${configId}')" style="background: #e74c3c; border: none; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 12px;">Remover</button>
            </div>
            <div class="info-grid">
                <div class="info-item">
                    <span>Endereço IP:</span>
                    <span>${deviceIp}</span>
                </div>
                <div class="info-item">
                    <span>OID:</span>
                    <span>${deviceOid}</span>
                </div>
                <div class="info-item">
                    <span>Descrição:</span>
                    <span>${deviceDescription}</span>
                </div>
            </div>
        </div>
    `;

    // Adicionar a nova configuração ao container
    container.insertAdjacentHTML('beforeend', newConfigHtml);

    // Limpar os campos após salvar
    document.getElementById('deviceIp').value = '';
    document.getElementById('deviceOid').value = '';
    const snmpVersionElement = document.getElementById('snmpVersion');
    if (snmpVersionElement) {
        snmpVersionElement.selectedIndex = 0;
    }
    document.getElementById('deviceDescription').value = '';

    // Feedback visual
    alert('Configuração adicionada com sucesso!');
}

// Função para contar quantas configurações já existem
function getConfigCount() {
    return document.querySelectorAll('.config-item').length;
}

// Função para remover uma configuração específica
function removeConfig(configId) {
    if (confirm('Tem certeza que deseja remover esta configuração?')) {
        document.getElementById(configId).remove();
        
        // Se não houver mais configurações, limpar o container
        if (getConfigCount() === 0) {
            document.getElementById('savedDataContainer').innerHTML = '';
        }
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar evento de clique no botão salvar
    document.getElementById('saveBtn').addEventListener('click', function() {
        saveDeviceConfig();
    });
});