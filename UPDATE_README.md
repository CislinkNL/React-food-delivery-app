# Firebase菜单字段更新工具

## 功能说明
为所有菜品添加三个新字段：
- `onlyRestaurant`: 是否只限餐厅 (boolean)
- `categoryTakeAway`: 外卖分类ID (string) 
- `options`: 菜品选项 (string)

## 安装依赖

```bash
pip install firebase-admin
```

## 准备工作

### 1. 获取Firebase Admin SDK密钥
1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 选择你的项目 (cislink)
3. 点击设置 > 项目设置 > 服务账号
4. 点击"生成新的私钥"
5. 下载JSON文件，重命名为 `cislink-firebase-adminsdk-kt8fr-4c591329ea.json`
6. 将文件放在脚本同一目录下

### 2. 检查配置文件
编辑 `update_config.py` 确认以下配置：
- Firebase数据库URL
- 菜单数据路径
- 分类映射规则
- 特殊规则关键词

## 使用方法

### 方案1: 简化版脚本 (推荐)
```bash
# 测试模式 - 只分析不更新
python simple_update.py --dry-run

# 实际更新
python simple_update.py
```

### 方案2: 完整版脚本
```bash
# 测试模式
python update_menu_fields.py --dry-run

# 实际更新
python update_menu_fields.py
```

## 数据源选择
运行时会提示选择数据源：
1. **本地JSON文件** - 从 `example_menukaart_data.json` 读取
2. **Firebase数据库** - 直接从Firebase读取现有数据

## 字段映射规则

### categoryTakeAway映射
基于 `sortingNrm` 值自动映射到分类ID：

| sortingNrm范围 | 分类ID | 分类名称           |
| -------------- | ------ | ------------------ |
| 1-12           | Cat1   | Nigiri             |
| 13-30          | Cat2   | Gunkan/Temaki      |
| 31-54          | Cat3   | Maki               |
| 55-61          | Cat4   | Pokebowls          |
| 62-71          | Cat5   | Salade             |
| 72-76          | Cat8   | Warme gerechten    |
| 77-100         | Cat6   | Soep               |
| 101-136        | Cat9   | Dinner only        |
| 137-146        | Cat11  | Desserts           |
| 147-200        | Cat10  | Specials           |
| 201-219        | Cat16  | Frisdranken        |
| 220-230        | Cat17  | Bieren             |
| 231-244        | Cat22  | Japanse dranken    |
| 245-249        | Cat18  | Wijnen/Aperitieven |
| 250-291        | Cat20  | Sterke dranken     |
| 292-313        | Cat21  | Warme dranken      |
| 314+           | Cat19  | Cocktails          |

### onlyRestaurant判断
检查菜品描述或过敏信息是否包含关键词：
- "sashimi"
- "rauwe" 
- "niet geschikt voor zwangeren"
- "alleen restaurant"
- "rauw vlees"
- "rawe vis"

### options判断
检查是否有选项相关关键词：
- "keuze"
- "optie" 
- "extra"
- "topping"
- "sauce"
- "bijgerecht"
- "garnering"

## 安全功能

### 自动备份
- 每次运行前自动备份原始数据
- 保存更新后的数据到本地文件
- 备份文件包含时间戳

### 测试模式
使用 `--dry-run` 参数可以：
- 分析现有数据
- 预览更新结果
- 生成统计报告
- 不实际修改Firebase

### 批量更新
- 分批处理避免超时
- 批次间自动延迟
- 实时进度显示

## 输出示例

```
🚀 开始菜单字段更新...
✅ Firebase连接成功
✅ 从文件加载 1234 个菜品
🔄 添加新字段...

📊 数据分析:
总菜品数: 1234
只限餐厅: 45
有选项: 78

📋 分类分布:
  Cat1: 123
  Cat2: 89
  Cat3: 156
  ...

💾 备份保存: menu_updated_1703123456.json

⚠️ 即将更新Firebase数据库
确认继续? (y/N): y

🔄 开始更新，共1234个菜品，分25批...
📦 第1/25批 (50个菜品)
📦 第2/25批 (50个菜品)
...
✅ Firebase更新完成

🎉 更新完成! 备份文件: menu_updated_1703123456.json
```

## 故障排除

### 常见错误

1. **Firebase连接失败**
   - 检查密钥文件路径和权限
   - 确认数据库URL正确

2. **数据加载失败**
   - 检查Firebase路径是否存在
   - 确认本地JSON文件格式正确

3. **权限不足**
   - 确保Service Account有数据库写入权限

### 恢复数据
如果更新出现问题，可以使用备份文件恢复：
1. 找到对应的备份文件 (menu_original_*.json)
2. 手动导入到Firebase或使用脚本恢复

## 注意事项

1. **生产环境操作**
   - 建议先在测试环境验证
   - 使用 `--dry-run` 预览结果
   - 确保有完整的数据备份

2. **网络稳定性**
   - 确保网络连接稳定
   - 大量数据更新可能需要较长时间

3. **数据一致性**
   - 更新期间避免其他修改操作
   - 建议在低峰期进行更新