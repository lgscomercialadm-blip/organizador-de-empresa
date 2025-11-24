import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create Admin User
  console.log('Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@arcsys.com' },
    update: {},
    create: {
      email: 'admin@arcsys.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // 2. Create Product: Assessoria Geral
  console.log('Creating product: Assessoria Geral...');
  const product = await prisma.product.upsert({
    where: { name: 'Assessoria Geral' },
    update: {},
    create: {
      name: 'Assessoria Geral',
      description: 'Assessoria completa de marketing digital e gestão',
      isActive: true,
    },
  });
  console.log('✅ Product created:', product.name);

  // 3. Create Phase Templates
  console.log('Creating phase templates...');

  // Fase 1 - Entrada / Cadastro (INTERNAL)
  const phase1 = await prisma.phaseTemplate.create({
    data: {
      productId: product.id,
      name: 'Entrada / Cadastro',
      description: 'Registro inicial do cliente no sistema',
      order: 0,
      visibility: 'INTERNAL',
      deadlineType: 'RELATIVE_DAYS',
      deadlineDays: 0, // D+0
      recurrence: 'ONCE',
    },
  });

  await prisma.actionTemplate.createMany({
    data: [
      {
        phaseTemplateId: phase1.id,
        title: 'Registrar cliente no sistema',
        description: 'Cadastrar dados básicos do cliente',
        order: 0,
        visibility: 'INTERNAL',
        deadlineType: 'RELATIVE_DAYS',
        deadlineDays: 0,
        recurrence: 'ONCE',
      },
      {
        phaseTemplateId: phase1.id,
        title: 'Definir produto contratado',
        description: 'Identificar qual produto/serviço foi contratado',
        order: 1,
        visibility: 'INTERNAL',
        deadlineType: 'RELATIVE_DAYS',
        deadlineDays: 0,
        recurrence: 'ONCE',
      },
      {
        phaseTemplateId: phase1.id,
        title: 'Vincular consultor responsável',
        description: 'Designar consultor que acompanhará o cliente',
        order: 2,
        visibility: 'INTERNAL',
        deadlineType: 'RELATIVE_DAYS',
        deadlineDays: 0,
        recurrence: 'ONCE',
      },
    ],
  });

  // Fase 2 - Contratual (INTERNAL)
  const phase2 = await prisma.phaseTemplate.create({
    data: {
      productId: product.id,
      name: 'Contratual',
      description: 'Processamento de contratos e documentação',
      order: 1,
      visibility: 'INTERNAL',
      deadlineType: 'RELATIVE_DAYS',
      deadlineDays: 1, // D+1
      recurrence: 'ONCE',
    },
  });

  await prisma.actionTemplate.createMany({
    data: [
      {
        phaseTemplateId: phase2.id,
        title: 'Gerar contrato',
        description: 'Criar documento de contrato personalizado',
        order: 0,
        visibility: 'INTERNAL',
        deadlineType: 'RELATIVE_DAYS',
        deadlineDays: 1,
        recurrence: 'ONCE',
      },
      {
        phaseTemplateId: phase2.id,
        title: 'Enviar contrato para assinatura',
        description: 'Encaminhar contrato para o cliente assinar',
        order: 1,
        visibility: 'INTERNAL',
        deadlineType: 'RELATIVE_DAYS',
        deadlineDays: 1,
        recurrence: 'ONCE',
      },
      {
        phaseTemplateId: phase2.id,
        title: 'Receber contrato assinado',
        description: 'Confirmar recebimento do contrato assinado',
        order: 2,
        visibility: 'INTERNAL',
        deadlineType: 'RELATIVE_DAYS',
        deadlineDays: 1,
        recurrence: 'ONCE',
      },
      {
        phaseTemplateId: phase2.id,
        title: 'Lançar no financeiro',
        description: 'Registrar dados financeiros do contrato',
        order: 3,
        visibility: 'INTERNAL',
        deadlineType: 'RELATIVE_DAYS',
        deadlineDays: 1,
        recurrence: 'ONCE',
      },
    ],
  });

  // Fase 3 - Onboarding (VISIBLE_TO_CLIENT)
  const phase3 = await prisma.phaseTemplate.create({
    data: {
      productId: product.id,
      name: 'Onboarding',
      description: 'Integração inicial do cliente',
      order: 2,
      visibility: 'VISIBLE_TO_CLIENT',
      deadlineType: 'RELATIVE_DAYS',
      deadlineDays: 5, // D+5
      recurrence: 'ONCE',
    },
  });

  await prisma.actionTemplate.createMany({
    data: [
      {
        phaseTemplateId: phase3.id,
        title: 'Mensagem de boas-vindas',
        description: 'Enviar mensagem de boas-vindas personalizada ao cliente',
        order: 0,
        visibility: 'VISIBLE_TO_CLIENT',
        deadlineType: 'RELATIVE_DAYS',
        deadlineDays: 3,
        recurrence: 'ONCE',
      },
      {
        phaseTemplateId: phase3.id,
        title: 'Criar grupo de WhatsApp',
        description: 'Criar grupo para comunicação com o cliente',
        order: 1,
        visibility: 'VISIBLE_TO_CLIENT',
        deadlineType: 'RELATIVE_DAYS',
        deadlineDays: 3,
        recurrence: 'ONCE',
      },
      {
        phaseTemplateId: phase3.id,
        title: 'Explicar o fluxo de trabalho',
        description: 'Apresentar metodologia e cronograma ao cliente',
        order: 2,
        visibility: 'VISIBLE_TO_CLIENT',
        deadlineType: 'RELATIVE_DAYS',
        deadlineDays: 5,
        recurrence: 'ONCE',
      },
      {
        phaseTemplateId: phase3.id,
        title: 'Enviar formulário inicial',
        description: 'Enviar questionário para conhecer melhor o negócio',
        order: 3,
        visibility: 'VISIBLE_TO_CLIENT',
        deadlineType: 'RELATIVE_DAYS',
        deadlineDays: 5,
        recurrence: 'ONCE',
      },
    ],
  });

  // Fase 4 - Coleta de Informações e Acessos (VISIBLE_TO_CLIENT)
  const phase4 = await prisma.phaseTemplate.create({
    data: {
      productId: product.id,
      name: 'Coleta de Informações e Acessos',
      description: 'Coleta de dados e acessos necessários',
      order: 3,
      visibility: 'VISIBLE_TO_CLIENT',
      deadlineType: 'RELATIVE_DAYS',
      deadlineDays: 7, // D+7
      recurrence: 'ONCE',
    },
  });

  await prisma.actionTemplate.createMany({
    data: [
      {
        phaseTemplateId: phase4.id,
        title: 'Receber formulário preenchido',
        description: 'Confirmar recebimento do formulário inicial',
        order: 0,
        visibility: 'VISIBLE_TO_CLIENT',
        deadlineType: 'RELATIVE_DAYS',
        deadlineDays: 7,
        recurrence: 'ONCE',
      },
      {
        phaseTemplateId: phase4.id,
        title: 'Solicitar acessos às plataformas',
        description: 'Pedir acessos a redes sociais, ADS, analytics, etc.',
        order: 1,
        visibility: 'VISIBLE_TO_CLIENT',
        deadlineType: 'RELATIVE_DAYS',
        deadlineDays: 7,
        recurrence: 'ONCE',
      },
      {
        phaseTemplateId: phase4.id,
        title: 'Receber planilha de custos',
        description: 'Obter informação sobre investimentos atuais',
        order: 2,
        visibility: 'VISIBLE_TO_CLIENT',
        deadlineType: 'RELATIVE_DAYS',
        deadlineDays: 7,
        recurrence: 'ONCE',
      },
      {
        phaseTemplateId: phase4.id,
        title: 'Solicitar fotos e materiais',
        description: 'Pedir fotos, logos, materiais de marca',
        order: 3,
        visibility: 'VISIBLE_TO_CLIENT',
        deadlineType: 'RELATIVE_DAYS',
        deadlineDays: 7,
        recurrence: 'ONCE',
      },
    ],
  });

  // Fase 5 - Diagnóstico + Kick-off (VISIBLE_TO_CLIENT)
  const phase5 = await prisma.phaseTemplate.create({
    data: {
      productId: product.id,
      name: 'Diagnóstico + Kick-off',
      description: 'Análise inicial e reunião de kick-off',
      order: 4,
      visibility: 'VISIBLE_TO_CLIENT',
      deadlineType: 'RELATIVE_DAYS',
      deadlineDays: 10, // D+10
      recurrence: 'ONCE',
    },
  });

  await prisma.actionTemplate.createMany({
    data: [
      {
        phaseTemplateId: phase5.id,
        title: 'Análise inicial',
        description: 'Analisar dados coletados e situação atual',
        order: 0,
        visibility: 'INTERNAL',
        deadlineType: 'RELATIVE_DAYS',
        deadlineDays: 9,
        recurrence: 'ONCE',
      },
      {
        phaseTemplateId: phase5.id,
        title: 'Preparar diagnóstico',
        description: 'Criar documento com diagnóstico e oportunidades',
        order: 1,
        visibility: 'INTERNAL',
        deadlineType: 'RELATIVE_DAYS',
        deadlineDays: 10,
        recurrence: 'ONCE',
      },
      {
        phaseTemplateId: phase5.id,
        title: 'Agendar call de kick-off',
        description: 'Marcar reunião inicial com o cliente',
        order: 2,
        visibility: 'VISIBLE_TO_CLIENT',
        deadlineType: 'RELATIVE_DAYS',
        deadlineDays: 10,
        recurrence: 'ONCE',
      },
      {
        phaseTemplateId: phase5.id,
        title: 'Realizar kick-off',
        description: 'Executar reunião de alinhamento e apresentação do diagnóstico',
        order: 3,
        visibility: 'VISIBLE_TO_CLIENT',
        deadlineType: 'RELATIVE_DAYS',
        deadlineDays: 10,
        recurrence: 'ONCE',
      },
      {
        phaseTemplateId: phase5.id,
        title: 'Criar plano de ação',
        description: 'Definir estratégias e próximos passos',
        order: 4,
        visibility: 'VISIBLE_TO_CLIENT',
        deadlineType: 'RELATIVE_DAYS',
        deadlineDays: 10,
        recurrence: 'ONCE',
      },
    ],
  });

  // Fase 6 - Operação (VISIBLE_TO_CLIENT)
  const phase6 = await prisma.phaseTemplate.create({
    data: {
      productId: product.id,
      name: 'Operação - Rotina',
      description: 'Execução das atividades diárias e semanais',
      order: 5,
      visibility: 'VISIBLE_TO_CLIENT',
      deadlineType: 'RECURRING',
      recurrence: 'WEEKLY',
      recurrenceDays: 7,
    },
  });

  await prisma.actionTemplate.createMany({
    data: [
      {
        phaseTemplateId: phase6.id,
        title: 'Check diário de ADS',
        description: 'Verificar performance de campanhas',
        order: 0,
        visibility: 'INTERNAL',
        deadlineType: 'RECURRING',
        recurrence: 'DAILY',
        recurrenceDays: 1,
      },
      {
        phaseTemplateId: phase6.id,
        title: 'Ajustes de campanha',
        description: 'Otimizar campanhas conforme necessário',
        order: 1,
        visibility: 'INTERNAL',
        deadlineType: 'RECURRING',
        recurrence: 'DAILY',
        recurrenceDays: 1,
      },
      {
        phaseTemplateId: phase6.id,
        title: 'Resumo semanal',
        description: 'Preparar e enviar resumo da semana ao cliente',
        order: 2,
        visibility: 'VISIBLE_TO_CLIENT',
        deadlineType: 'RECURRING',
        recurrence: 'WEEKLY',
        recurrenceDays: 7,
      },
    ],
  });

  // Fase 7 - Revisão de Ciclo (VISIBLE_TO_CLIENT)
  const phase7 = await prisma.phaseTemplate.create({
    data: {
      productId: product.id,
      name: 'Revisão de Ciclo (Mensal)',
      description: 'Revisão mensal de resultados e estratégias',
      order: 6,
      visibility: 'VISIBLE_TO_CLIENT',
      deadlineType: 'RECURRING',
      recurrence: 'MONTHLY',
      recurrenceDays: 30,
    },
  });

  await prisma.actionTemplate.createMany({
    data: [
      {
        phaseTemplateId: phase7.id,
        title: 'Consolidar resultados do mês',
        description: 'Compilar dados e métricas do período',
        order: 0,
        visibility: 'INTERNAL',
        deadlineType: 'RECURRING',
        recurrence: 'MONTHLY',
        recurrenceDays: 30,
      },
      {
        phaseTemplateId: phase7.id,
        title: 'Revisar estratégia',
        description: 'Analisar o que funcionou e ajustar plano',
        order: 1,
        visibility: 'VISIBLE_TO_CLIENT',
        deadlineType: 'RECURRING',
        recurrence: 'MONTHLY',
        recurrenceDays: 30,
      },
      {
        phaseTemplateId: phase7.id,
        title: 'Reunião de revisão',
        description: 'Apresentar resultados e próximos passos',
        order: 2,
        visibility: 'VISIBLE_TO_CLIENT',
        deadlineType: 'RECURRING',
        recurrence: 'MONTHLY',
        recurrenceDays: 30,
      },
      {
        phaseTemplateId: phase7.id,
        title: 'Registrar decisões',
        description: 'Documentar decisões tomadas na reunião',
        order: 3,
        visibility: 'INTERNAL',
        deadlineType: 'RECURRING',
        recurrence: 'MONTHLY',
        recurrenceDays: 30,
      },
    ],
  });

  console.log('✅ All phase templates and action templates created!');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`- Admin user: ${admin.email} (password: admin123)`);
  console.log(`- Product: ${product.name}`);
  console.log(`- 7 phases with multiple actions configured`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
