# Design Document - Terminal Redesign

## Overview

Этот документ описывает дизайн улучшенного компонента терминала для персонального веб-сайта. Компонент будет переработан с современным визуальным стилем, включающим glassmorphism эффекты, плавные анимации, улучшенную типографику и интерактивные элементы. Дизайн сохранит существующую функциональность, но значительно улучшит визуальную привлекательность и пользовательский опыт.

## Architecture

Компонент `TerminalCard` останется React функциональным компонентом, использующим:
- **Framer Motion** для анимаций
- **React i18next** для интернационализации
- **Tailwind CSS** для стилизации
- **CSS анимации** для специфических эффектов (мигание курсора, typewriter)

Архитектура остается простой и не требует дополнительных зависимостей.

## Components and Interfaces

### TerminalCard Component

**Props:**
```typescript
interface TerminalCardProps {
  user: {
    location: {
      country: string;
      city: string;
    }
  };
  children: React.ReactNode;
}
```

**Структура компонента:**

1. **Terminal Window Container**
   - Основной контейнер с glassmorphism эффектом
   - Анимация появления через Framer Motion
   - Hover эффекты для интерактивности

2. **Terminal Header**
   - Кнопки управления окном (красная, желтая, зеленая)
   - Путь к директории с иконкой
   - Улучшенная типографика

3. **Terminal Content Area**
   - Область для children с typewriter эффектом
   - Анимированный курсор с плавным миганием
   - Syntax highlighting для текста

4. **Command Output Section**
   - Блок с результатом команды
   - Улучшенный стиль с тенями

5. **Info Grid**
   - Сетка с информацией о стране и городе
   - Улучшенные карточки с hover эффектами
   - Оптимизированный флаг страны

## Data Models

Компонент не требует изменений в моделях данных. Используется существующая структура:

```javascript
user: {
  location: {
    country: string,  // Название страны
    city: string      // Название города
  }
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Visual Styling Properties

**Property 1: Glassmorphism styling is applied**
The terminal component should render with backdrop-blur and semi-transparent background classes when mounted.
**Validates: Requirements 1.1**

**Property 2: Enhanced borders are present**
The terminal component should include gradient or glow border styling classes in its rendered output.
**Validates: Requirements 1.2**

**Property 3: Entrance animations are configured**
The terminal component should have Framer Motion initial, animate, and transition props properly configured for smooth entrance.
**Validates: Requirements 1.4**

### Animation Properties

**Property 4: Cursor uses smooth blink animation**
The cursor element should use a custom blink animation class instead of the default pulse animation.
**Validates: Requirements 2.2**

**Property 5: Hover effects are applied**
The terminal container should include hover state classes for border glow or shadow enhancement.
**Validates: Requirements 2.3**

**Property 6: Window control buttons have hover states**
The window control buttons (red, yellow, green) should include hover effect classes for interactive feedback.
**Validates: Requirements 2.5, 4.1**

### Color and Typography Properties

**Property 7: Syntax highlighting is implemented**
Terminal text content should include color classes that distinguish different text types.
**Validates: Requirements 3.1**

**Property 8: Path has accent color highlighting**
The path display element should use accent color classes for visual emphasis.
**Validates: Requirements 3.3**

**Property 9: Enhanced typography is applied**
The terminal should use improved font weight and size classes compared to the original implementation.
**Validates: Requirements 1.5**

### Layout and Responsiveness Properties

**Property 10: Grid has responsive classes**
The information grid should include responsive Tailwind classes that adjust layout for different screen sizes.
**Validates: Requirements 5.1, 5.3**

**Property 11: Touch-friendly sizing is provided**
Interactive elements should have minimum size classes appropriate for touch interaction.
**Validates: Requirements 5.5**

### Visual Enhancement Properties

**Property 12: Information blocks have depth effects**
Information block elements should include shadow and depth effect classes.
**Validates: Requirements 4.3**

**Property 13: Grid items have consistent spacing**
The grid layout should use consistent gap and alignment classes for visual harmony.
**Validates: Requirements 4.5**

## Error Handling

Компонент является презентационным и не требует специальной обработки ошибок. Однако:

1. **Missing Props**: Если `user` или `user.location` отсутствуют, компонент должен корректно отображаться с пустыми значениями или значениями по умолчанию
2. **Missing Translations**: i18next должен предоставлять fallback значения для отсутствующих переводов
3. **Animation Failures**: Если Framer Motion не загружен, компонент должен отображаться без анимаций

## Testing Strategy

### Unit Testing

Для тестирования компонента будем использовать:
- **React Testing Library** для рендеринга и проверки DOM
- **Jest** как test runner
- **@testing-library/jest-dom** для дополнительных матчеров

**Unit тесты будут проверять:**
1. Корректный рендеринг компонента с переданными props
2. Наличие всех ключевых элементов (header, content, grid)
3. Правильное отображение данных пользователя (страна, город)
4. Наличие правильных CSS классов для стилизации
5. Корректную работу с i18next переводами

**Примеры unit тестов:**
- Компонент рендерится без ошибок с валидными props
- Отображаются правильные значения страны и города
- Присутствуют все три кнопки управления окном
- Курсор имеет правильный класс анимации
- Grid имеет responsive классы

### Property-Based Testing

Для этого проекта property-based testing не является критичным, так как компонент является чисто презентационным и не содержит сложной логики. Основное тестирование будет через unit тесты, которые проверяют наличие правильных CSS классов и структуры DOM.

Однако, если потребуется, можно использовать **@fast-check/jest** для генерации различных комбинаций props и проверки, что компонент всегда рендерится без ошибок.

### Visual Regression Testing (Optional)

Для проверки визуальных изменений можно использовать:
- **Storybook** для изолированной разработки компонента
- **Chromatic** или **Percy** для visual regression testing

Это поможет убедиться, что визуальные улучшения применены корректно и не сломаны при будущих изменениях.

## Implementation Details

### Glassmorphism Effect

```css
backdrop-blur-md bg-[rgba(6,6,17,0.7)] border-[rgba(90,89,185,0.2)]
```

### Custom Cursor Blink Animation

```css
@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

