/**
 * ORBIEX TIKTOK SHOP DEEP KNOWLEDGE BASE & OPERATING ENGINE
 * 
 * Manual técnico completo, heurísticas e inteligência operacional exclusiva
 * para TikTok Shop (Brasil, EUA, UK e Global).
 * Inclui o Módulo Especialista: VENDAS E VIRALIZAÇÃO SEM APARECER (FACELESS).
 */

const TIKTOK_SHOP_POLICIES = {
  shopPerformanceScore: {
    name: 'SPS (Shop Performance Score)',
    max: 5.0,
    safeThreshold: 4.2,
    criticalThreshold: 3.5,
    metrics: [
      { id: 'ODR', name: 'Order Defect Rate', target: '< 1.0%', critical: '> 2.0%', impact: 'Suspensão de conta e perda da sacolinha amarela' },
      { id: 'LDR', name: 'Late Dispatch Rate', target: '< 4.0%', critical: '> 8.0%', impact: 'Redução do alcance na aba Shop e vídeos' },
      { id: 'CCR', name: 'Cancellation by Seller Rate', target: '< 1.5%', critical: '> 2.5%', impact: 'Perda de elegibilidade para campanhas oficiais' },
      { id: 'RRR', name: 'Return & Refund Rate', target: '< 3.0%', critical: '> 6.0%', impact: 'Flag de qualidade baixa de produto' },
      { id: 'CRR', name: 'Chat Response Rate (24h)', target: '> 90%', critical: '< 75%', impact: 'Queda direta no score da loja' }
    ]
  },
  violationPoints: {
    system: 'Sistema cumulativo de 48 pontos por 180 dias rotativos',
    tiers: [
      { points: 12, penalty: 'Bloqueio de listagem de novos produtos por 3 a 7 dias' },
      { points: 24, penalty: 'Remoção temporária da sacolinha amarela e bloqueio de tráfego pago' },
      { points: 36, penalty: 'Suspensão total de vendas e congelamento de pagamentos por 14 dias' },
      { points: 48, penalty: 'Encerramento definitivo da loja (Permanent Ban) e retenção de saldo por 90 dias' }
    ],
    bannedWords: [
      'cura', 'milagroso', 'emagreça 10kg', 'rejuvenesce 20 anos', '100% garantido',
      'fique rico', 'réplica', 'primeira linha', 'original de fábrica (quando não é)',
      'sem autorização de marca', 'antes e depois extremo', 'pele perfeita instantânea'
    ]
  },
  trafficPillars: {
    vsa: 'Video Shopping Ads - Anúncios em vídeo com sacola vinculada e otimização por GMV',
    lsa: 'LIVE Shopping Ads - Tráfego direcionado para transmissões ao vivo com produtos fixados',
    gmvMax: 'GMV Max Campaigns - Algoritmo autônomo do TikTok que otimiza automaticamente criativos, lances e audiência para maximizar o faturamento bruto da loja',
    sparkAds: 'Spark Ads com Código de Autorização - Impulsionamento de vídeos orgânicos de criadores/afiliados mantendo comentários e engajamento nativo'
  },
  affiliateSystem: {
    openPlan: 'Plano Aberto: Qualquer criador elegível pode pegar o produto na vitrine e promover por comissão pré-definida (15%-25%)',
    targetPlan: 'Plano Direcionado: Parcerias fechadas com criadores específicos oferecendo comissões maiores (25%-35%) e amostras grátis prioritárias',
    freeSampleRules: 'Envio de amostras grátis condicionado ao criador postar em até 14 dias após o recebimento'
  },
  facelessSystem: {
    name: 'Metodologia Faceless / Sem Aparecer para TikTok Shop',
    coreFormats: [
      {
        id: 'pov_hands',
        name: 'POV / Mãos em Ação (Hands-Only UGC)',
        description: 'Câmera em primeira pessoa focando apenas nas mãos abrindo, testando e usando o produto sobre uma bancada limpa ou cenário cotidiano.',
        conversionRate: '8.8% na sacolinha',
        keyTrigger: 'Sensação tátil e demonstração de facilidade sem distrações faciais'
      },
      {
        id: 'asmr_sensory',
        name: 'ASMR Visual & Hipnótico',
        description: 'Captação com microfone próximo dos sons naturais (cliques, cortes, texturas, unboxing) com zero fala nos primeiros 10s e cortes a cada 1.2s.',
        conversionRate: '9.4% na sacolinha',
        keyTrigger: 'Retenção absurda (watch time > 85%) por efeito hipnótico satisfatório'
      },
      {
        id: 'side_by_side',
        name: 'Comparativo Lado a Lado (R$ 500 vs R$ 49)',
        description: 'Tela dividida ou comparação sequencial mostrando o método caro/difícil tradicional versus a solução prática e barata da sacolinha.',
        conversionRate: '11.2% na sacolinha',
        keyTrigger: 'Gatilho de economia extrema e sensação de descoberta inteligente'
      },
      {
        id: 'story_voiceover',
        name: 'Storytelling em Terceira Pessoa com Voz IA',
        description: 'Narrativa imersiva de IA ("Minha mãe quase chorou quando viu isso...", "Meu namorado achou que era golpe...") sobreposta a cenas dinâmicas do produto.',
        conversionRate: '7.9% na sacolinha',
        keyTrigger: 'Identificação emocional e curiosidade de fofoca'
      }
    ],
    antiDetectionRules: [
      'Corte dinâmico a cada 1.2 a 1.8 segundos para quebrar hashes de frame do algoritmo.',
      'Zoom sutil contínuo (Punch-in 105% -> 110%) para manter o cérebro engajado.',
      'Legendas palavra por palavra (Word-by-word highlight) em amarelo e branco no centro da tela.',
      'Trilha sonora comercial em tendência do TikTok em volume de fundo entre 8% e 12%.',
      'Voz de IA com pausas naturais, inflexão humana e velocidade 1.05x para evitar tom robótico.'
    ],
    yellowBasketCallouts: [
      'Gesto de corte rápido com seta gráfica animada apontando para o canto inferior esquerdo.',
      'Adesivo gráfico piscante "FRETE GRÁTIS HOJE" ou "OFERTA RELÂMPAGO".',
      'Frase de fechamento: "O link com desconto especial tá na sacolinha amarela aqui embaixo antes que o estoque esgote."'
    ]
  }
};

