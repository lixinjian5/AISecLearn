# SQL 注入 (SQL Injection)

## 原理

SQL 注入发生在应用程序将用户输入的数据直接拼接到 SQL 查询语句中。攻击者通过构造特殊输入，改变 SQL 语句的语义，从而执行非预期的数据库操作。

根本原因：**没有对用户输入做充分的过滤或使用参数化查询**，而是用字符串拼接的方式构建 SQL。

## 常见类型

| 类型 | 说明 | 特点 |
|------|------|------|
| 数字型注入 | 注入点在数字参数上 | `id=1 AND 1=1` |
| 字符型注入 | 注入点在字符串参数上 | `name='admin' OR '1'='1` |
| 搜索型注入 | 注入点在 LIKE 搜索中 | `%' OR 1=1 -- ` |
| 布尔盲注 | 页面不回显数据，只返回真/假 | 通过 True/False 逐字符猜数据 |
| 时间盲注 | 页面没有任何回显区别 | 通过 `SLEEP()` 判断条件真假 |
| 报错注入 | 数据库错误信息暴露给用户 | 利用 `updatexml()` 等函数报错回显 |
| 联合查询注入 | 使用 UNION 合并查询结果 | `UNION SELECT 1,2,3` |
| 堆叠查询注入 | 一次执行多条 SQL | `; DROP TABLE users--` |
| 宽字节注入 | 利用 GBK 编码吃掉转义符 | `%df'` 绕过 `addslashes()` |
| Insert/Update/Delete 注入 | 增删改语句中的注入 | 利用 `subquery` 窃取数据 |
| HTTP Header 注入 | User-Agent/Cookie 等处注入 | 请求头中构造 payload |

## 示例

### 有漏洞的代码（Python + SQLite）

```python
# 危险！字符串拼接 SQL
username = request.GET['username']
query = "SELECT * FROM users WHERE username = '" + username + "'"
cursor.execute(query)
```

### 攻击 Payload

输入：`admin' OR '1'='1`

生成的 SQL：
```sql
SELECT * FROM users WHERE username = 'admin' OR '1'='1'
```

——返回所有用户，绕过登录。

### 更严重的 Payload

输入：`'; DROP TABLE users; --`

生成的 SQL：
```sql
SELECT * FROM users WHERE username = ''; DROP TABLE users; --'
```

——删除整个用户表。

## 防御

| 防御措施 | 说明 | 优先级 |
|----------|------|--------|
| 参数化查询（Prepared Statement） | SQL 语句模板化，用户输入当成参数而非代码 | ✅ 必做 |
| ORM 框架 | 使用 SQLAlchemy、MyBatis 等，默认防注入 | ✅ 推荐 |
| 输入校验 | 对类型、长度、格式做白名单验证 | ✅ 辅助 |
| 最小权限 | 数据库账户只给必要权限（不用于 DDL） | ✅ 辅助 |
| WAF（Web 应用防火墙） | 拦截常见的注入 Payload | ⚠️ 补充 |

### 安全的代码（参数化查询）

```python
# 安全！使用参数化查询
username = request.GET['username']
query = "SELECT * FROM users WHERE username = ?"
cursor.execute(query, (username,))
```

## 真实案例

### 案例 1：2017 年 Equifax 数据泄露（1.43 亿条记录）
- 漏洞：Apache Struts 框架的 SQL 注入漏洞（CVE-2017-9805）
- 后果：攻击者窃取了 1.43 亿美国用户的姓名、SSN、生日等敏感信息
- 教训：框架漏洞也要及时打补丁

### 案例 2：2020 年台湾多家大学遭勒索攻击
- 手法：SQL 注入 + 勒索软件
- 后果：多所高校网站被篡改，数据库被加密
- 教训：学生选课系统的搜索功能存在 SQL 注入

## 在 Pikachu 靶场中的对应模块

Pikachu 提供了丰富的 SQL 注入练习场景，包括数字型、字符型、搜索型、XX 型、Insert/Update 注入、Delete 注入、HTTP Header 注入、布尔盲注、时间盲注、宽字节注入。每个场景都包含"提示"按钮，可以查看帮助信息。
