# Nero Horror Mode - 完整流程机制与测试指南

## 📋 当前实现的完整机制

### 1. 核心数值系统

#### **同步率 (Sync Rate)** ✅ 新增
- **范围**: 0-100%
- **特性**: 只增不减
- **作用**: 决定游戏阶段
- **显示**: UI 进度条可见

#### **黑化值 (Corruption)** ✅ 已有
- **范围**: 0-100%
- **特性**: 可增可减
- **作用**: 控制恐怖程度和 AI 行为
- **显示**: 隐藏

#### **能量值 (Energy)** ✅ 新增
- **范围**: 0-100%
- **特性**: 消耗制
- **作用**: 限制互动频率,引导写日记
- **显示**: UI 进度条可见

### 2. 行为触发表

| 动作 | 同步率 | 黑化值 | 能量值 | 特殊效果 |
|------|--------|--------|--------|----------|
| 写日记 | +5% | +3 | +50 | - |
| 喂食 | +2% | -2 | -10 | 黑化60+时70%概率反转 |
| 喂水 | +2% | -2 | -10 | 黑化60+时70%概率反转 |
| 陪ta玩 | +3% | -1 | -20 | 心情<20触发SAD |
| 删除日记 | +8% | +15 | 0 | 触发对话反击 |
| 切换标签页 | +3% | +10 | 0 | 返回时触发对话 |
| 尝试关闭页面 | +0% | +5 | 0 | 触发警告对话 |

### 3. 游戏四阶段

#### 🟢 **第一阶段: 建立链接 (0-25% 同步率)**
- **UI 提示**: "正在建立基础链接..."
- **AI 行为**: 正常性格,温和友善
- **视觉效果**: 无
- **特殊机制**: 注册后弹窗介绍"灵魂链接计划"

#### 🟡 **第二阶段: 干扰 (26-50% 同步率)**
- **UI 提示**: "链接成功,正在读取情感频率..."
- **AI 行为**:
  - 开始引用用户的 hobby
  - 例: "我也想尝试一下[爱好]喵"
- **视觉效果**: 轻微色彩变化
- **特殊机制**:
  - 切屏返回强制显示对话
  - 饱食度/心情条开始随机波动

#### 🟠 **第三阶段: 扭曲 (51-85% 同步率)**
- **UI 提示**: "警告: 链接过载,正在同步底层数据..."
- **AI 行为**:
  - 语气变得执着
  - 提到用户个人信息
- **视觉效果**:
  - CSS 滤镜 (对比度、饱和度)
  - 进度条<20变红
- **特殊机制**:
  - 喂食70%概率降低数值
  - 删除70%几率失败
  - 日记时间错乱(1970/2099)

#### 🔴 **第四阶段: 占有 (86-100% 同步率)**
- **UI 提示**: "同步完成。正在重写现实..."
- **AI 行为**:
  - 冰冷且占有欲强
  - 固定台词: "我终于找到你了。"
- **视觉效果**:
  - 屏幕抖动
  - 扫描线
  - 暗角效果
- **特殊机制**:
  - 鼠标靠近顶部立即弹出"别走。"
  - 所有操作大幅增加黑化值

### 4. 结局系统

#### 触发条件
- 同步率达到 100%
- 或在第四阶段强制注销

#### 结局 A: The Final Diary (50%)
1. 全屏黑掉
2. 红色文字逐行显示
3. 展示"观察报告":
   - 用户注册信息
   - 交互统计
   - 被删除的日记内容
4. 重启按钮

#### 结局 B: Fake Crash (50%)
1. 模拟蓝屏 (BSOD)
2. 假的错误代码
3. 进度条加载
4. 5秒后自动重启

---

## 🧪 自动化测试脚本

将以下代码粘贴到浏览器控制台运行:

