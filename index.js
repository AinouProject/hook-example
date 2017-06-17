const express = require('express')
const bodyParser = require('body-parser')

const hookId = process.env.AINOU_HOOK_ID
const hookToken = process.env.AINOU_HOOK_TOKEN
const port = process.env.PORT || 3008

const app = express()

app.use(bodyParser.json())

app.post('/ainouhook', (req, res) => {
  const payload = req.body
  if (!payload.type || !payload.token) {
    console.log('[AinouHook] Missing params (type or token)', payload)
  }
  // 检查 token
  if (payload.token !== hookToken) {
    console.log('[AinouHook] Token mismatch, got token:', payload.token)
    return res.status(400).end()
  }
  console.log('[AinouHook] payload:', payload)
  if (payload.type === 'error') {
    // 处理异步错误
    console.log('[AinouHook] Got a error', payload.message)
    return res.status(200).end()
  }
  let text = readAs(payload.message, 'text').body
  let nickname = payload.user.nickname
  console.log(`[AinouHook] ${nickname} says: ${text}`)
  let reply = {
    message: {
      type: 'text',
      body: `${nickname} 你好~`
    },
    recipient: payload.source
  }
  res.status(200).json(reply);
})

app.listen(port, () => {
  console.log(`[AinouHook] A example server is listened on ${port}`)
})

function readAs(msg, type) {
  if (msg.type === type) {
    return msg;
  }
  if (msg[type]) {
    return msg[type];
  }
  throw new Error(`Can't read message as ${type}`)
}