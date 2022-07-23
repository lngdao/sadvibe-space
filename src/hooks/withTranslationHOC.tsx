import React from 'react'
import vi from '../translation/resources/vi'
import T from '../translation/T'

export type TStringParamsKey = Record<keyof typeof vi, string>

export const withTranslationHOC = (Component: any) => {
  return (props: any) => {
    const strings = T()

    return <Component T={strings} {...props} />
  }
}
