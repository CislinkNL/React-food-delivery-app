# 🚀 Firebase 外卖系统部署指南

## 📋 部署前准备

### 1. 环境要求
- Node.js 16+ 
- npm 或 yarn
- Firebase账户
- Git (可选)

### 2. 本地测试确认
```bash
# 确保本地运行正常
npm start

# 构建生产版本测试
npm run build
```

## 🔧 Firebase 项目配置

### 1. 创建 Firebase 项目
1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 点击 "创建项目"
3. 输入项目名称（如：chinese-restaurant-delivery）
4. 可选：启用 Google Analytics
5. 创建项目

### 2. 启用必要服务

#### Firestore Database
1. 在左侧导航栏选择 "Firestore Database"
2. 点击 "创建数据库"
3. 选择 "生产模式" 或 "测试模式"
4. 选择数据库位置（建议选择离用户最近的位置）

#### Authentication (可选)
1. 在左侧导航栏选择 "Authentication"
2. 点击 "开始使用"
3. 在 "Sign-in method" 标签页启用需要的登录方式

#### Storage (可选)
1. 在左侧导航栏选择 "Storage"
2. 点击 "开始使用"
3. 配置安全规则

### 3. 获取 Web 应用配置
1. 在项目概览页面，点击 Web 图标 (`</>`)
2. 注册应用，输入应用名称
3. 复制配置对象中的值
4. 将这些值填入 `.env` 文件

## 🏗️ 生产环境配置

### 1. 创建生产环境变量文件
```bash
# 创建生产环境配置
cp .env .env.production
```

### 2. 更新生产环境配置
```env
# 生产环境设置
REACT_APP_ENVIRONMENT=production
REACT_APP_DEBUG_MODE=false
REACT_APP_USE_EMULATOR=false

# 确保使用生产环境的Firebase配置
REACT_APP_FIREBASE_PROJECT_ID=your-production-project-id
# ... 其他生产环境配置
```

## 🚀 部署方式

### 方式1: Firebase Hosting (推荐)

#### 安装 Firebase CLI
```bash
npm install -g firebase-tools
```

#### 登录 Firebase
```bash
firebase login
```

#### 初始化 Firebase Hosting
```bash
firebase init hosting
```

配置选项：
- 选择现有项目
- Public directory: `build`
- Configure as SPA: `Yes`
- Set up automatic builds: `No` (暂时)

#### 构建和部署
```bash
# 构建生产版本
npm run build

# 部署到 Firebase Hosting
firebase deploy
```

#### 自定义域名 (可选)
1. 在 Firebase Console 的 Hosting 页面
2. 点击 "添加自定义域"
3. 按照指引配置 DNS

### 方式2: Vercel

#### 安装 Vercel CLI
```bash
npm install -g vercel
```

#### 部署
```bash
# 构建
npm run build

# 部署
vercel --prod
```

#### 环境变量配置
在 Vercel 仪表板中配置环境变量

### 方式3: Netlify

#### 方法1: 拖拽部署
1. 运行 `npm run build`
2. 将 `build` 文件夹拖拽到 Netlify 部署页面

#### 方法2: Git 连接
1. 将代码推送到 Git 仓库
2. 在 Netlify 连接 Git 仓库
3. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `build`

## 🔒 安全配置

### Firestore 安全规则
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 菜品数据 - 只读
    match /dishes/{document} {
      allow read: if true;
      allow write: if false; // 仅管理员可写
    }
    
    // 分类数据 - 只读  
    match /categories/{document} {
      allow read: if true;
      allow write: if false;
    }
    
    // 订单数据 - 需要身份验证
    match /orders/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage 安全规则 (如果使用)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if false; // 仅管理员可上传
    }
  }
}
```

## 📊 性能监控

### 1. Firebase Performance Monitoring
```bash
# 安装 Performance 库
npm install firebase/performance
```

### 2. Firebase Analytics
```bash
# 安装 Analytics 库  
npm install firebase/analytics
```

### 3. 错误监控
建议集成如 Sentry 等错误监控服务。

## 🔄 CI/CD 自动部署

### GitHub Actions 示例
创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        env:
          REACT_APP_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          REACT_APP_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          # ... 其他环境变量
          
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: your-project-id
```

## 📱 域名和 SSL

### 自定义域名
1. 在 Firebase Hosting 中添加自定义域名
2. 配置 DNS 记录
3. Firebase 自动提供 SSL 证书

### DNS 配置示例
```
类型: A
名称: @
值: 151.101.1.195

类型: A  
名称: @
值: 151.101.65.195
```

## 🎯 部署后验证

### 1. 功能测试
- [ ] 菜品数据加载正常
- [ ] 分类筛选功能
- [ ] 购物车操作
- [ ] 订单流程
- [ ] 响应式设计

### 2. 性能测试
- [ ] 页面加载速度
- [ ] 图片优化
- [ ] 数据库查询效率

### 3. 兼容性测试
- [ ] 主流浏览器测试
- [ ] 移动设备测试
- [ ] 不同网络环境测试

## 🚨 常见问题

### 构建失败
```bash
# 清理缓存
npm run clean
rm -rf node_modules
npm install
```

### 环境变量问题
- 确保所有 `REACT_APP_` 前缀的变量正确设置
- 重启开发服务器使新环境变量生效

### Firebase 连接问题
- 检查 API 密钥是否正确
- 确认项目 ID 无误
- 验证安全规则配置

### 部署后白屏
- 检查构建输出是否正常
- 确认路由配置（SPA 设置）
- 查看浏览器控制台错误

## 📞 技术支持

如遇到部署问题：
1. 查看相关文档：[README-Firebase.md](./README-Firebase.md)
2. 检查 Firebase Console 中的错误日志
3. 查看浏览器开发者工具中的错误信息

---

🎉 **部署成功后，你的Firebase外卖系统就可以正式上线了！**