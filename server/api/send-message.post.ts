export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, budget, message } = body

  // Read credentials from environment variables
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

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
