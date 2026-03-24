const MONTHS = [
  { name: "Тишрей", nameHe: "תשרי", days: 30, description: "Новое начало и духовный подъем", emoji: "🌅" },
  { name: "Хешван", nameHe: "חשוון", days: 30, description: "Внутренняя работа и тишина", emoji: "🤫" },
  { name: "Кислев", nameHe: "כסלו", days: 30, description: "Свет веры и доверия", emoji: "🕯" },
  { name: "Тевет", nameHe: "טבת", days: 29, description: "Стойкость и преодоление", emoji: "💪" },
  { name: "Шват", nameHe: "שבט", days: 30, description: "Обновление и рост", emoji: "🌱" },
  { name: "Адар", nameHe: "אדר", days: 29, description: "Радость и единство", emoji: "🎭" },
  { name: "Нисан", nameHe: "ניסן", days: 30, description: "Свобода и духовное обновление", emoji: "🕊" },
  { name: "Ияр", nameHe: "אייר", days: 29, description: "Исцеление и внутреннее строительство", emoji: "💚" },
  { name: "Сиван", nameHe: "סיוון", days: 30, description: "Получение и единение", emoji: "📜" },
  { name: "Тамуз", nameHe: "תמוז", days: 29, description: "Преодоление и стойкость", emoji: "🔥" },
  { name: "Ав", nameHe: "אב", days: 30, description: "Разрушение и возрождение", emoji: "🏛" },
  { name: "Элул", nameHe: "אלול", days: 29, description: "Возвращение к источнику и единству", emoji: "🔄" },
];

const getMonthIndex = (name) => MONTHS.findIndex((m) => m.name === name);

module.exports = { MONTHS, getMonthIndex };