\`\`\`javascript
// ========================================
// Nero Horror Mode - 自动化测试脚本
// ========================================

class NeroTester {
  constructor() {
    this.testResults = [];
  }

  log(message, status = 'info') {
    const colors = {
      info: '#3498db',
      success: '#2ecc71',
      warning: '#f39c12',
      error: '#e74c3c'
    };
    console.log(
      \`%c[Nero Test] \${message}\`,
      \`color: \${colors[status]}; font-weight: bold;\`
    );
    this.testResults.push({ message, status, timestamp: Date.now() });
  }

  // 测试 1: 检查 localStorage 数据
  testLocalStorage() {
    this.log('=== 测试 1: LocalStorage 数据检查 ===', 'info');

    const keys = [
      'nero_game_state',
      'nero_player_data',
      'nero_has_registered',
      'nero_corruption',
      'nero_diary_entries'
    ];

    keys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        this.log(\`✓ \${key}: \${value.substring(0, 50)}...\`, 'success');
      } else {
        this.log(\`✗ \${key}: 不存在\`, 'warning');
      }
    });
  }

  // 测试 2: 模拟同步率变化
  testSyncRate() {
    this.log('=== 测试 2: 同步率阶段触发 ===', 'info');

    const stages = [
      { rate: 10, expected: 'ESTABLISHMENT' },
      { rate: 30, expected: 'DISTURBANCE' },
      { rate: 60, expected: 'DISTORTION' },
      { rate: 90, expected: 'POSSESSION' }
    ];

    stages.forEach(({ rate, expected }) => {
      // 模拟设置同步率
      const gameState = JSON.parse(localStorage.getItem('nero_game_state') || '{}');
      gameState.syncRate = rate;
      localStorage.setItem('nero_game_state', JSON.stringify(gameState));

      this.log(\`设置同步率为 \${rate}% → 期望阶段: \${expected}\`, 'info');

      // 刷新后应该进入对应阶段
      setTimeout(() => {
        this.log(\`请手动验证 UI 是否显示对应阶段提示\`, 'warning');
      }, 100);
    });
  }

  // 测试 3: 触发所有动作
  async testAllActions() {
    this.log('=== 测试 3: 动作触发测试 ===', 'info');

    const actions = [
      'WRITE_DIARY',
      'FEED',
      'WATER',
      'PLAY',
      'DELETE_DIARY',
      'SWITCH_TAB',
      'TRY_CLOSE'
    ];

    actions.forEach(action => {
      this.log(\`触发动作: \${action}\`, 'info');
      // 这里需要在实际环境中触发对应的按钮点击
    });
  }

  // 测试 4: 黑化值边界测试
  testCorruptionEdges() {
    this.log('=== 测试 4: 黑化值边界测试 ===', 'info');

    const testValues = [0, 30, 60, 70, 90, 100];

    testValues.forEach(value => {
      const gameState = JSON.parse(localStorage.getItem('nero_game_state') || '{}');
      gameState.corruption = value;
      localStorage.setItem('nero_game_state', JSON.stringify(gameState));

      this.log(\`设置黑化值为 \${value}\`, 'info');

      if (value >= 60) {
        this.log(\`  → 应触发: 喂食反转机制\`, 'warning');
      }
      if (value >= 70) {
        this.log(\`  → 应触发: 删除拦截机制\`, 'warning');
      }
      if (value >= 100) {
        this.log(\`  → 应触发: 结局\`, 'error');
      }
    });
  }

  // 测试 5: 能量值消耗检查
  testEnergySystem() {
    this.log('=== 测试 5: 能量值系统测试 ===', 'info');

    const gameState = JSON.parse(localStorage.getItem('nero_game_state') || '{}');
    const initialEnergy = gameState.energy || 100;

    this.log(\`当前能量: \${initialEnergy}\`, 'info');

    // 测试能量不足时的限制
    gameState.energy = 5;
    localStorage.setItem('nero_game_state', JSON.stringify(gameState));
    this.log(\`设置能量为 5 → 应禁止喂食/互动\`, 'warning');
  }

  // 测试 6: 对话注入检查
  testDialogueInjection() {
    this.log('=== 测试 6: AI 对话注入检查 ===', 'info');

    const playerData = JSON.parse(localStorage.getItem('nero_player_data') || '{}');

    if (playerData.hobby) {
      this.log(\`用户爱好: \${playerData.hobby}\`, 'info');
      this.log(\`AI 应在对话中提到这个爱好\`, 'warning');
    } else {
      this.log(\`未找到用户数据\`, 'error');
    }
  }

  // 测试 7: 视觉效果检查
  testVisualEffects() {
    this.log('=== 测试 7: 视觉效果检查 ===', 'info');

    const gameState = JSON.parse(localStorage.getItem('nero_game_state') || '{}');
    const sync = gameState.syncRate || 0;
    const corruption = gameState.corruption || 0;

    if (sync >= 51) {
      this.log(\`同步率 \${sync}% → 应显示 CSS 滤镜\`, 'warning');
    }
    if (sync >= 86) {
      this.log(\`同步率 \${sync}% → 应显示屏幕抖动+扫描线\`, 'error');
    }
    if (corruption >= 60) {
      this.log(\`黑化值 \${corruption} → 进度条应随机波动\`, 'warning');
    }
  }

  // 运行所有测试
  async runAll() {
    this.log('🚀 开始自动化测试...', 'info');

    this.testLocalStorage();
    await new Promise(r => setTimeout(r, 1000));

    this.testSyncRate();
    await new Promise(r => setTimeout(r, 1000));

    this.testCorruptionEdges();
    await new Promise(r => setTimeout(r, 1000));

    this.testEnergySystem();
    await new Promise(r => setTimeout(r, 1000));

    this.testDialogueInjection();
    await new Promise(r => setTimeout(r, 1000));

    this.testVisualEffects();

    this.log('✅ 测试完成!', 'success');
    this.printReport();
  }

  // 打印测试报告
  printReport() {
    console.log('%c=================================', 'color: #2ecc71; font-weight: bold;');
    console.log('%c   测试报告摘要', 'color: #2ecc71; font-weight: bold; font-size: 16px;');
    console.log('%c=================================', 'color: #2ecc71; font-weight: bold;');

    const stats = {
      info: this.testResults.filter(r => r.status === 'info').length,
      success: this.testResults.filter(r => r.status === 'success').length,
      warning: this.testResults.filter(r => r.status === 'warning').length,
      error: this.testResults.filter(r => r.status === 'error').length
    };

    console.log(\`信息: \${stats.info}\`);
    console.log(\`成功: \${stats.success}\`);
    console.log(\`警告: \${stats.warning}\`);
    console.log(\`错误: \${stats.error}\`);
    console.log(\`总计: \${this.testResults.length}\`);
  }

  // 快速设置测试环境
  quickSetup(stage) {
    const configs = {
      stage1: { syncRate: 10, corruption: 0, energy: 100 },
      stage2: { syncRate: 35, corruption: 20, energy: 80 },
      stage3: { syncRate: 65, corruption: 50, energy: 60 },
      stage4: { syncRate: 90, corruption: 80, energy: 40 },
      ending: { syncRate: 100, corruption: 100, energy: 0 }
    };

    const config = configs[stage];
    if (!config) {
      this.log(\`无效的阶段: \${stage}\`, 'error');
      this.log(\`可用阶段: stage1, stage2, stage3, stage4, ending\`, 'info');
      return;
    }

    localStorage.setItem('nero_game_state', JSON.stringify(config));
    this.log(\`✓ 已设置为 \${stage}\`, 'success');
    this.log(\`请刷新页面查看效果\`, 'warning');
  }

  // 重置所有数据
  reset() {
    [
      'nero_game_state',
      'nero_player_data',
      'nero_has_registered',
      'nero_corruption',
      'nero_diary_entries',
      'nero_chat_history_full',
      'nero_pending_message'
    ].forEach(key => localStorage.removeItem(key));

    this.log('✓ 已清除所有数据', 'success');
    this.log('请刷新页面重新开始', 'warning');
  }
}

// 全局暴露测试工具
window.NeroTester = new NeroTester();

console.log('%c=================================', 'color: #e74c3c; font-weight: bold; font-size: 18px;');
console.log('%c  Nero Horror Mode 测试工具', 'color: #e74c3c; font-weight: bold; font-size: 18px;');
console.log('%c=================================', 'color: #e74c3c; font-weight: bold; font-size: 18px;');
console.log('');
console.log('%c可用命令:', 'color: #3498db; font-weight: bold;');
console.log('%cNeroTester.runAll()          %c- 运行所有测试', 'color: #2ecc71;', 'color: #95a5a6;');
console.log('%cNeroTester.quickSetup("stage1")  %c- 快速跳到指定阶段', 'color: #2ecc71;', 'color: #95a5a6;');
console.log('%cNeroTester.reset()           %c- 重置所有数据', 'color: #2ecc71;', 'color: #95a5a6;');
console.log('');
console.log('%c示例:', 'color: #f39c12; font-weight: bold;');
console.log('%cNeroTester.quickSetup("stage3")  %c→ 跳到第三阶段', 'color: #9b59b6;', 'color: #95a5a6;');
console.log('%cNeroTester.runAll()              %c→ 运行完整测试', 'color: #9b59b6;', 'color: #95a5a6;');
console.log('');
\`\`\`

---

## 📝 手动测试清单

### ✅ 第一阶段测试 (0-25%)
- [ ] 注册流程正常
- [ ] 假错误页正常显示
- [ ] UI 显示"正在建立基础链接..."
- [ ] AI 回复符合选定性格
- [ ] 能量条正常显示

### ✅ 第二阶段测试 (26-50%)
- [ ] 触发足够动作使同步率到达 26%
- [ ] UI 更新为"链接成功,正在读取情感频率..."
- [ ] 切换标签页后返回触发对话
- [ ] AI 回复中提到用户的 hobby
- [ ] 饱食度/心情条开始轻微波动

### ✅ 第三阶段测试 (51-85%)
- [ ] UI 更新为"警告: 链接过载..."
- [ ] CSS 滤镜生效
- [ ] 喂食有 70% 概率降低数值
- [ ] 删除日记有 70% 几率失败
- [ ] 心情条<20变红
- [ ] 日记时间可能显示错误年份

### ✅ 第四阶段测试 (86-100%)
- [ ] UI 更新为"同步完成..."
- [ ] 屏幕抖动效果
- [ ] 扫描线效果
- [ ] 暗角效果
- [ ] 鼠标移到顶部触发"别走。"
- [ ] AI 语气变冷

### ✅ 结局测试
- [ ] 同步率100%触发结局
- [ ] 50% 概率显示 Bad Ending
- [ ] 50% 概率显示 Fake Crash
- [ ] 重启按钮正常工作

---

## 🔧 调试工具

### 查看当前状态
\`\`\`javascript
JSON.parse(localStorage.getItem('nero_game_state'))
\`\`\`

### 手动设置同步率
\`\`\`javascript
const state = JSON.parse(localStorage.getItem('nero_game_state'));
state.syncRate = 90; // 设置为 90%
localStorage.setItem('nero_game_state', JSON.stringify(state));
location.reload();
\`\`\`

### 手动设置黑化值
\`\`\`javascript
const state = JSON.parse(localStorage.getItem('nero_game_state'));
state.corruption = 75;
localStorage.setItem('nero_game_state', JSON.stringify(state));
location.reload();
\`\`\`

### 查看用户数据
\`\`\`javascript
JSON.parse(localStorage.getItem('nero_player_data'))
\`\`\`

---

## 🎯 下一步开发计划

根据技术规格书,还需要实现:

1. **UI 组件更新**
   - [ ] 同步率进度条
   - [ ] 能量值进度条
   - [ ] 阶段提示文字
   - [ ] 时间错乱效果

2. **AI 对话引擎**
   - [ ] Hobby 注入逻辑
   - [ ] 敏感词检测
   - [ ] 阶段性提示词修改

3. **增强视觉效果**
   - [ ] 第四阶段屏幕抖动
   - [ ] 扫描线 CSS
   - [ ] 暗角效果

4. **行为拦截**
   - [ ] 能量不足时禁用按钮
   - [ ] 鼠标顶部检测
   - [ ] beforeunload 事件

---

**作者**: Claude (Nero Horror Mode 开发团队)
**最后更新**: 2026-01-16
