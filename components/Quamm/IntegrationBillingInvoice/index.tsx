import { useContext, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

import { FlexContainer } from "components/ui/FlexContainer"
import { Label } from "components/ui/form/Label"
import CheckboxLabel from "components/ui/Label"


import { StyledInput, StyledCheckboxCheckbox, StyledWrapper, StyledGrid, StyledInfo, StyledFlex } from "./styled"

import { AppContext } from "components/data/AppProvider"

export const IntegrationBillingInvoice: React.FC = () => {
  const { t } = useTranslation()

  const appCtx = useContext(AppContext)
  if (!appCtx) {
    return null
  }

  const { setMetadata, metadata } = appCtx

  const [invoiceData, setInvoiceData] = useState({
    'tipo': metadata.tipo || '',
    'codice_fiscale': metadata.codice_fiscale || '',
    'ragione_sociale': metadata.ragione_sociale || '',
    'partita_iva': metadata.partita_iva || ''
  });

  const handleChangeType = (event: React.ChangeEvent<HTMLInputElement>) => {
    const metaValue = event.target.value
    const metaTags = {
      'tipo': '',
      'codice_fiscale': '',
      'ragione_sociale': '',
      'partita_iva': ''
    }

    const toggled = invoiceData.tipo !== metaValue

    if (toggled && metaValue === 'Ricevuta') {
      metaTags.tipo = 'Ricevuta'
      metaTags.codice_fiscale = ''
      metaTags.partita_iva = ''
    }
    if (toggled && metaValue === 'Fattura') {
      metaTags.tipo = 'Fattura'
      metaTags.codice_fiscale = ''
    }

    setMetaState(metaTags)

  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const metaName = event.target.name
    const metaValue = event.target.value
    const metaTags = { [metaName]: metaValue }

    setMetaState(metaTags)
  };

  const setMetaState = (metadata: object) => {
    setInvoiceData(Object.assign({}, invoiceData, metadata))
  }

  useEffect(() => {
    setMetadata(invoiceData)
  }, [invoiceData]);

  return (
    <StyledWrapper>
      <div className="mt-4">
        {/* Intro Sezione */}
        <StyledInfo>
          {t(`addressForm.billing_address_invoice_title`)}
        </StyledInfo>
      </div>

      {/* Tipologia Ricevuta */}
      <FlexContainer className="mb-8 mt-4">
        {/* Input checkobx Fattura */}
        <FlexContainer>
          <StyledCheckboxCheckbox
            type="checkbox"
            name="tipo_fattura"
            id="tipo_fattura"
            className="relative form-checkbox top-0.5"
            value={'Fattura'}
            onChange={handleChangeType}
            checked={invoiceData.tipo === 'Fattura'}
          ></StyledCheckboxCheckbox>
          {/* Label */}
          <CheckboxLabel htmlFor="tipo_fattura">
            {t(`addressForm.billing_address_invoice_company`)}
          </CheckboxLabel>
        </FlexContainer>

        {/* Input checkobx Ricevuta */}
        <FlexContainer className="ml-8">
          <StyledCheckboxCheckbox
            type="checkbox"
            name="tipo_ricevuta"
            id="tipo_ricevuta"
            className="relative form-checkbox top-0.5"
            value={'Ricevuta'}
            onChange={handleChangeType}
            checked={invoiceData.tipo === 'Ricevuta'}
          ></StyledCheckboxCheckbox>
          {/* Label */}
          <CheckboxLabel htmlFor="tipo_ricevuta">
            {t(`addressForm.billing_address_invoice_private`)}
          </CheckboxLabel>
        </FlexContainer>
      </FlexContainer>

      <div className="mt-4">
        <StyledGrid>
          {/* Ragione Sociale */}
          {invoiceData.tipo === 'Fattura' && <div className="relative h-10">
            <StyledInput
              id={"ragione_sociale"}
              required={true}
              name={"ragione_sociale"}
              type={"text"}
              value={invoiceData.ragione_sociale}
              onChange={handleChange}
              className="form-input"
            />
            <Label htmlFor={"ragione_sociale"}>{t(`addressForm.billing_address_invoice_company_name`)}</Label>
          </div>
          }
          {/* Partita Iva */}
          {invoiceData.tipo === 'Fattura' && <div className="relative h-10">
            <StyledInput
              id={"partita_iva"}
              required={true}
              name={"partita_iva"}
              type={"text"}
              value={invoiceData.partita_iva}
              onChange={handleChange}
              className="form-input"
            />
            <Label htmlFor={"partita_iva"}>{t(`addressForm.billing_address_invoice_company_vat`)}</Label>
          </div>
          }
        </StyledGrid>

        {/* Codice Fiscale */}
        {invoiceData.tipo === 'Ricevuta' && <div className="relative h-10 mb-8">
          <StyledInput
            id={"codice_fiscale"}
            required={true}
            name={"codice_fiscale"}
            type={"text"}
            value={invoiceData.codice_fiscale}
            onChange={handleChange}
            className="form-input"
          />
          <Label htmlFor={"codice_fiscale"}>{t(`addressForm.billing_address_invoice_company_fiscal_code`)}</Label>
        </div>
        }
      </div>
    </StyledWrapper>
  )
}
