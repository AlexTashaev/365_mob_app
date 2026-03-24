interface TelegramWebApp {
  ready(): void;
  expand(): void;
  close(): void;
  MainButton: {
    text: string;
    show(): void;
    hide(): void;
    onClick(fn: () => void): void;
  };
  BackButton: {
    show(): void;
    hide(): void;
    onClick(fn: () => void): void;
    offClick(fn: () => void): void;
  };
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  colorScheme: 'light' | 'dark';
  switchInlineQuery(query: string, chatTypes?: string[]): void;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
    };
    start_param?: string;
  };
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp;
  };
}
