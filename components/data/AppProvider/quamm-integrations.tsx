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
    console.log(res)
  } catch (e) {
    console.log(e)
  }
}
