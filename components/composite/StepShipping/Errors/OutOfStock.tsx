import { ErrorComponentProps, Errors } from "@commercelayer/react-components"
import { useTranslation, Trans } from "next-i18next"
import { Dispatch, SetStateAction } from "react"

interface Props {
  messages: ErrorComponentProps["messages"]
  setOutOfStockError: Dispatch<SetStateAction<boolean>>
  cartUrl?: string
}

export const OutOfStock = ({
  messages,
  setOutOfStockError,
  cartUrl,
}: Props) => {
  const { t } = useTranslation()
  return (
    <Errors resource="line_items" messages={messages}>
      {({ errors }) => {
        setOutOfStockError(errors.length > 0 && errors[0] !== undefined)

        return errors.map((error, index) => (
          <p key={index}>
            {error}
            {cartUrl && (
              <Trans
                i18nKey={"stepShipping.outOfStockWithCart"}
                values={{
                  link: t("stepShipping.outOfStockLink"),
                }}
                components={{
                  WrapperStyle: (
                    <strong className="text-black border-b border-gray-300 cursor-pointer" />
                  ),
                  Link: (
                    <a
                      data-test-id="out-of-stock-cart-link"
                      href={`${cartUrl}`}
                    />
                  ),
                }}
              />
            )}
          </p>
        ))
      }}
    </Errors>
  )
}
