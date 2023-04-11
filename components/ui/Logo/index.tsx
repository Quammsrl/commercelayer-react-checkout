import { useContext } from "react"
import styled from "styled-components"
import tw from "twin.macro"

import { AppContext } from "components/data/AppProvider"

interface Props {
  logoUrl?: string
  companyName: string
  className?: string
}

export const Logo: React.FC<Props> = ({ logoUrl, companyName, className }) => {
  if (logoUrl) {
    const ctx = useContext(AppContext)
    const baseUrl = ctx?.returnUrl
    let split = baseUrl ? baseUrl.split("checkout") : "https://airness.eu"
    if (baseUrl?.includes("custom.airness")) {
      split = ["https://custom.airness.eu"]
    }
    return (
      <div>
        <Image
          src={logoUrl}
          alt={companyName}
          className={`${className} logo-header cursor-pointer`}
          onClick={(e) => handleClick(e, split[0])}
        />
      </div>
    )
  }
  return <Label className={className}>{companyName}</Label>
}

const handleClick = (e: any, url: any) => {
  window.location.href = url
}

const Image = styled.img`
  ${tw`h-11 w-auto mb-5 md:mb-10`}
`

const Label = styled.h1`
  ${tw`mb-5 md:mb-12 font-extrabold uppercase tracking-wide text-xl text-black`}
`
