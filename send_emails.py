import yagmail

# 链接邮箱服务器
yag = yagmail.SMTP( user={{SECRETS.USERNAME}}, password={{SECRETS.PASSWORD}}, host={{SECRETS.SMTPHOST}})

# 邮箱正文
contents = ['邮件第一行内容', '邮件第二行内容', '邮件第三行内容']

# 给单用户发送邮件
yag.send('qiguang@ecariee.com', '邮件标题', contents)
