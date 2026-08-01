# R005-R017 — 其他安全检测规则

---

## R005 — 文件包含漏洞检测

| 字段 | 值 |
|------|-----|
| ID | R005 |
| 名称 | 文件包含漏洞检测 |
| 严重程度 | 🟠 High |
| 适用语言 | PHP |

### 检测模式

```
# ❌ 危险
include($_GET['page']);
require($_POST['file']);
include_once($userInput . '.php');

# 用户输入被用作文件路径的可疑情况
include("templates/" . $template);
```

### 修复建议

- 使用白名单限制可包含的文件
- 禁用远程文件包含（`allow_url_include = Off`）
- 不要将用户输入直接用作文件路径

---

## R006 — 不安全的反序列化检测

| 字段 | 值 |
|------|-----|
| ID | R006 |
| 名称 | 不安全的反序列化检测 |
| 严重程度 | 🟠 High |
| 适用语言 | PHP, Java, Python |

### 检测模式

```
# PHP
unserialize($_POST['data']);

# Java
ObjectInputStream ois = new ObjectInputStream(new FileInputStream(userFile));
ois.readObject();

# Python
import pickle
pickle.loads(user_input)

import yaml
yaml.load(user_input)  # 未使用 SafeLoader
```

### 修复建议

- 不要反序列化来自用户的数据
- 使用 JSON 替代序列化
- 对序列化数据做签名验证
- 使用类白名单

---

## R007 — eval 危险函数调用检测

| 字段 | 值 |
|------|-----|
| ID | R007 |
| 名称 | eval 危险函数调用检测 |
| 严重程度 | 🟠 High |
| 适用语言 | Python, PHP, JavaScript |

### 检测模式

```
# Python
eval(user_input)
exec(user_input)

# PHP
eval($_GET['code']);
assert($_POST['input']);

# JavaScript
eval(userInput);
new Function(userInput);
```

### 修复建议

- 避免使用 eval()/exec() 执行用户输入
- 使用安全的替代方案（如 JSON.parse 替代 eval）
- 生产环境禁用危险函数

---

## R008 — 文件上传 - 缺乏类型验证

| 字段 | 值 |
|------|-----|
| ID | R008 |
| 名称 | 文件上传 - 缺乏类型验证 |
| 严重程度 | 🟠 High |
| 适用语言 | Python, PHP, Java |

### 检测模式

```
# ❌ 危险：只检查了客户端传来的 Content-Type
file.save(request.FILES['file'].name)   # 使用用户文件名

# ✅ 安全：检查实际文件内容 + 重命名
ALLOWED_EXTENSIONS = {'png', 'jpg', 'gif'}
if file_ext in ALLOWED_EXTENSIONS:
    new_name = uuid.uuid4().hex + '.' + file_ext
    file.save(new_name)
```

### 修复建议

- 使用白名单扩展名
- 验证文件内容（Magic Number）
- 服务器重新生成文件名
- 上传目录禁止执行脚本

---

## R009 — 路径遍历检测

| 字段 | 值 |
|------|-----|
| ID | R009 |
| 名称 | 路径遍历检测 |
| 严重程度 | 🟡 Medium |
| 适用语言 | Python, PHP, Java |

### 检测模式

```
# 用户输入直接用作文件路径
open(filepath).read()
readfile($filename)
new File(userInput)
```

### 修复建议

- 使用文件 ID 而非路径
- 调用 `realpath()` 校验最终路径是否在允许范围内
- 禁止路径中出现 `../`

---

## R010 — 硬编码密码/密钥检测

| 字段 | 值 |
|------|-----|
| ID | R010 |
| 名称 | 硬编码密码/密钥检测 |
| 严重程度 | 🟡 Medium |
| 适用语言 | 所有语言 |

### 检测模式

- 代码中出现 `password = "..."`、`PASSWORD = "..."`
- 代码中出现 `api_key = "..."`、`secret = "..."`、`token = "..."`
- 未使用环境变量或配置文件读取密钥

### 修复建议

- 使用环境变量（`os.environ.get('DB_PASSWORD')`）
- 使用密钥管理服务（Vault, AWS Secrets Manager）
- 将 secrets 添加到 `.gitignore`

---

## R011 — CSRF Token 缺失检测

