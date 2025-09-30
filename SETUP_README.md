# 🍣 荷兰寿司外卖应用 - 配置指南

## 📋 项目概述

这是一个专为荷兰市场打造的现代化寿司外卖应用，具有完整的Firebase集成、移动端优化和荷兰语本地化。

## 🚀 主要功能

### ✨ 核心特性
- 🍣 **实时菜单数据**: Firebase Realtime Database集成
- 🇳🇱 **荷兰语本地化**: 完整的荷兰语界面
- 📱 **移动端优化**: 横向滚动分类菜单，响应式设计
- 🏪 **智能过滤**: 自动区分餐厅专用和外卖菜品
- 🔄 **智能分页**: 每页25项，移动端友好控制

### 🛠️ 技术特性
- ⚡ **React 17.0.2**: 现代化前端框架
- 🔥 **Firebase v9**: 实时数据库和认证
- 🎨 **Bootstrap + 自定义CSS**: 响应式设计
- 🐍 **Python工具链**: 数据库管理工具
- 📊 **智能分类**: 基于sortingNrm的自动分类系统

## 🔧 安装和配置

### 1. 克隆项目
```bash
git clone https://github.com/CislinkNL/React-food-delivery-app.git
cd React-food-delivery-app
git checkout startup
```

### 2. 安装依赖
```bash
npm install
```

### 3. Firebase配置
由于安全原因，Firebase配置文件不包含在代码库中。您需要：

#### 创建Firebase项目
1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 创建新项目或使用现有项目
3. 启用Realtime Database

#### 获取配置文件
1. 在Firebase Console中，转到项目设置
2. 在"服务账户"标签页，生成新的私钥
3. 下载JSON文件并重命名为: `cislink-firebase-adminsdk-[你的项目ID].json`
4. 将文件放在项目根目录

#### 配置数据库结构
```
Develop/
├── categorie/
│   ├── food/          # 食物分类 (Cat1-Cat11)
│   └── drinks/        # 饮品分类 (Cat16-Cat22)
└── menukaart/         # 菜单数据
    ├── item1/         # 菜品1
    ├── item2/         # 菜品2
    └── ...
```

### 4. 更新配置文件
编辑 `update_config.py`:
```python
SERVICE_ACCOUNT_PATH = "cislink-firebase-adminsdk-[你的项目ID].json"
DATABASE_URL = "https://[你的项目ID]-default-rtdb.europe-west1.firebasedatabase.app"
```

## 🚀 运行应用

### 开发模式
```bash
npm start
```
应用将在 http://localhost:3000 开启

### 生产构建
```bash
npm run build
```

## 🗃️ 数据库管理

### Python工具使用

#### 1. 验证数据库连接
```bash
python verify_categories.py
```

#### 2. 更新菜品字段
```bash
python update_menu_fields.py
```

#### 3. 测试分类映射
```bash
python test_specific_category.py
```

### 菜品字段说明
每个菜品包含以下字段：
- `onlyRestaurant`: 是否只限餐厅 (boolean)
- `categoryTakeAway`: 外卖分类ID (string, 如"Cat1")
- `options`: 菜品选项 (string)
- `sortingNrm`: 排序编号 (number, 用于自动分类)

## 📱 页面结构

### 主要页面
- **首页** (`/`): 英雄区域和特色推荐
- **菜单** (`/menu`): 完整菜单浏览，支持分类过滤
- **外卖** (`/takeaway`): 外卖专用页面，排除餐厅专用菜品
- **购物车** (`/cart`): 购物车管理
- **结算** (`/checkout`): 订单确认和支付

### 调试页面
- **分类映射调试** (`/category-mapping-debug`): 分类系统调试工具
- **Firebase测试** (`/firebase-test`): 数据库连接测试

## 🎨 样式定制

### 主要样式文件
- `src/styles/menu.css`: 菜单页面样式
- `src/styles/footer.css`: Footer组件样式
- `src/styles/header.css`: Header组件样式
- `src/styles/layout.css`: 布局容器样式

### 移动端优化
- 横向滚动分类菜单
- Sticky导航栏
- 响应式分页控制
- 触摸友好的界面元素

## 🔒 安全注意事项

### 敏感文件
以下文件包含在 `.gitignore` 中：
- `cislink-firebase-adminsdk-*.json` (Firebase密钥)
- `menu_*.json` (数据备份文件)
- `__pycache__/` (Python缓存)

### 环境变量 (可选)
您也可以使用环境变量配置：
```bash
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_DATABASE_URL=your_database_url
```

## 🛠️ 故障排除

### 常见问题

1. **Firebase连接失败**
   - 检查配置文件是否正确放置
   - 验证数据库URL和权限

2. **分类不显示**
   - 检查Firebase数据库中的分类数据结构
   - 运行 `python verify_categories.py` 验证

3. **菜品显示异常**
   - 确保菜品有正确的 `categoryTakeAway` 字段
   - 检查 `onlyRestaurant` 字段设置

4. **移动端滚动问题**
   - 清除浏览器缓存
   - 检查CSS文件是否正确加载

## 📈 开发计划

### 已完成 ✅
- Firebase数据库集成
- 荷兰语本地化
- 移动端优化
- 分类系统
- 购物车功能
- 智能过滤

### 进行中 🚧
- 支付系统集成
- 用户认证
- 订单管理
- 后台管理界面

### 计划中 📋
- 推送通知
- 客户评价系统
- 优惠券功能
- 多语言支持扩展

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📞 支持

如有问题，请通过以下方式联系：
- 📧 Email: support@cislink.nl
- 🌐 Website: https://cislink.nl
- 📱 GitHub Issues: [项目Issues页面](https://github.com/CislinkNL/React-food-delivery-app/issues)

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

**🍣 荷兰寿司外卖 - 专业、现代、移动优先的外卖解决方案**