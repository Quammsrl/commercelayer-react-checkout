import { useContext, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

import { AppContext } from "components/data/AppProvider"
import { Label } from "components/ui/form/Label"

import {
  StyledInput,
  StyledWrapper,
  StyledGrid,
  StyledInfo,
  StyledItem,
} from "./styled"

export const IntegrationBillingInvoice: React.FC = () => {
  const { t } = useTranslation()

  const appCtx = useContext(AppContext)
  if (!appCtx) {
    return null
  }

  const { setMetadata, metadata } = appCtx
  const [billingCountry, setBillingCountry] = useState<string | undefined>(
    appCtx?.billingAddress?.country_code
  )

  const [invoiceData, setInvoiceData] = useState({
    tipo: metadata.tipo || "",
    codice_fiscale: metadata.codice_fiscale || "",
    ragione_sociale: metadata.ragione_sociale || "",
    partita_iva: metadata.partita_iva || "",
  })

  // Monitoro i cambiamenti della select country
  const countrySelect = document.querySelector(
    "#billing_address_country_code"
  ) as HTMLInputElement
  countrySelect?.addEventListener("change", (event: Event) => {
    setBillingCountry(countrySelect.value)
  })

  useEffect(() => {
    if (billingCountry !== "IT") {
      const metaTags = {
        tipo: "",
        codice_fiscale: "",
        ragione_sociale: "",
        partita_iva: "",
      }
      setMetaState(metaTags)
    }
  }, [billingCountry])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const metaName = event.target.name
    const metaValue = event.target.value
    const metaTags = { [metaName]: metaValue }

    setMetaState(metaTags)
  }

  const setMetaState = (metadata: object) => {
    setInvoiceData(Object.assign({}, invoiceData, metadata))
  }

  useEffect(() => {
    setMetadata(invoiceData)
  }, [invoiceData])

  return (
    <>
      {billingCountry && billingCountry === "IT" && (
        <StyledWrapper>
          <div className="mt-4">
            {/* Intro Sezione */}
            <StyledInfo>
              {t(`addressForm.billing_address_invoice_title`)}
            </StyledInfo>
          </div>

          <div className="mt-4">
            <StyledGrid>
              {/* Ragione Sociale */}
              <StyledItem>
                <StyledInput
                  id={"ragione_sociale"}
                  required={true}
                  name={"ragione_sociale"}
                  type={"text"}
                  value={invoiceData.ragione_sociale}
                  onChange={handleChange}
                  className="form-input"
                />
                <Label htmlFor={"ragione_sociale"}>
                  {t(`addressForm.billing_address_invoice_company_name`)}
                </Label>
              </StyledItem>
              {/* Partita Iva */}
              <StyledItem>
                <StyledInput
                  id={"partita_iva"}
                  required={true}
                  name={"partita_iva"}
                  type={"text"}
                  value={invoiceData.partita_iva}
                  onChange={handleChange}
                  className="form-input"
                />
                <Label htmlFor={"partita_iva"}>
                  {t(`addressForm.billing_address_invoice_company_vat`)}
                </Label>
              </StyledItem>
            </StyledGrid>
          </div>
        </StyledWrapper>
      )}
    </>
  )
}
