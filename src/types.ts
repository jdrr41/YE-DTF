export type DTFType = 'textil' | 'uv';

export type CalculationMode = 'meter' | 'individual' | 'service';

export interface PricingConfig {
  textilMeterPrice: number; // 13 €
  textilIndividualSmallPrice: number; // 25 € (< 150 cm²)
  textilIndividualLargePrice: number; // 20 € (>= 150 cm²)
  textilThresholdArea: number; // 150 cm²
  uvMeterPrice: number; // 25 €
  uvIndividualSmallPrice: number; // 40 € (< 250 cm²)
  uvIndividualLargePrice: number; // 35 € (>= 250 cm²)
  uvThresholdArea: number; // 250 cm²
  rollWidthCm: number; // 57 cm
  bcvEurRate: number; // Tasa oficial Banco Central de Venezuela (EUR -> VES)
  bcvLastUpdated?: string; // Fecha de actualización de la tasa BCV
}

export interface QuoteItem {
  id: string;
  dtfType: DTFType;
  mode: CalculationMode;
  title: string;
  description: string;
  dimensionsText: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  timestamp: number;
}
