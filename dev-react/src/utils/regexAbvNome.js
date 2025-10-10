export function abreviarNomeMeio(nome) {
    const excecoes = ["de", "da", "do", "das", "dos", "e"];
    const partes = nome.trim().split(" ");
    if (partes.length <= 2) return nome; // Sem nomes do meio

    const primeiro = partes[0];
    const ultimo = partes[partes.length - 1];
    const meios = partes.slice(1, -1)
        .map(n => excecoes.includes(n.toLowerCase()) ? n : n[0] + '.')
        .join(' ');

    return `${primeiro} ${meios} ${ultimo}`;
}

export default abreviarNomeMeio;