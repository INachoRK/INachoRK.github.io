const TARIFA_POR_DIA = 35000;
const MIN_EQUIPOS = 2;
const DESCUENTO_ADICIONAL_POR_DIA = 0.02;
const LIMITE_DESCUENTO_ADICIONAL = 0.20;

const UBICACION = {
  ciudad: { label: 'Dentro de la ciudad', ajuste: 0 },
  fuera: { label: 'Fuera de la ciudad', ajuste: 0.05 },
  establecimiento: { label: 'Dentro del establecimiento', ajuste: -0.05 }
};

const fmt = n => n.toLocaleString('es-CO', {style:'currency', currency:'COP', maximumFractionDigits:0});
const hoyStr = () => new Date().toLocaleString('es-CO');
const idClienteGen = () => 'CLI-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random()*999).toString().padStart(3,'0');

function calcularFactura({ equipos, diasIniciales, diasAdicionales, ubicacion }){
  if (equipos < MIN_EQUIPOS) throw new Error(`Mínimo ${MIN_EQUIPOS} equipos.`);
  if (diasIniciales < 1) throw new Error('Los días iniciales deben ser al menos 1.');
  if (diasAdicionales < 0) throw new Error('Los días adicionales no pueden ser negativos.');

  const costoInicial = equipos * diasIniciales * TARIFA_POR_DIA;
  const costoAdicional = equipos * diasAdicionales * TARIFA_POR_DIA;

  const tasaDescuento = Math.min(DESCUENTO_ADICIONAL_POR_DIA * diasAdicionales, LIMITE_DESCUENTO_ADICIONAL);
  const descuentoAdicional = costoAdicional * tasaDescuento;

  const subtotal = costoInicial + costoAdicional - descuentoAdicional;
  const ajusteUbicacion = subtotal * (UBICACION[ubicacion]?.ajuste ?? 0);
  const total = subtotal + ajusteUbicacion;

  return {
    costoInicial, costoAdicional, descuentoAdicional, subtotal, ajusteUbicacion, total,
    tasaDescuento, ubicacionLabel: UBICACION[ubicacion]?.label || '—'
  };
}

const form = document.getElementById('alquilerForm');
const salida = {
  cont: document.getElementById('resultado'),
  id: document.getElementById('idCliente'),
  fecha: document.getElementById('fecha'),
  equipos: document.getElementById('rEquipos'),
  dIni: document.getElementById('rDiasIniciales'),
  dAdic: document.getElementById('rDiasAdicionales'),
  ubic: document.getElementById('rUbicacion'),
  cIni: document.getElementById('rCostoInicial'),
  cAdic: document.getElementById('rCostoAdicional'),
  desc: document.getElementById('rDescAdic'),
  sub: document.getElementById('rSubtotal'),
  ajUb: document.getElementById('rAjusteUbic'),
  total: document.getElementById('rTotal'),
};

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  const cliente = String(data.get('cliente') || '').trim();
  const correo = String(data.get('correo') || '').trim();
  const ubicacion = String(data.get('ubicacion') || 'ciudad');
  const equipos = parseInt(String(data.get('equipos')), 10);
  const diasIniciales = parseInt(String(data.get('diasIniciales')), 10);
  const diasAdicionales = parseInt(String(data.get('diasAdicionales')), 10);

  try{
    if(!cliente) throw new Error('Ingrese el nombre del cliente.');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) throw new Error('Correo no válido.');

    const factura = calcularFactura({ equipos, diasIniciales, diasAdicionales, ubicacion });

    const id = idClienteGen();
    salida.fecha.textContent = hoyStr();
    salida.equipos.textContent = equipos;
    salida.dIni.textContent = diasIniciales;
    salida.dAdic.textContent = diasAdicionales;
    salida.ubic.textContent = factura.ubicacionLabel;

    salida.cIni.textContent = fmt(factura.costoInicial);
    salida.cAdic.textContent = fmt(factura.costoAdicional);
    const descTxt = factura.descuentoAdicional>0
      ? `${fmt(-factura.descuentoAdicional)} (tasa ${Math.round(factura.tasaDescuento*100)}%)`
      : fmt(0);
    salida.desc.textContent = descTxt;

    salida.sub.textContent = fmt(factura.subtotal);
    const ajPref = factura.ajusteUbicacion>=0 ? '+' : '';
    salida.ajUb.textContent = ajPref + fmt(factura.ajusteUbicacion);
    salida.total.textContent = fmt(factura.total);

    salida.cont.classList.remove('hidden');

    localStorage.setItem('alquipc:last', JSON.stringify({cliente, correo, equipos, diasIniciales, diasAdicionales, ubicacion}));
  }catch(err){
    alert(err.message);
  }
});

const btnLimpiar = document.getElementById('btnLimpiar');
btnLimpiar?.addEventListener('click', () => {
  localStorage.removeItem('alquipc:last');
  document.getElementById('resultado').classList.add('hidden');
});