/**
 * Auditor de Conta e Métricas do TikTok Shop (Seller Center)
 */
function auditShopMetrics(data) {
  const odr = parseFloat(data.odr || 0.8);
  const ldr = parseFloat(data.ldr || 2.5);
  const ccr = parseFloat(data.ccr || 0.5);
  const crr = parseFloat(data.crr || 92);
  const currentPoints = parseInt(data.violationPoints || 0, 10);

  const alerts = [];
  const actions = [];
  let healthScore = 100;

  if (odr > 1.0) {
    healthScore -= 25;
    alerts.push(`🚨 ALERTA CRÍTICO: ODR em ${odr}%. Limite máximo permitido pelo TikTok Shop é 1.0%.`);
    actions.push('Identifique os 2 produtos com mais reclamações e pause-os imediatamente para conter a taxa de defeito.');
  } else {
    actions.push(`✅ ODR saudável em ${odr}% (Meta: < 1.0%).`);
  }

  if (ldr > 4.0) {
    healthScore -= 20;
    alerts.push(`⚠️ ATENÇÃO: Envio atrasado (LDR) em ${ldr}%. Meta segura é abaixo de 4.0%.`);
    actions.push('Diminua o tempo de despacho para menos de 24h ou integre automação de etiquetas para liberar o código de rastreio em D+1.');
  } else {
    actions.push(`✅ Despacho e rastreio dentro do prazo (${ldr}%).`);
  }

  if (currentPoints >= 12) {
    healthScore -= 30;
    alerts.push(`🚨 RISCO DE CONTA: Você possui ${currentPoints}/48 pontos de violação ativos.`);
    actions.push('Abra contestações formais para as violações dos últimos 30 dias com notas fiscais e comprovantes de autorização de marca.');
  }

  if (crr < 85) {
    healthScore -= 15;
    alerts.push(`⚠️ Chat de atendimento em ${crr}%. O TikTok exige no mínimo 90% em até 24h.`);
    actions.push('Ative respostas automáticas no Seller Center e configure equipe de plantão para manter a taxa > 95%.');
  }

  return {
    shopHealthScore: Math.max(10, healthScore),
    status: healthScore >= 80 ? 'Excelente (Conta Forte)' : healthScore >= 60 ? 'Alerta (Risco Moderado)' : 'Crítico (Risco de Banimento)',
    alerts: alerts,
    operationalRoadmap: actions,
    timestamp: new Date().toISOString()
  };
}

