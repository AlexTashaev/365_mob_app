export interface MonthInfo {
  name: string;
  nameHe: string;
  days: number;
  description: string;
  color: string;
}

export const MONTHS: MonthInfo[] = [
  { name: "Тишрей", nameHe: "תשרי", days: 30, description: "Новое начало и духовный подъем", color: "#1B5E20" },
  { name: "Хешван", nameHe: "חשוון", days: 30, description: "Внутренняя работа и тишина", color: "#4E342E" },
  { name: "Кислев", nameHe: "כסלו", days: 30, description: "Свет веры и доверия", color: "#1A237E" },
  { name: "Тевет", nameHe: "טבת", days: 29, description: "Стойкость и преодоление", color: "#263238" },
  { name: "Шват", nameHe: "שבט", days: 30, description: "Обновление и рост", color: "#2E7D32" },
  { name: "Адар", nameHe: "אדר", days: 29, description: "Радость и единство", color: "#6A1B9A" },
  { name: "Нисан", nameHe: "ניסן", days: 30, description: "Свобода и духовное обновление", color: "#E65100" },
  { name: "Ияр", nameHe: "אייר", days: 29, description: "Исцеление и внутреннее строительство", color: "#00695C" },
  { name: "Сиван", nameHe: "סיוון", days: 30, description: "Получение и единение", color: "#0D47A1" },
  { name: "Тамуз", nameHe: "תמוז", days: 29, description: "Преодоление и стойкость", color: "#BF360C" },
  { name: "Ав", nameHe: "אב", days: 30, description: "Разрушение и возрождение", color: "#3E2723" },
  { name: "Элул", nameHe: "אלול", days: 29, description: "Возвращение к источнику и единству", color: "#4A148C" },
];

export const getMonthIndex = (name: string): number => {
  return MONTHS.findIndex(m => m.name === name);
};