| 字段 | 值 |
|------|-----|
| ID | R011 |
| 名称 | CSRF Token 缺失检测 |
| 严重程度 | 🟡 Medium |
| 适用语言 | Python, PHP, Java |

### 检测模式

- POST/PUT/DELETE 请求处理中未校验 CSRF Token
- 表单中没有包含 CSRF Token 字段
- 未使用框架内建的 CSRF 防护

### 修复建议

- 使用框架内建 CSRF 防护（Django、Flask-WTF、Laravel、Spring Security）
- 设置 Cookie SameSite 属性

---

## R012 — 危险函数调用 - exec/system

| 字段 | 值 |
|------|-----|
| ID | R012 |
| 名称 | 危险函数 exec/system 调用 |
| 严重程度 | 🟠 High |
| 适用语言 | Python, PHP, JavaScript |

### 检测模式

函数调用列表：`exec`、`system`、`passthru`、`shell_exec`、`popen`、`proc_open`、`preg_replace`（`/e` 修饰符）

### 修复建议

- 尽量不要调用系统命令
- 使用语言内置功能替代
- 如果必须调用，使用 escapeshellarg/escapeshellcmd

---

## R013 — 敏感信息泄露检测

| 字段 | 值 |
|------|-----|
| ID | R013 |
| 名称 | 敏感信息泄露检测 |
| 严重程度 | 🟡 Medium |
| 适用语言 | Python, PHP |

### 检测模式

```
# Python
print(traceback.format_exc())      # 生产环境显示调试信息
app.debug = True                   # 生产环境应关闭

# PHP
ini_set('display_errors', 'On')    # 生产环境应关闭
```

### 修复建议

- 生产环境关闭调试模式
- 使用统一的错误页面
- 日志记录错误但不显示给用户

---

## R014 — XXE 检测

| 字段 | 值 |
|------|-----|
| ID | R014 |
| 名称 | XXE 检测 - XML 外部实体 |
| 严重程度 | 🟠 High |
| 适用语言 | PHP, Java, Python |

### 检测模式

```
# PHP
simplexml_load_string($xmlInput)           # 未禁用外部实体
simplexml_load_file($userFile)

# Python
from lxml import etree
etree.parse(xml_input)                     # 未禁用外部实体

# Java
DocumentBuilderFactory.newInstance()       # 未禁用外部实体
```

### 修复建议

- 禁用外部实体加载
- 使用 JSON 替代 XML
- 过滤 `<!DOCTYPE>` 和 `<!ENTITY>`

---

## R015 — SSRF 检测

| 字段 | 值 |
|------|-----|
| ID | R015 |
| 名称 | SSRF 检测 - 用户控制的 URL 请求 |
| 严重程度 | 🟠 High |
| 适用语言 | Python, PHP, Java |

### 检测模式

```
# Python
requests.get(url_param)
urlopen(user_input)

# PHP
file_get_contents($_GET['url']);
curl_exec($ch);   # 其中 URL 来自用户输入
```

### 修复建议

- 白名单允许的域名/IP
- 禁止访问内网 IP 段
- 禁止 file:// 等内网协议
- 特别拦截云元数据 IP（如 169.254.169.254）

---

## R016 — 越权检测

| 字段 | 值 |
|------|-----|
| ID | R016 |
| 名称 | 越权检测 - 用户可控 ID |
| 严重程度 | 🟡 Medium |
| 适用语言 | Python, PHP, Java |

### 检测模式

- API 中查询用户/订单等资源时，ID 来自用户参数
- 没有检查当前登录用户是否有权访问该资源

### 修复建议

- 每个 API 都校验当前用户对资源的归属
- 使用当前会话中的用户 ID，不要接受用户传入
- 如果允许传入，必须校验绑定关系

---

## R017 — 不安全的 URL 重定向检测

| 字段 | 值 |
|------|-----|
| ID | R017 |
| 名称 | 不安全的 URL 重定向检测 |
| 严重程度 | 🟡 Medium |
| 适用语言 | Python, PHP, Java, JavaScript |

### 检测模式

```
# Python Flask
return redirect(request.args.get('next'))

# PHP
header('Location: ' . $_GET['url']);

# JavaScript
window.location = userInput;
```

### 修复建议

- 白名单允许的重定向目标
- 使用索引代替 URL
- 跳转到外部时提示用户
