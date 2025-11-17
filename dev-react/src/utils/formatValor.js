// Função para formatar valor monetário para padrão brasileiro
export function formatValorBR(valor) {
  if (typeof valor === 'number') valor = valor.toFixed(2);
  valor = String(valor).replace(/[^\d,\.]/g, '');
  let num = parseFloat(valor.replace(',', '.'));
  if (isNaN(num)) num = 0;
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
