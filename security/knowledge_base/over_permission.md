# 越权漏洞 (Over Permission / Broken Access Control)

## 原理

越权漏洞指用户能够执行超出自己权限范围的操作。攻击者通过修改请求参数（如用户 ID、角色 ID），以低权限用户身份访问本应只有高权限用户才能访问的资源。

根本原因：**服务器没有对每个请求都做权限校验**，仅依赖前端隐藏按钮或菜单来"限制"访问。

## 两种类型

### 水平越权

攻击者访问**同级别**其他用户的数据。

```
用户 A（普通用户）看到的是自己的订单
修改参数：?order_id=1001 → ?order_id=1002
看到用户 B 的订单信息
```

### 垂直越权

攻击者以低权限角色执行**高权限角色**的操作。

```
普通用户访问：
/admin/manage_users.php       → 403（正常，被拦截了）
但如果服务器没检查权限，普通用户直接访问 URL 就能管理用户
```

## 示例

### 水平越权漏洞

```php
<?php
// 危险：只用了用户传入的 ID，没有校验归属
$user_id = $_GET['user_id'];
$query = "SELECT * FROM profiles WHERE id = {$user_id}";
$result = mysqli_query($conn, $query);
$profile = mysqli_fetch_assoc($result);
echo json_encode($profile);
?>
```

攻击：`?user_id=1001` → 看到自己；`?user_id=1002` → 看到别人。

### 垂直越权漏洞

```php
<?php
// 危险：只检查是否登录，没检查角色
session_start();
if (isset($_SESSION['logged_in'])) {
    // 管理后台
}
?>
```

任何已登录用户（包括普通用户）都可以访问管理后台。

## 防御

| 防御措施 | 说明 |
|----------|------|
| 服务端权限校验 | 每个 API 都要检查当前用户是否有权操作该资源 |
| 用户-资源映射 | 用户只能操作属于自己的资源，不能通过参数修改他人 ID |
| 角色-权限分离（RBAC） | 基于角色的访问控制，每个角色对应不同的权限集 |
| 不可预测的 ID | 使用 UUID 代替自增数字 ID（但不是真正的防御） |

### 安全代码示例

```python
# 危险
@app.route('/api/profile')
def get_profile():
    user_id = request.args.get('user_id')
    profile = db.query(f"SELECT * FROM profiles WHERE id = {user_id}")
    return jsonify(profile)

# 安全：使用当前登录用户的 ID，不允许传入
@app.route('/api/profile')
def get_profile():
    profile = db.query("SELECT * FROM profiles WHERE id = ?", 
                       (session['user_id'],))
    return jsonify(profile)

# 安全：校验资源归属
@app.route('/api/order/<order_id>')
def get_order(order_id):
    order = db.query("SELECT * FROM orders WHERE id = ? AND user_id = ?",
                     (order_id, session['user_id']))
    if not order:
        return "无权访问", 403
    return jsonify(order)
```

## 越权 vs CSRF

| | 越权 | CSRF |
|--|------|------|
| 原因 | 服务端没做权限验证 | 服务端没验证请求来源 |
| 攻击手段 | 修改参数值 | 诱导用户在不知情时发请求 |
| 防御核心 | 检查用户身份与资源归属 | CSRF Token / SameSite |

## 真实案例

### 案例：GitHub 越权漏洞（2019）
- 漏洞：水平越权，攻击者可以通过修改参数访问其他用户的私有仓库
- 后果：私有仓库代码泄露
- 教训：每个 API 端点都要验证请求者对被请求资源的所有权

## 在 Pikachu 靶场中的对应模块

Pikachu 提供了水平越权和垂直越权两个练习场景。
