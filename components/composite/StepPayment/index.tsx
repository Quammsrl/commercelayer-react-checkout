import "@adyen/adyen-web/dist/adyen.css"
import {
  PaymentSourceBrandName,
  PaymentSourceDetail,
  PaymentSource,
  PaymentSourceBrandIcon,
} from "@commercelayer/react-components"
import { PaymentMethod } from "@commercelayer/sdk"
import classNames from "classnames"
import { useContext } from "react"
import { Trans, useTranslation } from "react-i18next"

import { AccordionContext } from "components/data/AccordionProvider"
import { AppContext } from "components/data/AppProvider"
import { StepContainer } from "components/ui/StepContainer"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

import { CheckoutCustomerPayment } from "./CheckoutCustomerPayment"
import { CheckoutPayment } from "./CheckoutPayment"
import { PaymentSkeleton } from "./PaymentSkeleton"

interface HeaderProps {
  className?: string
  step: number
  info?: string
}

export const StepHeaderPayment: React.FC<HeaderProps> = ({ step }) => {
  const appCtx = useContext(AppContext)
  const accordionCtx = useContext(AccordionContext)

  if (!appCtx || !accordionCtx) {
    return null
  }

  const { hasPaymentMethod, isPaymentRequired, isCreditCard } = appCtx

  const { t } = useTranslation()

  const recapText = () => {
    if (!isPaymentRequired) {
      return t("stepPayment.notRequired")
    }
    if (!hasPaymentMethod || accordionCtx.status === "edit") {
      return t("stepPayment.methodUnselected")
    }

    return (
      <>
        <div className="flex">
          <PaymentSource readonly loader={<PaymentSkeleton />}>
            <PaymentSourceBrandIcon className="mr-2" />
            <PaymentSourceBrandName className="mr-1">
              {({ brand }) => {
                if (isCreditCard) {
                  return (
                    <Trans i18nKey="stepPayment.endingIn">
                      {brand}
                      <PaymentSourceDetail className="ml-1" type="last4" />
                    </Trans>
                  )
                }
                return brand
              }}
            </PaymentSourceBrandName>
          </PaymentSource>
        </div>
      </>
    )
  }

  return (
    <StepHeader
      stepNumber={step}
      status={accordionCtx.status}
      label={t("stepPayment.title")}
      info={recapText()}
      onEditRequest={accordionCtx.setStep}
    />
  )
}

export const StepPayment: React.FC = () => {
  const appCtx = useContext(AppContext)
  const accordionCtx = useContext(AccordionContext)

  const { t } = useTranslation()

  // if (!appCtx || !appCtx.hasShippingMethod) {
  // this exit on shippingMethod is causing an error in useEffect to enable button
  if (!appCtx || !accordionCtx) {
    return null
  }

  const { isGuest, isPaymentRequired, setPayment } = appCtx

  const selectPayment = async (payment?: PaymentMethod) => {
    setPayment(payment)
  }

  return (
    <StepContainer
      className={classNames({
        current: accordionCtx.isActive,
        done: !accordionCtx.isActive,
      })}
    >
      <StepContent>
        {accordionCtx.isActive && (
          <div>
            {isPaymentRequired ? (
              isGuest ? (
                <CheckoutPayment selectPayment={selectPayment} />
              ) : (
                <CheckoutCustomerPayment selectPayment={selectPayment} />
              )
            ) : (
              <p className="text-sm text-gray-400">
                {t("stepPayment.amountZero")}
              </p>
            )}

            <p className="text-sm text-gray-500">
              <Trans i18nKey="general.3ds" />
            </p>
          </div>
        )}
      </StepContent>
    </StepContainer>
  )
}
