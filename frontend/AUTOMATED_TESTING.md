# 恐怖模式全流程自动化测试指南

## 📋 测试套件说明

这是一个完整的自动化测试套件，类似于后端 API 测试，用于测试 Cat_Diary 的恐怖模式（Horror Mode）功能。

## 🚀 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 运行测试

```bash
# 运行所有测试
npm test

# 监听模式（开发时使用）
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

## 📊 测试覆盖范围

### 测试套件 1: Game State System Tests (游戏状态系统测试)

#### 1. 初始化测试
- ✅ 正确初始化游戏状态
- ✅ 从 localStorage 恢复状态

#### 2. 游戏阶段切换测试
- ✅ ESTABLISHMENT 阶段 (0-25%)
- ✅ DISTURBANCE 阶段 (26-50%)
- ✅ DISTORTION 阶段 (51-85%)
- ✅ POSSESSION 阶段 (86-100%)

#### 3. 动作效果测试
- ✅ WRITE_DIARY: sync +5, corruption +3, energy +50
- ✅ FEED: sync +2, corruption -2, energy -10
- ✅ WATER: sync +2, corruption -2, energy -10
- ✅ PLAY: sync +3, corruption -1, energy -20
- ✅ DELETE_DIARY: sync +8, corruption +15
- ✅ SWITCH_TAB: sync +3, corruption +10

#### 4. 边界值测试
- ✅ syncRate 上限 (100)
- ✅ syncRate 下限 (0)
- ✅ corruption 上限 (100)
- ✅ corruption 下限 (0)
- ✅ energy 上限 (100)
- ✅ energy 下限 (0)

#### 5. 对话触发测试
- ✅ DELETE_DIARY 低腐化对话
- ✅ DELETE_DIARY 高腐化对话
- ✅ TRY_CLOSE 高腐化对话
- ✅ SWITCH_TAB 对话触发

#### 6. 完整游戏流程测试
- ✅ 从 ESTABLISHMENT 到 POSSESSION 的完整流程
- ✅ 混合操作流程测试

#### 7. 能量系统测试
- ✅ 低能量时的动作执行
- ✅ 写日记恢复能量

#### 8. localStorage 持久化测试
- ✅ 状态自动保存到 localStorage

### 测试套件 2: Integration Tests (集成测试)

#### 9. 阶段转换集成测试
- ✅ 所有临界值的阶段转换

#### 10. 性能测试
- ✅ 1000次动作执行性能测试 (< 1秒)

## 📈 测试输出示例

```bash
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
```

## 📁 测试文件结构

```
frontend/
├── tests/
│   ├── setup.ts                 # Jest 配置和 Mock
│   └── horror-mode.test.ts      # 主测试文件
├── jest.config.js               # Jest 配置文件
└── package.json                 # 测试脚本配置
```

## 🔍 测试细节

### 测试用例设计原则

1. **独立性**: 每个测试用例独立运行，互不影响
2. **可重复性**: 使用 `beforeEach` 清空 localStorage，确保测试可重复
3. **完整性**: 覆盖所有核心功能、边界值、异常情况
4. **真实性**: 模拟真实用户操作流程

### 关键测试场景

#### 场景 1: 正常游戏流程
```typescript
// 写 20 篇日记从 ESTABLISHMENT 到 POSSESSION
for (let i = 0; i < 20; i++) {
  executeAction(ActionType.WRITE_DIARY);
}
// 预期: syncRate = 100, stage = POSSESSION
```

#### 场景 2: 能量管理
```typescript
// 初始能量 100
executeAction(ActionType.FEED);   // -10 -> 90
executeAction(ActionType.WATER);  // -10 -> 80
executeAction(ActionType.PLAY);   // -20 -> 60
executeAction(ActionType.WRITE_DIARY); // +50 -> 100 (capped)
```

#### 场景 3: 腐化值控制
```typescript
// 通过喂食/玩耍降低腐化
setCorruption(80);
executeAction(ActionType.FEED);   // -2 -> 78
executeAction(ActionType.WATER);  // -2 -> 76
executeAction(ActionType.PLAY);   // -1 -> 75
```

## 🐛 调试技巧

### 1. 运行单个测试
```bash
npm test -- -t "应该正确初始化游戏状态"
```

### 2. 查看详细输出
```bash
npm test -- --verbose
```

### 3. 监听特定文件
```bash
npm run test:watch -- horror-mode.test.ts
```

### 4. 生成 HTML 覆盖率报告
```bash
npm run test:coverage
# 打开 coverage/lcov-report/index.html 查看详细报告
```

## 🎯 覆盖率目标

- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

## 📝 添加新测试

### 示例: 添加新动作测试

```typescript
test('NEW_ACTION: 应该增加 sync +X, corruption +Y, energy +Z', () => {
  const { result } = renderHook(() => useGameState());

  act(() => {
    result.current.executeAction(ActionType.NEW_ACTION);
  });

  expect(result.current.gameState.syncRate).toBe(X);
  expect(result.current.gameState.corruption).toBe(Y);
  expect(result.current.gameState.energy).toBe(100 + Z); // 假设初始100
});
```

## 🚨 常见问题

### Q1: 测试失败 - localStorage is not defined
**A**: 检查 `tests/setup.ts` 是否正确配置了 localStorage mock

### Q2: 测试失败 - Cannot find module 'framer-motion'
**A**: 添加 moduleNameMapper 配置:
```javascript
moduleNameMapper: {
  'framer-motion': '<rootDir>/__mocks__/framer-motion.js'
}
```

### Q3: 测试运行缓慢
**A**: 使用 `--maxWorkers=4` 限制并发数:
```bash
npm test -- --maxWorkers=4
```

## 🔧 CI/CD 集成

### GitHub Actions 示例

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm install
      - run: cd frontend && npm test -- --coverage
      - uses: codecov/codecov-action@v3
```

## 📚 参考资��

- [Jest 官方文档](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Hooks](https://react-hooks-testing-library.com/)

## 🎉 总结

这个测试套件提供了完整的恐怖模式功能覆盖，包括:
- ✅ 30+ 个测试用例
- ✅ 所有核心功能测试
- ✅ 边界值和异常情况测试
- ✅ 完整游戏流程模拟
- ✅ 性能基准测试
- ✅ localStorage 持久化测试

运行测试后，你可以确保所有恐怖模式功能按预期工作！
