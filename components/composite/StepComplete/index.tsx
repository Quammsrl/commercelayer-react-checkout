/*
import {
  PaymentSource,
  PaymentSourceBrandIcon,
  PaymentSourceBrandName,
  PaymentSourceDetail,
} from "@commercelayer/react-components"
*/
import { useContext } from "react"
import { useTranslation } from "react-i18next"
// , Trans

// import { OrderSummary } from "components/composite/OrderSummary"
// import { PaymentContainer } from "components/composite/StepPayment/PaymentContainer"
import { AppContext } from "components/data/AppProvider"
import { Base } from "components/ui/Base"
import { Button } from "components/ui/Button"
// import { CustomAddress } from "components/ui/CustomerAddressCard"
// import { FlexContainer } from "components/ui/FlexContainer"
// import { Footer } from "components/ui/Footer"
import { Logo } from "components/ui/Logo"
// import { getTranslations } from "components/utils/payments"

// import { CheckIcon } from "./CheckIcon"
import {
  // AddressContainer,
  // Bottom,
  Main,
  // Recap,
  // RecapBox,
  // RecapCol,
  // RecapCustomer,
  // RecapItem,
  // RecapItemDescription,
  // RecapItemTitle,
  // RecapSummary,
  // RecapTitle,
  // Title,
  Top,
  Text,
  Wrapper,
  WrapperButton,
} from "./styled"
// import { SupportMessage } from "./SupportMessage"

interface Props {
  logoUrl?: string
  companyName: string
  supportEmail?: string
  supportPhone?: string
  orderNumber: number
}

export const StepComplete: React.FC<Props> = ({
  logoUrl,
  companyName,
  orderNumber,
  /*
  supportEmail,
  supportPhone,
  */
}) => {
  const { t } = useTranslation()

  const ctx = useContext(AppContext)

  if (!ctx) return null

  const newsletter = localStorage.getItem("newsletter") === "true"
  const url = ctx?.returnUrl + "?id=" + ctx.orderId + "&nl=" + newsletter

  /* Update Quamm  */
  if (localStorage.getItem("fromApp") !== "true") {
    const redirectBack = () => {
      ctx?.returnUrl &&
        (window.location.href = url)
    }
    process.nextTick(() => redirectBack())
  }
  /* ./Update Quamm */



  /* const handleClick = () => {
    ctx?.returnUrl &&
      (document.location.href =
        ctx?.returnUrl + "?id=" + ctx.orderId + "&nl=" + newsletter)
  } */

  return (
    <Base>
      <Top>
        <Wrapper>
          <Main>
            <h1>{t("stepComplete.title")}</h1>
            <p style={{ marginTop: "10px" }}>
              {t("stepComplete.text", {
                mail: ctx.emailAddress,
                number: orderNumber,
              })}
            </p>
            {ctx?.returnUrl && (
              <WrapperButton>
                <a
                  className="button-airness"
                  data-testid="button-continue-to-shop"
                  href={`${url}`}
                >
                  <span>{t("stepComplete.continue")}</span>
                </a>
                {""}
              </WrapperButton>
            )}
          </Main>
        </Wrapper>
      </Top>
    </Base>
  )
}
