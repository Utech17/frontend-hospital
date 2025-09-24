export function isUserOriginUnit(codigoCompleto: any, codigoUnidadUsuario: any) {
  const unidades = codigoCompleto.split('-').slice(0, 2);
  const unidadOrigen = unidades[0];
  return unidadOrigen === codigoUnidadUsuario ? 1 : 0;
}