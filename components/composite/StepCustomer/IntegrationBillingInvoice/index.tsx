import { useContext, useState } from "react"

import { Label } from "components/ui/form/Label"
import { InputCss } from "components/ui/form/Input"

import styled from "styled-components"
import tw from "twin.macro"

import { AppContext } from "components/data/AppProvider"



export const IntegrationBillingInvoice: React.FC = () => {
  const appCtx = useContext(AppContext)
  const [partitaIva, setPartitaIva] = useState('');

  if (!appCtx) {
    return null
  }

  const { setMetadata } = appCtx

  setMetadata({
    'Ragione Sociale': 'Ragione sociale test',
    'Partita Iva': '123456789',
    'Codice Fiscale': 'CDFSCL12349658'
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPartitaIva(event.target.value);
    console.log(event.target.value);
  };

  return (
    <>
      <div className="relative h-10">
        <StyledInput
          id={"codice_fiscale"}
          required={true}
          name={"codice_fiscale"}
          type={"text"}
          value={partitaIva}
          onChange={handleChange}
          className="form-input"
        />
        <Label htmlFor={"codice_fiscale"}>{"Codice Fiscale"}</Label>
      </div>
    </>
  )
}

const StyledInput = styled.input`
  ${InputCss}
  &.hasError {
    ${tw`border-red-400 border-2 focus:ring-offset-0 focus:ring-red-400 focus:ring-opacity-50`}
  }
`