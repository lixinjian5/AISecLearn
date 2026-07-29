# R004 — 命令注入检测

## 规则信息

| 字段 | 值 |
|------|-----|
| ID | R004 |
| 名称 | 命令注入检测 |
| 严重程度 | 🔴 Critical |
| 适用语言 | Python, PHP, Java, JavaScript |

## 检测模式

### Python

```
# ❌ 危险
os.system("ping " + ip)
os.popen("nslookup " + domain)
subprocess.call("ls " + path, shell=True)

# 用户输入拼接进系统命令
subprocess.Popen(f"curl {url}", shell=True)

# ✅ 安全
subprocess.call(["ping", ip])    # 不用 shell=True
subprocess.run(["ls", path])     # 参数列表而非字符串
```

### PHP

```
# ❌ 危险
system($_GET['cmd']);
exec("ping " . $ip);
shell_exec("nslookup " . $domain);
passthru("cat " . $filename);
`ls -la $dir`;

# ✅ 安全
escapeshellarg($ip);
escapeshellcmd($cmd);
```

### Java

```
# ❌ 危险
Runtime.getRuntime().exec("ping " + ip);

# ✅ 安全（使用参数数组）
Runtime.getRuntime().exec(new String[]{"ping", ip});
```

### JavaScript (Node.js)

```
# ❌ 危险
const exec = require('child_process').exec;
exec('ping ' + ip, callback);

# ✅ 安全
const execFile = require('child_process').execFile;
execFile('ping', [ip], callback);
```

## 检测标准

1. 调用了系统命令执行函数
2. 参数包含用户输入（字符串拼接方式）
3. 没有对参数做转义或白名单校验

## 修复建议

- 优先使用语言内置函数替代系统命令
- 使用参数数组而非字符串拼接
- 设置 `shell=False`
- 对用户输入做白名单验证
