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
    /* const url = "https://nodered.quammbase.it/integration-order"

    const data = {
      env:
        process.env.NODE_ENV === "development" ||
        process.env.NEXT_PUBLIC_ENV === "development", // IMPORTANTE! Se non è settato in development per ambienti stagin etc FARLO trmait evariabile env
      data: {
        data: {
          ...state.metadata,
        },
      },
      context,
    }

    const res = await axios.post(url, { data })
    console.log(res) */

    const url = `https://backend.airness.eu/api/cl/order_meta/${state?.order?.id}`
    const res = await axios({
      method: "POST",
      url,
      headers: {
        Authorization: "Bearer fhZLZmyuGaYycxTd3raTyrVX2qHgqs",
        "Content-Type": "application/json; charset=utf-8",
      },
      data: {
        data: {
          ...state.metadata,
        },
      },
    })
  } catch (e) {
    console.log(e)
  }
}
