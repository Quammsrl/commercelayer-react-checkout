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
    const split = baseUrl ? baseUrl.split("checkout") : "https://airness.eu"
    return (
      <Image
        src={logoUrl}
        alt={companyName}
        className={`${className} cursor-pointer`}
        onClick={(e) => handleClick(e, split[0])}
      />
    )
  }
  return <Label className={className}>{companyName}</Label>
}

const handleClick = (e: any, url: any) => {
  window.location.href = url
}

const Image = styled.img`
  ${tw`w-60 max-w-full mb-5 md:mb-10`}
`

const Label = styled.h1`
  ${tw`mb-5 md:mb-12 font-extrabold uppercase tracking-wide text-xl text-black`}
`