/**
 * Gerador de Contestação de Violação
 */
function generateAppeal(violationType, details = '') {
  return {
    type: violationType,
    subject: `Contestação Formal de Notificação / Violação: ${violationType} — Seller ID Orbiex`,
    appealTemplate: `Prezada equipe de Operações e Compliance do TikTok Shop,

Venho por meio deste documento contestar respeitosamente a notificação referente a [${violationType}], aplicada à nossa loja.

1. Conformidade e Documentação:
Nossa operação atua em estrita conformidade com as Políticas de Vendedores do TikTok Shop. O produto e criativo em questão são 100% legítimos, com estoque próprio e notas fiscais de aquisição comprovadas em anexo.

2. Ação Corretiva Imediata:
${details || 'Revisamos integralmente a listagem, títulos, tags e criativos vinculados, assegurando que não há alegações proibidas ou promessas exageradas segundo as diretrizes de compliance.'}

3. Métricas de Serviço:
Mantemos nosso ODR estritamente abaixo de 1.0% e taxa de despacho em até 24h, demonstrando nosso compromisso com a experiência do consumidor final no TikTok.

Solicitamos a revisão manual por um analista e a remoção dos pontos de violação correspondentes para restabelecer a normalidade operacional da conta.

Atenciosamente,
Gerência de Operações da Loja`,
    recommendedAttachments: [
      'Nota Fiscal de compra/fabricação do produto',
      'Fotos reais do estoque com data e logo da loja',
      'Certificados de conformidade (Anvisa/Inmetro ou equivalente se aplicável)',
      'Captura de tela do criativo sem alegações restritas'
    ]
  };
}

/**
 * Gerador de Abordagem para Criadores & Afiliados do TikTok Shop
 */
function generateAffiliatePitch(productName, commissionRate = '20%') {
  return {
    product: productName,
    commission: commissionRate,
    dmPitch: `Oii! Adorei o seu conteúdo e o engajamento do seu perfil! 🤩

Temos o **${productName}**, que é um dos produtos com maior tração na sacolinha amarela do TikTok Shop hoje (conversão média acima de 8.5%).

Gostaríamos de te enviar uma **Amostra Grátis 100% por nossa conta** + comissão exclusiva de **${commissionRate}** por cada venda que sair no seu vídeo.

Topa receber essa semana para gravar? Só me confirma seu endereço e tamanho se necessário que já libero o envio no Seller Center! 🚀`,
    followUpScript: `Oi! Só passando para avisar que a sua amostra do ${productName} já foi despachada! Assim que chegar me avisa para eu te mandar as 3 ideias de roteiro que mais estão convertendo na sacolinha hoje ❤️`
  };
}

/**
 * Gerador Completo de Roteiro e Direção de Vídeo SEM APARECER (Faceless)
 */
