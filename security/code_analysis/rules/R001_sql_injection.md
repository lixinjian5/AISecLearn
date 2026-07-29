# R001 — SQL 注入检测（字符串拼接）

## 规则信息

| 字段 | 值 |
|------|-----|
| ID | R001 |
| 名称 | SQL 注入检测 - 字符串拼接 |
| 严重程度 | 🔴 Critical |
| 适用语言 | Python, PHP, Java, JavaScript |

## 检测模式

### Python

```
"SELECT * FROM " + 变量
"SELECT * FROM %s" % 变量
f"SELECT * FROM {变量}"
"SELECT ".format(变量)

os.system("SELECT * FROM" + 变量)  # 不直接相关但也不安全
```

### PHP

```
"SELECT * FROM " . $_GET['id']
"SELECT * FROM {$id}"
```

### Java

```
"SELECT * FROM " + request.getParameter("id")
"SELECT * FROM %s".formatted(userInput)
```

### JavaScript (Node.js)

```
`SELECT * FROM ${req.query.id}`
"SELECT * FROM " + req.query.id
```

## 检测标准

以下情况触发告警：

1. SQL 查询语句（SELECT/INSERT/UPDATE/DELETE）使用了**字符串拼接**方式
2. 拼接内容包含**用户输入来源**（请求参数、Cookie、请求体等）
3. 查询语句直接传入数据库执行函数

## 不触发的情况

- 使用了参数化查询（`cursor.execute(sql, params)`）
- 使用了 ORM（如 SQLAlchemy、Eloquent、Hibernate、Prisma）
- 拼接的是完全在服务端生成的值（非用户输入）

## 修复建议

```python
# ❌ 危险
username = request.GET['username']
sql = "SELECT * FROM users WHERE username = '" + username + "'"
cursor.execute(sql)

# ✅ 安全：参数化查询
username = request.GET['username']
sql = "SELECT * FROM users WHERE username = ?"
cursor.execute(sql, (username,))

# ✅ 安全：使用 ORM
User.query.filter_by(username=username).first()
```
