const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Inicializa o cliente com autenticação local para manter a sessão salva
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true, // Sem interface gráfica
        args: ['--no-sandbox'], // Melhor compatibilidade
    },
});

// Função para enviar mensagens com um atraso simulado
async function enviarMensagemComDelay(to, message, delay = 2000) {
    await new Promise(resolve => setTimeout(resolve, delay));
    client.sendMessage(to, message);
}

// Fluxo inicial: Conectar e exibir QR Code
client.on('qr', (qr) => {
    console.log('Escaneie este QR Code com seu WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot conectado com sucesso!');
});

// Função para lidar com as mensagens recebidas
client.on('message', async (msg) => {
    const texto = msg.body.toLowerCase(); // Para padronizar

    if (/^oi|olá|ola$/i.test(texto)) {
        const mensagemBoasVindas = 
            `Seja bem-vindo(a) à NexTurbo Provedor de Internet! ` +
            `Estamos ansiosos para atendê-lo(a). Eu sou o Jhin, seu Assistente Virtual!\n\n` +
            `Como posso ajudar você?\n` +
            `1️⃣ Novo cliente\n2️⃣ Suporte\n3️⃣ Financeiro`;

        await enviarMensagemComDelay(msg.from, mensagemBoasVindas, 1500);

    } else if (/1|novo cliente|conhecer planos|planos|valores|preços/i.test(texto)) {
        const mensagemPlanos =
            `Trabalhamos com os seguintes planos *100% fibra*:\n\n` +
            `*100 Megas* por apenas R$ 59,00 mensal.\n` +
            `*250 Megas* por apenas R$ 69,00 mensal.\n` +
            `*400 Megas* por apenas R$ 89,00 mensal.\n` +
            `*500 Megas* por apenas R$ 119,00 mensal. (Valor Promocional)\n\n` +
            `Instalação e Soluções de personalização com suas necessidades:\n` +
            `• Casa conectada - wifi na casa toda.\n` +
            `• Link para professor - mais upload para aulas.\n` +
            `• Link para YouTubers ou transmissões em geral com mais upload.\n` +
            `• Conexão direta para Home Office, mais velocidade e estabilidade.\n` +
            `• Para Gamers, as melhores rotas e com o melhor ping.\n\n` +
            `*INSTALAÇÃO EM 24 HORAS*\n` +
            `*Suporte local em 1 hora. Suporte telefônico 24 horas.*\n\n` +
            `Pagamento no boleto com vencimento dia 5 ou 10.\n` +
            `Pode ser pago em: Lotérica, Bancos, Caixa eletrônico, Internet bank ou PIX.`;

        await enviarMensagemComDelay(msg.from, mensagemPlanos, 1500);

    } else if (/2|suporte|ajuda|problema|sem internet|caiu internet/i.test(texto)) {
        const mensagemSuporte =
            `Antes de encaminhar para um especialista, por favor, faça os seguintes procedimentos:\n\n` +
            `🔹 Primeiro, verifique se os equipamentos estão ligados e emitindo luzes.\n` +
            `🔹 Segundo, veja se todos os cabos estão bem conectados.\n` +
            `🔹 Terceiro, verifique se há alguma luz vermelha piscando nos equipamentos ` +
            `(ONU ou roteador).\n` +
            `🔹 Quarto, desligue todos os equipamentos, espere 10 segundos e ligue novamente.\n\n` +
            `♦️ Se o problema continuar, digite: "Sem conexão".`;

        await enviarMensagemComDelay(msg.from, mensagemSuporte, 1500);

    } else if (/3|financeiro|pagamento|quero pagar|pix|boleto|fatura/i.test(texto)) {
        const mensagemFinanceiro =
            `Está precisando efetuar o pagamento? ` +
            `Vou te encaminhar para o financeiro, onde irão enviar o boleto para pagamento. Obrigado!`;

        await enviarMensagemComDelay(msg.from, mensagemFinanceiro, 1500);
    }

    // Mensagem final após 5 minutos sem resposta
    setTimeout(async () => {
        const historico = await client.getChatById(msg.from);
        if (historico.lastMessage.id.id === msg.id.id) {
            const mensagemAgradecimento =
                `Nós da NexTurbo agradecemos o contato e estaremos aqui para o que precisar!\n` +
                `Precisou, é só chamar!`;
            await enviarMensagemComDelay(msg.from, mensagemAgradecimento);
        }
    }, 300000); // 300000ms = 5 minutos
});

// Inicializa o cliente
client.initialize();
