/**
 * Waffo Pancake 打赏 API
 *
 * GET /api/donate — 生成一个新的 checkout session 并重定向到支付页面
 *
 * 环境变量（在 Vercel Dashboard 中设置）：
 * - WAFFO_MERCHANT_ID
 * - WAFFO_PRIVATE_KEY
 * - WAFFO_PRODUCT_ID
 */

import { WaffoPancake } from "@waffo/pancake-ts"

const MERCHANT_ID = process.env.WAFFO_MERCHANT_ID || "MER_06Ix3W9QPj5PideHenYzeF"
const PRODUCT_ID = process.env.WAFFO_PRODUCT_ID || "PROD_3oh80uh0PwVKxVQFXzCI2G"

function getPrivateKey(): string {
  const raw = process.env.WAFFO_PRIVATE_KEY || ""
  // 恢复换行符
  return raw.replace(/\\n/g, "\n")
}

let client: WaffoPancake | null = null

function getClient(): WaffoPancake {
  if (!client) {
    client = new WaffoPancake({
      merchantId: MERCHANT_ID,
      privateKey: getPrivateKey(),
    })
  }
  return client
}

export async function GET() {
  try {
    const c = getClient()
    const session = await c.checkout.createSession({
      productId: PRODUCT_ID,
      productType: "onetime",
      currency: "CNY",
    })
    return Response.redirect(session.checkoutUrl, 302)
  } catch (err) {
    console.error("Waffo checkout error:", err)
    return Response.redirect("/donate-error", 302)
  }
}

export const config = { runtime: "nodejs" }
