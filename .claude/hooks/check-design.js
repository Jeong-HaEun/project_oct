// PostToolUse 훅: Claude 가 src/ 의 .jsx·.js·.css 를 고친 직후 docs/design/design.md 8절(금지 목록)을 검사한다.
// 위반이 있으면 exit 2 + stderr 로 알려서 Claude 가 바로 고치게 한다. 검사 대상이 아니면 조용히 통과(exit 0).
import { readFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'

const PALETTE =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose'
const COLOR_UTIL =
  'bg|text|border(?:-[trblxy])?|ring|outline|fill|stroke|from|via|to|decoration|divide|accent|caret|placeholder|shadow'
const HEX =
  '#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![0-9a-zA-Z_-])'

const RULES = [
  {
    name: '임의 색 값',
    pattern: new RegExp(`(?:${COLOR_UTIL})-\\[(?:#|rgb|hsl|oklch|color)`),
    fix: 'design.md 2절의 색 이름 (예: bg-primary, text-muted)',
    files: /\.(jsx|js|css)$/,
  },
  {
    name: 'Tailwind 기본 팔레트 색',
    pattern: new RegExp(
      `(?<![\\w-])(?:${COLOR_UTIL})-(?:${PALETTE})-\\d{2,3}(?![\\w-])`,
    ),
    fix: 'design.md 2절의 색 이름 (예: text-bad, border-hairline)',
    files: /\.(jsx|js|css)$/,
  },
  {
    name: '.jsx/.js 안의 직접 색 코드',
    pattern: new RegExp(`(?<![\\w&])${HEX}`),
    fix: '클래스 또는 var(--color-primary) 같은 CSS 변수',
    files: /\.(jsx|js)$/,
  },
  {
    name: 'src/index.css 밖의 색 정의',
    pattern: new RegExp(`(?<![\\w&])${HEX}`),
    fix: 'src/index.css 의 @theme 에 토큰을 추가하고 그 이름을 쓰기',
    files: /\.css$/,
    skip: (path) => path === 'src/index.css',
  },
  {
    name: '카드 그림자',
    pattern:
      /(?<![\w-])shadow(?:-(?:2xs|xs|sm|md|lg|xl|2xl|inner))?(?![\w-])|box-shadow\s*:/,
    fix: 'border border-hairline (그림자 대신 1px 선)',
    files: /\.(jsx|js|css)$/,
  },
]

function readInput() {
  try {
    return JSON.parse(readFileSync(0, 'utf8'))
  } catch {
    return null
  }
}

function isCommentLine(line) {
  const t = line.trim()
  return t.startsWith('//') || t.startsWith('/*') || t.startsWith('*')
}

function checkSource(path, source) {
  const problems = []
  const lines = source.split(/\r?\n/)
  for (const rule of RULES) {
    if (!rule.files.test(path) || rule.skip?.(path)) continue
    lines.forEach((line, i) => {
      if (isCommentLine(line)) return
      const all = new RegExp(rule.pattern.source, 'g')
      for (const match of line.matchAll(all)) {
        problems.push({ line: i + 1, rule, found: match[0] })
      }
    })
  }
  return problems
}

function main() {
  const input = readInput()
  const filePath = input?.tool_input?.file_path
  if (!filePath) return

  const projectDir =
    process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd()
  const path = relative(projectDir, resolve(projectDir, filePath)).replaceAll(
    '\\',
    '/',
  )
  if (
    !path.startsWith('src/') ||
    !/\.(jsx|js|css)$/.test(path) ||
    /\.test\.js$/.test(path)
  )
    return

  let source
  try {
    source = readFileSync(resolve(projectDir, path), 'utf8')
  } catch {
    return
  }

  const problems = checkSource(path, source)
  if (problems.length === 0) return

  const report = problems
    .map(
      (p) =>
        `- ${path}:${p.line}  [${p.rule.name}] "${p.found}" → 대신: ${p.rule.fix}`,
    )
    .join('\n')
  process.stderr.write(
    `디자인 규칙 위반 ${problems.length}건 (docs/design/design.md 8절). 고친 뒤 다시 확인하세요.\n${report}\n`,
  )
  process.exit(2)
}

main()
