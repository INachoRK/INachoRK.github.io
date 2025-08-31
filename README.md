# ALQUIPC – Calculadora de alquiler

## Reglas implementadas
- Tarifa fija: **$35.000 COP por equipo/día**.
- Mínimo **2 equipos** por alquiler.
- Ubicación:
  - Dentro de la ciudad: sin cargo.
  - Fuera de la ciudad: **+5%** por domicilio.
  - Dentro del establecimiento: **−5%** de descuento.
- Días adicionales: **2% de descuento por cada día adicional** aplicado **solo sobre el valor de los días adicionales**.
- **Mejora de sostenibilidad**: el descuento acumulado de días adicionales se **limita a 20%** para proteger la rentabilidad.

## Casos de prueba manual
1. **Básico**: 2 equipos, 1 día, ciudad → Total = 2×1×35.000 = **$70.000**.
2. **Fuera de la ciudad**: mismo caso +5% → $70.000 × 1,05 = **$73.500**.
3. **Establecimiento**: mismo caso −5% → $70.000 × 0,95 = **$66.500**.
4. **Adicionales**: 3 días adicionales con 2 equipos → base adicionales = 2×3×35.000 = $210.000; descuento = 3×2% = 6% → $12.600.

## McCall – Factores de calidad aplicados
- **Correctitud**: reglas de negocio codificadas con validaciones (mínimo 2 equipos, días ≥ 1, correo válido). Cálculo encapsulado en `calcularFactura()`.
- **Eficiencia**: JS y CSS livianos; sin frameworks; solo frontend.
- **Integridad**: sin datos sensibles; correo validado; no se guarda la factura en servidores (privacidad local).

**Producto en revisión**
- **Mantenibilidad**: constantes de negocio arriba; función pura para cálculos; comentarios y nombres claros.
- **Flexibilidad**: parámetros (`TARIFA_POR_DIA`, topes) fáciles de ajustar.
- **Testeabilidad**: función pura `calcularFactura()` permite pruebas unitarias.

**Producto en transición**
- **Portabilidad**: estático, funciona en cualquier navegador moderno (ideal para GitHub Pages).
- **Reusabilidad**: el módulo de cálculo se puede usar en otros frontends/backends.
- **Interoperabilidad**: salida vía `mailto:`; fácil integrar con una API futura.
