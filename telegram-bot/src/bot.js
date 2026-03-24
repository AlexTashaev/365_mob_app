const { Telegraf, Markup } = require('telegraf');
const {
  MONTHS,
  getEntry,
  getEntriesByMonth,
  getTotalEntries,
  getRandomEntry,
} = require('./data');

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('❌ Укажите BOT_TOKEN в переменных окружения');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// --- In-memory bookmarks (per user) ---
const userBookmarks = new Map(); // userId -> Set<"month:day">

function getBookmarks(userId) {
  if (!userBookmarks.has(userId)) userBookmarks.set(userId, new Set());
  return userBookmarks.get(userId);
}

// --- Formatting helpers ---

function formatEntry(entry) {
  let text = `📖 *${escMd(entry.title)}*\n`;
  text += `📅 ${escMd(entry.month)}, день ${entry.day}\n\n`;

  if (entry.light) {
    text += `☀️ *Луч света*\n${escMd(entry.light)}\n\n`;
  }
  if (entry.wisdom) {
    text += `🧠 *Мудрость дня*\n${escMd(entry.wisdom)}\n\n`;
  }
  if (entry.prayer) {
    text += `🙏 *Молитва*\n${escMd(entry.prayer)}\n`;
  }

  return text;
}

function escMd(text) {
  if (!text) return '';
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}

function entryNavKeyboard(entry, userId) {
  const bookmarks = getBookmarks(userId);
  const key = `${entry.month}:${entry.day}`;
  const isBookmarked = bookmarks.has(key);

  const monthEntries = getEntriesByMonth(entry.month);
  const currentIdx = monthEntries.findIndex((e) => e.day === entry.day);

  const nav = [];

  // Previous / Next within month
  if (currentIdx > 0) {
    const prev = monthEntries[currentIdx - 1];
    nav.push(Markup.button.callback('⬅️ Назад', `day:${prev.month}:${prev.day}`));
  }
  if (currentIdx < monthEntries.length - 1) {
    const next = monthEntries[currentIdx + 1];
    nav.push(Markup.button.callback('Вперёд ➡️', `day:${next.month}:${next.day}`));
  }

  const actions = [
    Markup.button.callback(
      isBookmarked ? '❌ Убрать закладку' : '🔖 В закладки',
      `bm:${entry.month}:${entry.day}`
    ),
    Markup.button.callback('🔀 Случайная', 'random'),
  ];

  const rows = [];
  if (nav.length) rows.push(nav);
  rows.push(actions);
  rows.push([Markup.button.callback('📅 К месяцам', 'months')]);

  return Markup.inlineKeyboard(rows);
}

// --- /start ---

bot.start((ctx) => {
  const name = ctx.from.first_name || 'друг';
  ctx.reply(
    `Шалом, ${name}! 🙏\n\nДобро пожаловать в бот *365 Молитв*\\.\n` +
      `Ежедневные духовные молитвы и размышления по еврейскому календарю\\.\n\n` +
      `📚 Всего записей: *${getTotalEntries()}*\n\n` +
      `Выберите действие:`,
    {
      parse_mode: 'MarkdownV2',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('📅 Календарь месяцев', 'months')],
        [Markup.button.callback('🔀 Случайная молитва', 'random')],
        [Markup.button.callback('🔖 Мои закладки', 'bookmarks')],
      ]),
    }
  );
});

// --- /help ---

bot.help((ctx) => {
  ctx.reply(
    `📖 *365 Молитв — Помощь*\n\n` +
      `Команды:\n` +
      `/start — Главное меню\n` +
      `/months — Календарь месяцев\n` +
      `/random — Случайная молитва\n` +
      `/bookmarks — Мои закладки\n` +
      `/help — Эта справка`,
    { parse_mode: 'MarkdownV2' }
  );
});

// --- /months ---

bot.command('months', (ctx) => showMonths(ctx));

bot.action('months', (ctx) => {
  ctx.answerCbQuery();
  showMonths(ctx);
});

function showMonths(ctx) {
  const buttons = MONTHS.map((m, i) =>
    Markup.button.callback(`${m.emoji} ${m.name} (${m.nameHe})`, `month:${i}`)
  );

  // 2 columns
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }

  ctx.reply('📅 *Выберите месяц:*', {
    parse_mode: 'MarkdownV2',
    ...Markup.inlineKeyboard(rows),
  });
}

// --- Month days list ---

bot.action(/^month:(\d+)$/, (ctx) => {
  ctx.answerCbQuery();
  const monthIdx = parseInt(ctx.match[1]);
  const month = MONTHS[monthIdx];
  if (!month) return;

  showMonthDays(ctx, month);
});

