import type { jsPDF } from 'jspdf';
import type { AiAnalysis, AiDetectedTheme } from '../types/multiAgent';

const page = {
  width: 210,
  height: 297,
  margin: 17,
  contentWidth: 176,
};

const colors = {
  ink: [28, 28, 28] as const,
  muted: [88, 87, 94] as const,
  purple: [134, 92, 255] as const,
  mint: [0, 194, 150] as const,
  yellow: [255, 227, 66] as const,
  paper: [255, 253, 255] as const,
  palePurple: [246, 242, 255] as const,
  paleMint: [235, 255, 250] as const,
  paleYellow: [255, 250, 218] as const,
  paleRisk: [255, 244, 240] as const,
};

type RGB = readonly [number, number, number];

export async function exportAnalysisPdf(analysis: AiAnalysis) {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ format: 'a4', unit: 'mm' });
  let y = drawHeader(pdf, analysis);

  if (analysis.pergunta_opcional) {
    y = drawCard(pdf, y, 'Pergunta analisada', analysis.pergunta_opcional, colors.paper, colors.purple);
  }

  if (analysis.resposta_da_pergunta) {
    y = drawCard(pdf, y, 'Resposta da pergunta', analysis.resposta_da_pergunta, colors.paleMint, colors.mint);
  }

  y = drawCard(pdf, y, 'Diagnostico central', analysis.diagnostico_central, colors.ink, colors.mint, true);
  y = drawCard(pdf, y, 'Resumo executivo', analysis.resumo_executivo, colors.paper, colors.purple);

  const themes = analysis.entidades_detectadas.temas.map(getThemeName);
  y = drawTagCard(pdf, y, 'Temas identificados', themes);
  y = drawEntitySummary(pdf, y, analysis);

  y = drawListCard(pdf, y, 'Oportunidades', analysis.oportunidades, colors.paleMint, colors.mint);
  y = drawSolution(pdf, y, analysis);
  y = drawListCard(pdf, y, 'Riscos criticos', analysis.riscos_criticos, colors.paleRisk, colors.yellow);
  y = drawListCard(pdf, y, 'Pontos de incerteza', analysis.pontos_de_incerteza, colors.paleYellow, colors.yellow);

  const personaLines = analysis.comentarios_relevantes_das_personas.map(
    (comment) => `${titleCase(comment.persona)}: ${comment.comentario_direcionador}`,
  );
  y = drawListCard(pdf, y, 'Comentarios dos agentes', personaLines, colors.palePurple, colors.purple);

  const lessons = (analysis.aprendizados_aplicados ?? []).map(
    (lesson) => `${lesson.regra} Aplicacao: ${lesson.como_foi_aplicada}`,
  );
  drawListCard(pdf, y, 'Aprendizados aplicados', lessons, colors.paper, colors.purple);

  addFooters(pdf);
  pdf.save(`noster-analise-${analysis.id_reuniao ?? 'reuniao'}.pdf`);
}

function drawHeader(pdf: jsPDF, analysis: AiAnalysis) {
  pdf.setFillColor(...colors.ink);
  pdf.rect(0, 0, page.width, 45, 'F');
  pdf.setFillColor(...colors.yellow);
  pdf.rect(page.margin, 14, 5, 17, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...colors.paper);
  pdf.setFontSize(22);
  pdf.text('NOSTER', page.margin + 10, 22);
  pdf.setFontSize(13);
  pdf.text('ANALISE MULTI-AGENTES', page.margin + 10, 30);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(212, 209, 214);
  pdf.setFontSize(8);
  pdf.text(`Reuniao: ${analysis.id_reuniao ?? 'Nao identificada'}`, page.margin + 10, 37);

  return 55;
}

