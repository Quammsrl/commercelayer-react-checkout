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
// import { Button } from "components/ui/Button"
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
  // WrapperButton,
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
  /*
  supportEmail,
  supportPhone,
  orderNumber,
  */
}) => {
  const { t } = useTranslation()

  const ctx = useContext(AppContext)

  /* Update Quamm */
  const redirectBack = () => {
    ctx?.returnUrl &&
      (window.location.href = ctx?.returnUrl + "?id=" + ctx.orderId)
  }

  process.nextTick(() => redirectBack())
  /* ./Update Quamm */

  if (!ctx) return null

  const handleClick = () => {
    ctx?.returnUrl && (document.location.href = ctx?.returnUrl)
  }

  return (
    <Base>
      <Top>
        <Wrapper>
          <Logo
            logoUrl={logoUrl}
            companyName={companyName}
            className="self-center pt-10 pl-4 mb-10 md:self-auto"
          />
          <Main>
            <Text>{t("stepComplete.titleRedirect")}</Text>
          </Main>
        </Wrapper>
      </Top>
    </Base>
  )
}