.animate-blink {
  animation: blink 1s infinite;
}
```

### Gradient Border Glow

```css
border-2 border-transparent bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20
hover:from-purple-500/40 hover:via-blue-500/40 hover:to-purple-500/40
```

### Enhanced Typography

```css
font-mono text-sm md:text-base text-gray-100 font-medium leading-relaxed
```

### Hover Effects

```css
transition-all duration-300 hover:shadow-[0_0_30px_rgba(90,89,185,0.3)]
```

### Responsive Grid

```css
grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4
```

### Window Control Buttons Enhancement

```css
w-3 h-3 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg
```

## Performance Considerations

1. **Animation Performance**: Использовать CSS transforms и opacity для анимаций (GPU-accelerated)
2. **Framer Motion**: Использовать `layoutId` для оптимизации layout анимаций
3. **Lazy Loading**: Не требуется, компонент легковесный
4. **Memoization**: Можно обернуть в `React.memo()` если компонент часто ре-рендерится

## Accessibility

1. **Semantic HTML**: Использовать правильные семантические теги
2. **ARIA Labels**: Добавить aria-label для кнопок управления окном
3. **Keyboard Navigation**: Убедиться, что интерактивные элементы доступны с клавиатуры
4. **Color Contrast**: Проверить контрастность текста (минимум 4.5:1 для обычного текста)
5. **Reduced Motion**: Уважать `prefers-reduced-motion` для пользователей с чувствительностью к анимациям

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const animationProps = prefersReducedMotion ? {} : {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.08 }
};
```

## Future Enhancements

1. **Typewriter Effect**: Добавить настоящий typewriter эффект для текста
2. **Command History**: Показывать историю команд при наведении
3. **Interactive Terminal**: Сделать терминал интерактивным с возможностью ввода команд
4. **Theme Switching**: Поддержка разных цветовых тем терминала
5. **Sound Effects**: Добавить звуковые эффекты при печати (опционально)
