// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { TypeAccepted } from "@commercelayer/react-components/lib/utils/getLineItemsCount"
import CommerceLayer, {
  CommerceLayerStatic,
  CommerceLayerClient,
  Organization,
  Order,
} from "@commercelayer/sdk"
import retry from "async-retry"
import jwt_decode from "jwt-decode"
import type { NextApiRequest, NextApiResponse } from "next"

import { LINE_ITEMS_SHOPPABLE } from "components/utils/constants"
import hex2hsl, { BLACK_COLOR } from "components/utils/hex2hsl"

const RETRIES = 2

interface JWTProps {
  organization: {
    slug: string
    id: string
  }
  application: {
    kind: string
  }
  test: boolean
}

interface FetchResource<T> {
  object: T | undefined
  success: boolean
}

function isProduction(env: string): boolean {
  return env === "production"
}

async function retryCall<T>(
  f: Promise<T>
): Promise<FetchResource<T> | undefined> {
  return await retry(
    async (bail, number) => {
      try {
        const object = await f
        return {
          object: object as unknown as T,
          success: true,
        }
      } catch (e: unknown) {
        if (CommerceLayerStatic.isApiError(e) && e.status === 401) {
          console.log("Not authorized")
          bail(e)
          return
        }
        if (number === RETRIES + 1) {
          return {
            object: undefined,
            success: false,
          }
        }
        throw e
      }
    },
    {
      retries: RETRIES,
    }
  )
}

async function getOrganization(
  cl: CommerceLayerClient
): Promise<FetchResource<Organization> | undefined> {
  return retryCall<Organization>(
    cl.organization.retrieve({
      fields: {
        organizations: [
          "id",
          "logo_url",
          "name",
          "primary_color",
          "favicon_url",
          "gtm_id",
          "gtm_id_test",
          "support_email",
          "support_phone",
        ],
      },
    })
  )
}

async function getOrder(
  cl: CommerceLayerClient,
  orderId: string
): Promise<FetchResource<Order> | undefined> {
  return retryCall<Order>(
    cl.orders.retrieve(orderId, {
      fields: {
        orders: [
          "id",
          "autorefresh",
          "status",
          "number",
          "guest",
          "language_code",
          "terms_url",
          "privacy_url",
          "line_items",
        ],
        line_items: ["item_type"],
      },
      include: ["line_items"],
    })
  )
}

function getTokenInfo(accessToken: string) {
  try {
    const {
      organization: { slug },
      application: { kind },
      test,
    } = jwt_decode(accessToken) as JWTProps

    return { slug, kind, isTest: test }
  } catch (e) {
    console.log(`error decoding access token: ${e}`)
    return {}
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { NODE_ENV, DOMAIN, HOSTED } = process.env
  const accessToken = req.query.accessToken as string
  const orderId = req.query.orderId as string

  const domain = DOMAIN || "commercelayer.io"

  const paymentReturn = req.query.paymentReturn === "true"

  function invalidateCheckout(retry?: boolean) {
    res.statusCode = 200
    console.log("access token:")
    console.log(accessToken)
    console.log("orderId")
    console.log(orderId)
    return res.json({ validCheckout: false, retryOnError: !!retry })
  }

  if (!accessToken || !orderId) {
    return invalidateCheckout()
  }

  const subdomain = req.headers.host?.split(":")[0].split(".")[0]

  const { slug, kind, isTest } = getTokenInfo(accessToken)

  if (!slug) {
    return invalidateCheckout()
  }

  if (
    isProduction(NODE_ENV) &&
    !!HOSTED &&
    (subdomain !== slug || kind !== "sales_channel")
  ) {
    return invalidateCheckout()
  } else if (kind !== "sales_channel") {
    return invalidateCheckout()
  }

  const cl = CommerceLayer({
    organization: slug,
    accessToken: accessToken,
    domain,
  })

  const organizationResource = await getOrganization(cl)

  const organization = organizationResource?.object

  if (!organizationResource?.success || !organization?.id) {
    console.log("Invalid: organization")
    return invalidateCheckout(true)
  }

  const orderResource = await getOrder(cl, orderId)
  const order = orderResource?.object

  if (!orderResource?.success || !order?.id) {
    console.log("Invalid: order")
    return invalidateCheckout(true)
  }

  const lineItemsShoppable = order.line_items?.filter((line_item) => {
    return LINE_ITEMS_SHOPPABLE.includes(line_item.item_type as TypeAccepted)
  })

  // If there are no shoppable items we redirect to the invalid page
  if ((lineItemsShoppable || []).length === 0) {
    console.log("Invalid: No shoppable line items")
    return invalidateCheckout()
  }

  if (order.status === "draft" || order.status === "pending") {
    // If returning from payment (PayPal) skip order refresh and payment_method reset
    console.log(
      !paymentReturn ? "refresh order" : "return from external payment"
    )
    if (!paymentReturn) {
      const _refresh = !paymentReturn
      try {
        await cl.orders.update({
          id: order.id,
          _refresh,
          payment_method: cl.payment_methods.relationship(null),
          ...(!order.autorefresh && { autorefresh: true }),
        })
      } catch {
        console.log("error refreshing order")
      }
    }
  } else if (order.status !== "placed") {
    return invalidateCheckout()
  }

  /* Update Quamm */
  const baseUrl = order.terms_url
  const filteredGtmId = baseUrl?.includes("custom.airness")
    ? process.env?.GTMIDCONF
    : process.env?.GTMID
  /* ./ Update Quamm */

  const appSettings: CheckoutSettings = {
    accessToken,
    // endpoint: `https://${slug}.${domain}`,
    endpoint: process.env.ENDPOINT || "https://checkout-22.airness.eu/cl/",
    domain: process.env.BASE_URL || "airness.eu/cl",
    slug: process.env.SLUG || "checkout-22",
    orderNumber: order.number || 0,
    orderId: order.id,
    validCheckout: true,
    logoUrl: process.env.LOGOURL,
    companyName: process.env.COMPANYNAME || "Airness",
    language: order.language_code || "en",
    primaryColor: hex2hsl(process.env.PRIMARYCOLOR as string) || BLACK_COLOR,
    favicon: process.env?.FAVICON || "/favicon.png",
    gtmId: filteredGtmId,
    supportEmail: organization.support_email,
    supportPhone: organization.support_phone,
    termsUrl: order.terms_url,
    privacyUrl: order.privacy_url,
  }

  return res
    .setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate")
    .status(200)
    .json(appSettings)
}
