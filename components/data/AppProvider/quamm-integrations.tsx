import axios from "axios"

import { AppStateData } from "./index"

export interface Context {
  slug: string
  domain: string
  orderId: string
}

export const updateOrderMetadataIntegration = async (
  state: AppStateData,
  context: Context
): Promise<void> => {
  try {
    const url = "https://nodered.quammbase.it/integration-order"

    const data = {
      env: process.env.NODE_ENV === "development",
      data: {
        type: "orders",
        id: state?.order?.id,
        attributes: {
          metadata: state.metadata,
        },
      },
      context,
    }

    const res = await axios.post(url, { data })
    console.log(res)
  } catch (e) {
    console.log(e)
  }
}
