import { useContext, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

import { AppContext } from "components/data/AppProvider"
import { FlexContainer } from "components/ui/FlexContainer"
import { Label } from "components/ui/form/Label"
import CheckboxLabel from "components/ui/Label"

import {
  StyledInput,
  StyledCheckboxCheckbox,
  StyledWrapper,
  StyledGrid,
  StyledInfo,
  StyledFlex,
} from "./styled"

export const IntegrationBillingInvoice: React.FC = () => {
  const { t } = useTranslation()

  const appCtx = useContext(AppContext)
  if (!appCtx) {
    return null
  }

  const { setMetadata, metadata } = appCtx

  const [invoiceData, setInvoiceData] = useState({
    tipo: metadata.tipo || "",
    codice_fiscale: metadata.codice_fiscale || "",
    ragione_sociale: metadata.ragione_sociale || "",
    partita_iva: metadata.partita_iva || "",
  })

  /*const handleChangeType = (event: React.ChangeEvent<HTMLInputElement>) => {
    const metaValue = event.target.value
    const metaTags = {
      tipo: "",
      codice_fiscale: "",
      ragione_sociale: "",
      partita_iva: "",
    }

    const toggled = invoiceData.tipo !== metaValue

    if (toggled && metaValue === "Ricevuta") {
      metaTags.tipo = "Ricevuta"
      metaTags.codice_fiscale = ""
      metaTags.partita_iva = ""
    }
    if (toggled && metaValue === "Fattura") {
      metaTags.tipo = "Fattura"
      metaTags.codice_fiscale = ""
    }

    setMetaState(metaTags)
  }*/

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
          <div className="relative h-10">
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
          </div>
          {/* Partita Iva */}
          <div className="relative h-10">
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
          </div>
        </StyledGrid>

      </div>
    </StyledWrapper>
  )
}
