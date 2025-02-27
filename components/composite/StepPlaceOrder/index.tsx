import { PlaceOrderContainer } from "@commercelayer/react-components"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { Trans, useTranslation } from "react-i18next"

import { AppContext } from "components/data/AppProvider"
import { GTMContext } from "components/data/GTMProvider"
import NewsletterCheck from "components/Quamm/NewsletterCheck/"
import { FlexContainer } from "components/ui/FlexContainer"
import { Label } from "components/ui/Label"
import { SpinnerIcon } from "components/ui/SpinnerIcon"

import { ErrorIcon } from "./ErrorIcon"
import { messages } from "./messages"
import {
  ErrorIco,
  ErrorMessage,
  ErrorsContainer,
  ErrorWrapper,
  StyledErrors,
  StyledPlaceOrderButton,
  StyledPrivacyAndTermsCheckbox,
  PlaceOrderButtonWrapper,
} from "./styled"

interface Props {
  isActive: boolean
  termsUrl?: string
  privacyUrl?: string
  returnsUrl?: string
}

const StepPlaceOrder: React.FC<Props> = ({
  isActive,
  termsUrl,
  privacyUrl,
  returnsUrl,
}) => {
  const { t } = useTranslation()
  const { query } = useRouter()

  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const appCtx = useContext(AppContext)
  const gtmCtx = useContext(GTMContext)

  if (!appCtx) {
    return null
  }
  let paypalPayerId = ""
  let checkoutComSession = ""

  if (query.PayerID) {
    paypalPayerId = query.PayerID as string
  }

  if (query["cko-session-id"]) {
    checkoutComSession = query["cko-session-id"] as string
  }

  const { placeOrder } = appCtx

  const handlePlaceOrder = async ({ placed }: { placed: boolean }) => {
    if (placed) {
      setIsPlacingOrder(true)
      await placeOrder()
      if (gtmCtx?.firePurchase && gtmCtx?.fireAddPaymentInfo) {
        await gtmCtx.fireAddPaymentInfo()
        await gtmCtx.firePurchase()
      }
      setIsPlacingOrder(false)
    }
  }

  return (
    <>
      <ErrorsContainer data-test-id="errors-container">
        <StyledErrors
          resource="orders"
          messages={
            messages &&
            messages.map((msg) => {
              return { ...msg, message: t(msg.message) }
            })
          }
        >
          {(props) => {
            if (props.errors?.length === 0) {
              return null
            }
            const compactedErrors = props.errors
            return compactedErrors?.map((error, index) => {
              if (error?.trim().length === 0 || !error) {
                return null
              }
              return (
                <ErrorWrapper key={index}>
                  <ErrorIco>
                    <ErrorIcon />
                  </ErrorIco>
                  <ErrorMessage>{error}</ErrorMessage>
                </ErrorWrapper>
              )
            })
          }}
        </StyledErrors>
      </ErrorsContainer>
      <PlaceOrderContainer
        options={{
          paypalPayerId,
          checkoutCom: { session_id: checkoutComSession },
        }}
      >
        <>
          {!!termsUrl && !!privacyUrl && !!returnsUrl && (
            <FlexContainer className="items-start mx-5 mt-4 mb-2.5 md:mb-5 md:pb-5 md:mx-0 md:mt-0 md:border-b lg:pl-8">
              <StyledPrivacyAndTermsCheckbox
                id="privacy-terms"
                className="relative form-checkbox top-0.5"
                data-test-id="checkbox-privacy-and-terms"
              />
              <Label htmlFor="privacy-terms">
                <Trans
                  i18nKey="general.privacy_and_terms"
                  components={{
                    bold: <strong />,
                    termsUrl: (
                      <a href={termsUrl} target="_blank" rel="noreferrer" />
                    ),
                    privacyUrl: (
                      <a href={privacyUrl} target="_blank" rel="noreferrer" />
                    ),
                    returnsUrl: (
                      <a href={returnsUrl} target="_blank" rel="noreferrer" />
                    ),
                  }}
                />
              </Label>
            </FlexContainer>
          )}
          <NewsletterCheck />
          <PlaceOrderButtonWrapper>
            <StyledPlaceOrderButton
              data-test-id="save-payment-button"
              isActive={isActive}
              onClick={handlePlaceOrder}
              label={
                <>
                  {isPlacingOrder && <SpinnerIcon />}
                  {t("stepPayment.submit")}
                </>
              }
            />
          </PlaceOrderButtonWrapper>
        </>
      </PlaceOrderContainer>
    </>
  )
}

export default StepPlaceOrder