function generateFacelessScript(productName, formatType = 'pov_hands') {
  const prod = productName || 'Mini Selador Térmico Portátil';

  const scripts = {
    pov_hands: {
      format: 'POV / Mãos em Ação (Hands-Only UGC)',
      visualGuidance: 'Câmera fixa posicionada de cima para baixo (top-down) ou em primeira pessoa na altura do peito. Mãos limpas manipulando o produto sobre mesa estética.',
      timeline: [
        {
          timestamp: '00:00 - 00:03',
          visual: 'Mão tentando fechar um pacote aberto do jeito tradicional e derramando tudo (frustração visual com som de erro). Corte seco para a mão pegando o ' + prod + '.',
          voiceover: 'Pare de estragar comida jogando pacote aberto na geladeira...',
          audioEffect: 'Efeito sonoro de queda + zoom rápido (punch-in 110%)'
        },
        {
          timestamp: '00:03 - 00:12',
          visual: 'Mão passando o ' + prod + ' lentamente na borda do pacote com luz LED acesa. Som de selagem imediata (estalo satisfatório).',
          voiceover: 'Esse mini selador fecha qualquer embalagem hermeticamente em menos de 2 segundos com calor térmico.',
          audioEffect: 'Som ASMR de clique elétrico e estalo perfeito'
        },
        {
          timestamp: '00:12 - 00:22',
          visual: 'Mão virando o pacote selado de cabeça para baixo e chacoalhando forte (mostrando que não vaza nada).',
          voiceover: 'Fica 100% vedado como se tivesse acabado de sair do supermercado, e ainda cabe no bolso.',
          audioEffect: 'Trilha lo-fi / batida viral de fundo em volume 10%'
        },
        {
          timestamp: '00:22 - 00:30',
          visual: 'Dedo da mão apontando diretamente para o canto inferior esquerdo onde a sacolinha amarela aparece piscando. Texto na tela: "LOTE COM FRETE GRÁTIS".',
          voiceover: 'O lote com desconto e frete grátis tá na sacolinha amarela aqui embaixo antes de zerar o estoque!',
          audioEffect: 'Efeito sonoro de "ding" de caixa registradora'
        }
      ],
      aiVoiceSettings: {
        voiceType: 'Jovem adulto expressivo e natural (estilo ElevenLabs / TikTok TTS)',
        pacing: '1.05x (dinâmico, sem pausas arrastadas)',
        tone: 'Amigável, revelador e entusiasmado'
      }
    },
    asmr_sensory: {
      format: 'ASMR Visual e Sonoro Hipnótico',
      visualGuidance: 'Microfone condensador visível na bancada. Iluminação suave e cortes rápidos focados nos sons de unboxing, clique e textura do produto.',
      timeline: [
        {
          timestamp: '00:00 - 00:03',
          visual: 'Unhas batendo suavemente na caixa (tapping) + abertura rápida do lacre com som nítido.',
          voiceover: '(Sem voz nos primeiros 3s — apenas o som hipnótico do unboxing com legenda: "Achadinho que salvou minha rotina")',
          audioEffect: 'Som ASMR hiper-nítido de plástico e clique mecânico'
        },
        {
          timestamp: '00:03 - 00:15',
          visual: 'Teste prático do ' + prod + ' em funcionamento com macro zoom nos detalhes.',
          voiceover: 'Se você ama praticidade, olha a perfeição disso funcionando...',
          audioEffect: 'Som ambiente amplificado sem música alta'
        },
        {
          timestamp: '00:15 - 00:30',
          visual: 'Produto posicionado ao lado da sacolinha amarela com o preço promocional na legenda.',
          voiceover: 'Tá na sacolinha amarela com cupom ativo hoje.',
          audioEffect: 'Som suave de confirmação'
        }
      ],
      aiVoiceSettings: {
        voiceType: 'Voz suave, calma e persuasiva',
        pacing: '1.0x',
        tone: 'Satisfatório e intimista'
      }
    }
  };

  const selected = scripts[formatType] || scripts.pov_hands;

  return {
    status: 'success',
    engine: 'Orbiex Faceless Viral Engine',
    product: prod,
    format: selected.format,
    visualGuidance: selected.visualGuidance,
    aiVoiceSettings: selected.aiVoiceSettings,
    timeline: selected.timeline,
    editingChecklist: [
      'Cortar pausas e respirações da voz de IA',
      'Inserir legenda amarela em fonte negrito (Proxima Nova / Montserrat) no centro da tela',
      'Colocar seta animada piscando em direção à sacolinha amarela aos 22 segundos',
      'Exportar em 1080x1920 (9:16) a 60fps'
    ],
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  TIKTOK_SHOP_POLICIES,
  auditShopMetrics,
  generateAppeal,
  generateAffiliatePitch,
  generateFacelessScript
};
