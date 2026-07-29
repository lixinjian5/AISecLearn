# R003 — XSS 检测（未转义的输出）

## 规则信息

| 字段 | 值 |
|------|-----|
| ID | R003 |
| 名称 | XSS 检测 - 未转义的输出 |
| 严重程度 | 🔴 Critical |
| 适用语言 | PHP, Java, JavaScript |

## 检测模式

### PHP

```
# ❌ 危险：直接输出未处理
echo $_GET['name'];
echo $userInput;
print $_POST['message'];

# ❌ 危险：拼接 HTML
echo "<div>" . $userInput . "</div>";

# ✅ 安全：HTML 转义
echo htmlspecialchars($_GET['name'], ENT_QUOTES, 'UTF-8');
```

### Java (JSP)

```
<!-- ❌ 危险 -->
<div><%= request.getParameter("name") %></div>

<!-- ✅ 安全 -->
<div><%= Encode.forHtml(request.getParameter("name")) %></div>
```

### JavaScript

```
// ❌ 危险
document.getElementById('output').innerHTML = userInput;
element.innerHTML = userInput + " 您好";

// ✅ 安全：用 textContent 替代 innerHTML
document.getElementById('output').textContent = userInput;

// ✅ 安全：使用 createTextNode
document.getElementById('output').appendChild(document.createTextNode(userInput));
```

## 检测标准

1. 用户输入数据直接输出了到页面
2. 没有经过 HTML 实体转义
3. 使用了 `innerHTML` 等允许 HTML 解析的方式

## 修复建议

- 使用 `htmlspecialchars()`（PHP）、`Encode.forHtml()`（Java）、`textContent`（JS）
- 实施内容安全策略（CSP）
- 对 Cookie 设置 `HttpOnly` 标志
