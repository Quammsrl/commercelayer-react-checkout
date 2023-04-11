import styled from "styled-components"
import tw from "twin.macro"

import { CheckCss } from "components/ui/form/CheckBox"
import { InputCss } from "components/ui/form/Input"

export const StyledItem = styled.div`
  ${tw`relative h-10`}
  @media (max-width: 768px) {
    &:first-child {
      ${tw`mb-8`}
    }
  }
`

export const StyledInput = styled.input`
  ${InputCss}
  &.hasError {
    ${tw`border-red-400 border-2 focus:ring-offset-0 focus:ring-red-400 focus:ring-opacity-50`}
  }
`

export const StyledWrapper = styled.div`
  ${tw`mt-0 mb-8`}
`

export const StyledGrid = styled.div`
  ${tw`grid lg:grid-cols-2 lg:gap-4`}
`

export const StyledInfo = styled.p`
  ${tw`text-gray-400 text-sm`}
`
