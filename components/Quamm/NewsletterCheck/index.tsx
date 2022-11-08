

import { useContext, useEffect, useState } from 'react'

import { Trans, useTranslation } from "react-i18next"

import { FlexContainer } from "components/ui/FlexContainer"
import { Label } from "components/ui/Label"

import {
  StyledCheckboxCheckbox,
} from "./styled"



const NewsletterCheck: React.FC = () => {
  const [checked, setChecked] = useState(false)
  const fieldName = 'newsletter'

  const handleChange: any = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target?.checked
    setChecked(value)
    localStorage.setItem(fieldName, value.toString())
  }

  return (
    <>
      <FlexContainer className="items-start mx-5 mt-4 mb-2.5 md:mb-5 md:pb-5 md:mx-0 md:mt-0 md:border-b lg:pl-8">
        {/* Input checkobx */}
        <StyledCheckboxCheckbox
          type="checkbox"
          name="newsletter"
          id="newsletter"
          className="relative form-checkbox top-0.5"
          onChange={handleChange}
          checked={checked}
        ></StyledCheckboxCheckbox>
        {/* Label */}
        <Label htmlFor="newsletter">
          <Trans
            i18nKey="general.newsletter"
            components={{
              bold: <strong />
            }}
          />
        </Label>
      </FlexContainer>
    </>
  )
}

export default NewsletterCheck
