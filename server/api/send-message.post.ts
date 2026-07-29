import { getRatelimit } from '../utils/ratelimit'

export default defineEventHandler(async (event) => {
  // 1. IP & Rate Limiting Check
  const clientIp = getHeader(event, 'x-forwarded-for')?.split(',')[0].trim() 
    || getHeader(event, 'x-real-ip') 
    || event.node.req.socket.remoteAddress 
    || 'anonymous'

  const ratelimit = getRatelimit()
  if (ratelimit) {
    const { success, limit, remaining, reset } = await ratelimit.limit(`ip:${clientIp}`)

    // Set rate limit headers to response
    setHeader(event, 'X-RateLimit-Limit', limit.toString())
    setHeader(event, 'X-RateLimit-Remaining', remaining.toString())
    setHeader(event, 'X-RateLimit-Reset', reset.toString())

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000)
      setHeader(event, 'Retry-After', retryAfter.toString())
      
      throw createError({
        statusCode: 429,
        statusMessage: 'Too Many Requests. Please slow down and try again later.'
      })
    }
  }

  // 2. Read and validate payload
  const body = await readBody(event).catch(() => ({}))
  const { name, email, budget, message } = body || {}

  if (!name || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name and Message are required fields.'
    })
  }

  // 3. Telegram credentials check
  const config = useRuntimeConfig()
  const botToken = config.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN
  const chatId = config.telegramChatId || process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.error('[send-message] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing from environment variables.')
    throw createError({
      statusCode: 500,
      statusMessage: 'Server environment not properly configured'
    })
  }

  // Format the notification message
  const text = `
📩 *Pesan Kontak Baru — zeroman.dev*
━━━━━━━━━━━━━━━━━━━━
👤 *Nama/Perusahaan:* ${name}
📧 *Email:* ${email || 'Tidak dicantumkan'}
💰 *Estimasi Anggaran:* ${budget || 'Tidak dicantumkan'}

📝 *Pesan:*
${message}
━━━━━━━━━━━━━━━━━━━━
  `.trim()

  try {
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`
    await $fetch(telegramUrl, {
      method: 'POST',
      body: {
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      }
    })

    return { success: true }
  } catch (err: any) {
    console.error('[send-message] Telegram Bot API request failed:', err.message || err)
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to deliver message via Telegram Bot'
    })
  }
})
