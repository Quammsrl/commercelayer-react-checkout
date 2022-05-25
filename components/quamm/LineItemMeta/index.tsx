import React, { useContext, FunctionComponent, ReactNode } from 'react'
import LineItemChildrenContext from '../utils/LineItemChildrenContext'
// import Parent from '../utils/Parent'
import { LineItem } from '@commercelayer/sdk'
// import PropTypes from 'prop-types'

export type LineItemMetaType = Omit<LineItemMetaProps, 'children'> & {
  label: string
  lineItem: LineItem
}

type LineItemMetaProps = {
  children?: (props: LineItemMetaType) => ReactNode
} & JSX.IntrinsicElements['p']

const LineItemMeta: FunctionComponent<LineItemMetaProps> = (props) => {
  const { lineItem } = useContext(LineItemChildrenContext)
  const metadata = lineItem?.['metadata']
  return <p>ciao: { metadata }</p>
}

LineItemMeta.displayName = 'LineItemName'

export default LineItemMeta