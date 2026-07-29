# R002 — SQL 注入检测（未使用参数化查询）

## 规则信息

| 字段 | 值 |
|------|-----|
| ID | R002 |
| 名称 | SQL 注入检测 - 未使用参数化查询 |
| 严重程度 | 🔴 Critical |
| 适用语言 | Python, PHP, Java |

## 检测模式

检测使用了数据库执行函数但**不是参数化查询**的情况。

### Python

```
# ❌ cursor.execute("SELECT * FROM users WHERE id = " + id)
# ✅ cursor.execute("SELECT * FROM users WHERE id = ?", (id,))
```

### PHP

```
# ❌ mysqli_query($conn, "SELECT * FROM users WHERE id = " . $id)
# ✅ $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?")
# ✅ $stmt->bind_param("s", $id)
```

### Java

```
# ❌ Statement stmt = conn.createStatement();
# ❌ ResultSet rs = stmt.executeQuery("SELECT * FROM users WHERE id=" + id);
# ✅ PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM users WHERE id=?");
# ✅ pstmt.setString(1, id);
```

## 检测标准

1. 调用了数据库执行函数（如 `execute`、`query`、`mysqli_query` 等）
2. 参数是字符串拼接构建的查询语句
3. 没有使用参数化查询（Prepared Statement）模式

## 修复建议

所有数据库查询都应使用**参数化查询（Prepared Statement）**，这是防 SQL 注入最有效的手段。