function showMonthDays(ctx, month) {
  const entries = getEntriesByMonth(month.name);

  // Row of day buttons, 5 per row
  const buttons = entries.map((e) =>
    Markup.button.callback(`${e.day}`, `day:${e.month}:${e.day}`)
  );

  const rows = [];
  for (let i = 0; i < buttons.length; i += 5) {
    rows.push(buttons.slice(i, i + 5));
  }
  rows.push([Markup.button.callback('⬅️ К месяцам', 'months')]);

  ctx.reply(
    `${month.emoji} *${escMd(month.name)}* \\(${escMd(month.nameHe)}\\)\n` +
      `${escMd(month.description)}\n\n` +
      `Выберите день:`,
    {
      parse_mode: 'MarkdownV2',
      ...Markup.inlineKeyboard(rows),
    }
  );
}

// --- Show specific day ---

bot.action(/^day:(.+):(\d+)$/, (ctx) => {
  ctx.answerCbQuery();
  const month = ctx.match[1];
  const day = parseInt(ctx.match[2]);
  showDay(ctx, month, day);
});

function showDay(ctx, month, day) {
  const entry = getEntry(month, day);
  if (!entry) {
    return ctx.reply('Запись не найдена.');
  }

  const text = formatEntry(entry);
  const keyboard = entryNavKeyboard(entry, ctx.from.id);

  ctx.reply(text, { parse_mode: 'MarkdownV2', ...keyboard });
}

// --- Random prayer ---

bot.command('random', (ctx) => showRandom(ctx));

bot.action('random', (ctx) => {
  ctx.answerCbQuery();
  showRandom(ctx);
});

function showRandom(ctx) {
  const entry = getRandomEntry();
  const text = formatEntry(entry);
  const keyboard = entryNavKeyboard(entry, ctx.from.id);
  ctx.reply(text, { parse_mode: 'MarkdownV2', ...keyboard });
}

// --- Bookmarks ---

bot.action(/^bm:(.+):(\d+)$/, (ctx) => {
  const month = ctx.match[1];
  const day = parseInt(ctx.match[2]);
  const key = `${month}:${day}`;
  const bookmarks = getBookmarks(ctx.from.id);

  if (bookmarks.has(key)) {
    bookmarks.delete(key);
    ctx.answerCbQuery('❌ Закладка удалена');
  } else {
    bookmarks.add(key);
    ctx.answerCbQuery('🔖 Добавлено в закладки!');
  }

  // Refresh the message keyboard
  const entry = getEntry(month, day);
  if (entry) {
    const text = formatEntry(entry);
    const keyboard = entryNavKeyboard(entry, ctx.from.id);
    ctx.editMessageText(text, { parse_mode: 'MarkdownV2', ...keyboard }).catch(() => {});
  }
});

bot.command('bookmarks', (ctx) => showBookmarks(ctx));

bot.action('bookmarks', (ctx) => {
  ctx.answerCbQuery();
  showBookmarks(ctx);
});

function showBookmarks(ctx) {
  const bookmarks = getBookmarks(ctx.from.id);

  if (bookmarks.size === 0) {
    return ctx.reply(
      '🔖 У вас пока нет закладок\\.\n\nОткройте любую молитву и нажмите «В закладки»\\.',
      {
        parse_mode: 'MarkdownV2',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('📅 К месяцам', 'months')],
          [Markup.button.callback('🔀 Случайная молитва', 'random')],
        ]),
      }
    );
  }

  const buttons = [];
  for (const key of bookmarks) {
    const [month, day] = key.split(':');
    const entry = getEntry(month, parseInt(day));
    if (entry) {
      buttons.push([
        Markup.button.callback(
          `📖 ${entry.month}, день ${entry.day} — ${entry.title.substring(0, 30)}`,
          `day:${entry.month}:${entry.day}`
        ),
      ]);
    }
  }

  buttons.push([Markup.button.callback('📅 К месяцам', 'months')]);

  ctx.reply('🔖 *Ваши закладки:*', {
    parse_mode: 'MarkdownV2',
    ...Markup.inlineKeyboard(buttons),
  });
}

// --- Menu button for main commands ---
bot.action('main_menu', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('Выберите действие:', {
    ...Markup.inlineKeyboard([
      [Markup.button.callback('📅 Календарь месяцев', 'months')],
      [Markup.button.callback('🔀 Случайная молитва', 'random')],
      [Markup.button.callback('🔖 Мои закладки', 'bookmarks')],
    ]),
  });
});

// --- Launch ---

bot.launch().then(() => {
  console.log('🙏 Бот «365 Молитв» запущен!');
});

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
