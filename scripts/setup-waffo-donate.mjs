/**
 * Waffo Pancake 打赏设置脚本
 *
 * 用法：
 * 1. 设置环境变量 WAFFO_PRIVATE_KEY
 * 2. 运行: node scripts/setup-waffo-donate.mjs
 *
 * 这个脚本会：
 * 1. 检查是否已有 store，没有则创建
 * 2. 创建一个一次性打赏产品（咖啡/支持）
 * 3. 输出 checkout URL，用于嵌入博客打赏组件
 */

import { WaffoPancake } from "@waffo/pancake-ts"
import { readFileSync, writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const MERCHANT_ID = "MER_06Ix3W9QPj5PideHenYzeF"

// 从环境变量或文件读取 Private Key
let privateKey = process.env.WAFFO_PRIVATE_KEY
if (!privateKey) {
  const keyPath = resolve(__dirname, "..", "waffo-private.pem")
  try {
    privateKey = readFileSync(keyPath, "utf-8")
    console.log("✓ 从 waffo-private.pem 读取 Private Key")
  } catch {
    console.error("❌ 请设置 WAFFO_PRIVATE_KEY 环境变量或将 Private Key 保存到 waffo-private.pem")
    console.error("   export WAFFO_PRIVATE_KEY='-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----'")
    process.exit(1)
  }
}

const client = new WaffoPancake({
  merchantId: MERCHANT_ID,
  privateKey,
})

async function main() {
  console.log("🚀 开始设置 Waffo 打赏...\n")

  // 1. 获取或创建 Store
  console.log("📦 检查 Store...")
  const { data: storesData } = await client.graphql.query({
    query: `query { stores { id name status } }`,
  })

  const stores = storesData?.stores ?? []
  let storeId

  if (stores.length === 0) {
    console.log("  创建新 Store: Adam's Blog")
    const { store } = await client.stores.create({ name: "Adam's Blog" })
    storeId = store.id
    console.log(`  ✓ Store 已创建: ${storeId}`)
  } else {
    storeId = stores[0].id
    console.log(`  ✓ 使用已有 Store: ${storeId} (${stores[0].name})`)
  }

  // 2. 创建一次性打赏产品
  console.log("\n☕ 创建打赏产品...")

  // 先检查是否已有打赏产品
  const { data: productsData } = await client.graphql.query({
    query: `query ($storeId: String!) { onetimeProducts(storeId: $storeId) { id name status } }`,
    variables: { storeId },
  })

  const existingProducts = productsData?.onetimeProducts ?? []
  const donateProduct = existingProducts.find(p => p.name === "请作者喝杯咖啡")

  let productId

  if (donateProduct) {
    productId = donateProduct.id
    console.log(`  ✓ 使用已有产品: ${productId}`)
  } else {
    const { product } = await client.onetimeProducts.create({
      storeId,
      name: "请作者喝杯咖啡",
      description: "支持 Adam 的博客创作，金额随意",
      prices: {
        CNY: { amount: "10.00", taxIncluded: true, taxCategory: "digital_goods" },
        USD: { amount: "2.00", taxIncluded: true, taxCategory: "digital_goods" },
      },
    })
    productId = product.id
    console.log(`  ✓ 产品已创建: ${productId}`)

    // 发布产品
    await client.onetimeProducts.publish({ id: productId })
    console.log("  ✓ 产品已发布")
  }

  // 3. 创建 Checkout Session 获取支付链接
  console.log("\n🔗 创建 Checkout Session...")
  const session = await client.checkout.createSession({
    productId,
    productType: "onetime",
    currency: "CNY",
  })

  console.log(`\n✅ 设置完成！`)
  console.log(`\n📋 配置信息:`)
  console.log(`   Store ID:    ${storeId}`)
  console.log(`   Product ID:  ${productId}`)
  console.log(`   Checkout URL: ${session.checkoutUrl}`)

  // 保存配置到文件
  const config = {
    storeId,
    productId,
    checkoutUrl: session.checkoutUrl,
    merchantId: MERCHANT_ID,
  }
  const configPath = resolve(__dirname, "..", ".vitepress", "waffo-config.json")
  writeFileSync(configPath, JSON.stringify(config, null, 2))
  console.log(`\n💾 配置已保存到: ${configPath}`)
}

main().catch(err => {
  console.error("❌ 设置失败:", err.message)
  if (err.errors) {
    err.errors.forEach(e => console.error(`   - [${e.layer}] ${e.message}`))
  }
  process.exit(1)
})
