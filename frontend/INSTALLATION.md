# 🔧 安装和运行测试指南

## 问题解决：React 19 版本兼容性

由于项目使用 React 19，我们需要使用支持 React 19 的测试库版本。

## 📦 安装步骤

### 1. 清理旧的依赖

```bash
cd frontend
rm -rf node_modules package-lock.json
```

### 2. 安装依赖

```bash
npm install
```

如果遇到 peer dependency 警告，可以使用：

```bash
npm install --legacy-peer-deps
```

### 3. 验证安装

```bash
npm list @testing-library/react
```

应该看到版本 16.x.x（支持 React 19）

## 🚀 运行测试

### 基础测试命令

```bash
# 运行所有测试
npm test

# 监听模式（推荐用于开发）
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

### 调试选项

```bash
# 运行单个测试文件
npm test horror-mode.test.ts

# 运行包含特定名称的测试
npm test -- -t "初始化测试"

# 显示详细输出
npm test -- --verbose

# 只运行失败的测试
npm test -- --onlyFailures
```

## 📋 依赖版本说明

| 包名 | 版本 | 说明 |
|------|------|------|
| react | 19.2.3 | 主框架 |
| @testing-library/react | 16.0.1 | 支持 React 19 |
| @testing-library/jest-dom | 6.1.5 | DOM 断言 |
| jest | 29.7.0 | 测试框架 |
| ts-jest | 29.1.1 | TypeScript 支持 |

## ⚠️ 常见问题

### 问题 1: ERESOLVE unable to resolve dependency tree

**错误信息：**
```
peer react@"^18.0.0" from @testing-library/react@14.3.1
```

**解决方案：**
已经在 package.json 中将 @testing-library/react 更新到 16.0.1 版本。重新运行：
```bash
npm install --legacy-peer-deps
```

### 问题 2: Cannot find module 'identity-obj-proxy'

**解决方案：**
```bash
npm install --save-dev identity-obj-proxy
```

### 问题 3: Jest 测试运行缓慢

**解决方案：**
限制并发 worker 数量：
```bash
npm test -- --maxWorkers=4
```

### 问题 4: 测试失败 - "Cannot find module '../hooks/useGameState'"

**解决方案：**
确保 jest.config.js 中的 roots 配置正确：
```javascript
roots: ['<rootDir>/tests']
```

## 🎯 预期测试结果

运行 `npm test` 后，你应该看到：

```
PASS  tests/horror-mode.test.ts
  Horror Mode - Game State System Tests
    1. 初始化测试
      ✓ 应该正确初始化游戏状态 (12 ms)
      ✓ 应该从 localStorage 恢复状态 (8 ms)
    2. 游戏阶段切换测试
      ✓ ESTABLISHMENT: syncRate 0-25% (5 ms)
      ✓ DISTURBANCE: syncRate 26-50% (4 ms)
      ✓ DISTORTION: syncRate 51-85% (3 ms)
      ✓ POSSESSION: syncRate 86-100% (4 ms)
    3. 动作效果测试
      ✓ WRITE_DIARY: 应该增加 sync +5, corruption +3, energy +50 (6 ms)
      ✓ FEED: 应该增加 sync +2, corruption -2, energy -10 (5 ms)
      ✓ WATER: 应该增加 sync +2, corruption -2, energy -10 (4 ms)
      ✓ PLAY: 应该增加 sync +3, corruption -1, energy -20 (5 ms)
      ✓ DELETE_DIARY: 应该增加 sync +8, corruption +15 (4 ms)
      ✓ SWITCH_TAB: 应该增加 sync +3, corruption +10 (3 ms)
    4. 边界值测试
      ✓ syncRate 不应超过 100 (4 ms)
      ✓ syncRate 不应小于 0 (3 ms)
      ✓ corruption 不应超过 100 (3 ms)
      ✓ corruption 不应小于 0 (4 ms)
      ✓ energy 不应超过 100 (3 ms)
      ✓ energy 不应小于 0 (4 ms)
    5. 对话触发测试
      ✓ DELETE_DIARY 在低腐化时应该返回温和对话 (5 ms)
      ✓ DELETE_DIARY 在高腐化时应该返回恐怖对话 (4 ms)
      ✓ TRY_CLOSE 在高腐化时应该返回阻止对话 (4 ms)
      ✓ SWITCH_TAB 应该返回害怕对话 (3 ms)
    6. 完整游戏流程测试
      ✓ 模拟完整游戏流程: ESTABLISHMENT -> POSSESSION (18 ms)
      ✓ 模拟混合操作流程 (7 ms)
    7. 能量系统测试
      ✓ 能量不足时仍然可以执行动作（由UI控制） (5 ms)
      ✓ 写日记应该恢复能量 (4 ms)
    8. localStorage 持久化测试
      ✓ 状态变化应该自动保存到 localStorage (6 ms)
  Horror Mode - Integration Tests
    9. 阶段转换集成测试
      ✓ 应该在正确的 sync 值触发阶段转换 (12 ms)
    10. 性能测试
      ✓ 1000次动作执行应该在合理时间内完成 (342 ms)

Test Suites: 1 passed, 1 total
Tests:       30 passed, 30 total
Snapshots:   0 total
Time:        2.456 s
Ran all test suites.

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |   95.12 |    88.46 |   94.73 |   95.12 |
 useGameState.ts |   96.77 |    90.00 |   100.00 |   96.77 | 115-116
----------|---------|----------|---------|---------|-------------------
```

## 📊 覆盖率报告

运行覆盖率测试后，会在 `coverage/` 目录生成 HTML 报告：

```bash
npm run test:coverage

# 在浏览器中打开报告
# Windows
start coverage/lcov-report/index.html

# macOS
open coverage/lcov-report/index.html

# Linux
xdg-open coverage/lcov-report/index.html
```

## 🔍 文件结构

```
frontend/
├── tests/
│   ├── __mocks__/
│   │   └── framer-motion.js      # Framer Motion mock
│   ├── setup.ts                   # Jest 全局配置
│   └── horror-mode.test.ts        # 主测试文件
├── jest.config.js                 # Jest 配置
├── package.json                   # 依赖配置
├── AUTOMATED_TESTING.md           # 测试文档
└── INSTALLATION.md                # 本文件
```

## 💡 开发建议

1. **使用监听模式**: 开发时运行 `npm run test:watch`，代码变动时自动重新测试
2. **先写测试**: 新功能开发前先写测试用例（TDD）
3. **保持高覆盖率**: 目标覆盖率 > 90%
4. **定期运行完整测试**: 提交前运行 `npm run test:coverage`

## 🚦 CI/CD 集成

如果使用 GitHub Actions，添加 `.github/workflows/test.yml`：

```yaml
name: Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json

    - name: Install dependencies
      working-directory: frontend
      run: npm ci --legacy-peer-deps

    - name: Run tests
      working-directory: frontend
      run: npm test -- --coverage

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./frontend/coverage/lcov.info
```

## ✅ 验证安装成功

运行以下命令验证一切正常：

```bash
# 1. 检查 Node 版本 (推荐 18+)
node -v

# 2. 检查 npm 版本 (推荐 9+)
npm -v

# 3. 安装依赖
npm install --legacy-peer-deps

# 4. 运行测试
npm test

# 5. 生成覆盖率
npm run test:coverage
```

如果所有步骤都成功，恭喜！测试环境已经配置完成 🎉