function drawCard(
  pdf: jsPDF,
  startY: number,
  title: string,
  text: string,
  fill: RGB,
  accent: RGB,
  inverse = false,
) {
  const lines = wrap(pdf, text, page.contentWidth - 12, 10);
  const height = Math.max(24, 15 + lines.length * 4.8);
  const y = reserve(pdf, startY, height);

  pdf.setFillColor(...fill);
  pdf.roundedRect(page.margin, y, page.contentWidth, height, 3, 3, 'F');
  pdf.setFillColor(...accent);
  pdf.rect(page.margin, y, 2.5, height, 'F');
  label(pdf, title, page.margin + 7, y + 8, inverse ? colors.mint : accent);
  body(pdf, lines, page.margin + 7, y + 15, inverse ? colors.paper : colors.ink);

  return y + height + 6;
}

function drawTagCard(pdf: jsPDF, startY: number, title: string, values: string[]) {
  if (values.length === 0) {
    return startY;
  }

  return drawCard(pdf, startY, title, values.join('   |   '), colors.palePurple, colors.purple);
}

function drawEntitySummary(pdf: jsPDF, startY: number, analysis: AiAnalysis) {
  const entityLines = [
    ...analysis.entidades_detectadas.pessoas.map(
      (person) => `${person.nome} - ${person.papel} (${person.lado})${person.evidencia ? `: ${person.evidencia}` : ''}`,
    ),
    ...analysis.entidades_detectadas.empresas.map((company) =>
      typeof company === 'string' ? company : `${company.nome}${company.setor ? ` - ${company.setor}` : ''}`,
    ),
    ...analysis.entidades_detectadas.produtos.map((product) =>
      typeof product === 'string' ? product : `${product.nome}${product.descricao ? ` - ${product.descricao}` : ''}`,
    ),
    ...(analysis.entidades_detectadas.prazos ?? []).map(
      (deadline) => `Prazo: ${deadline.prazo}${deadline.evidencia ? ` - ${deadline.evidencia}` : ''}`,
    ),
    ...(analysis.entidades_detectadas.proximas_acoes ?? []).map(
      (action) => `Acao: ${action.acao}${action.evidencia ? ` - ${action.evidencia}` : ''}`,
    ),
  ];

  return drawListCard(pdf, startY, 'Entidades detectadas', entityLines, colors.paper, colors.purple);
}

function drawListCard(pdf: jsPDF, startY: number, title: string, values: string[], fill: RGB, accent: RGB) {
  if (values.length === 0) {
    return startY;
  }

  const text = values.map((value) => `- ${value}`).join('\n');
  return drawCard(pdf, startY, title, text, fill, accent);
}

function drawSolution(pdf: jsPDF, startY: number, analysis: AiAnalysis) {
  const solution = analysis.solucao_final_clara;
  const text = [
    `Onde focar: ${solution.onde_focar}`,
    `O que fazer: ${solution.o_que_fazer}`,
    `Como fazer: ${solution.como_fazer}`,
    `Por que: ${solution.porque}`,
    `Impactos: ${solution.impactos}`,
    `Proximo passo: ${solution.proximo_passo_imediato}`,
  ].join('\n\n');

  return drawCard(pdf, startY, 'Direcao recomendada', text, colors.ink, colors.yellow, true);
}

function reserve(pdf: jsPDF, startY: number, height: number) {
  if (startY + height <= page.height - 15) {
    return startY;
  }

  pdf.addPage();
  return 17;
}

function wrap(pdf: jsPDF, text: string, width: number, fontSize: number) {
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(fontSize);
  return pdf.splitTextToSize(text, width) as string[];
}

function label(pdf: jsPDF, text: string, x: number, y: number, color: RGB) {
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(...color);
  pdf.text(text.toUpperCase(), x, y);
}

function body(pdf: jsPDF, lines: string[], x: number, y: number, color: RGB) {
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(...color);
  pdf.text(lines, x, y);
}

function addFooters(pdf: jsPDF) {
  const pages = pdf.getNumberOfPages();

  for (let index = 1; index <= pages; index += 1) {
    pdf.setPage(index);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(...colors.muted);
    pdf.text(`NOSTER  |  Analise gerada pela sala Multi-agentes`, page.margin, page.height - 8);
    pdf.text(`${index} / ${pages}`, page.width - page.margin, page.height - 8, { align: 'right' });
  }
}

function getThemeName(theme: string | AiDetectedTheme) {
  return typeof theme === 'string' ? theme : theme.tema;
}

function titleCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
