import * as CSS from 'csstype'
import {
  ButtonStyle,
  ButtonTemplateFragment,
  ImageTemplateFragment,
  PlainContainerTemplateFragment,
  TemplateFragment,
  TemplateFragmentTypes,
  TextTemplateFragment
} from '@openfin/workspace'

export function createContainer(
  containerType: 'column' | 'row',
  children: TemplateFragment[],
  style?: CSS.Properties
): PlainContainerTemplateFragment {
  return {
    type: TemplateFragmentTypes.Container,
    style: {
      display: 'flex',
      flexDirection: containerType,
      ...style
    },
    children
  }
}

export function createTextContainer(
  children: TemplateFragment[],
  style?: CSS.Properties
): PlainContainerTemplateFragment {
  return {
    type: TemplateFragmentTypes.Container,
    style: {
      ...style
    },
    children
  }
}

export function createText(
  dataKey: string,
  fontSize: number = 14,
  style?: CSS.Properties
): TextTemplateFragment {
  return {
    type: TemplateFragmentTypes.Text,
    dataKey,
    style: {
      fontSize: `${fontSize ?? 14}px`,
      ...style
    }
  }
}

export function createImage(
  dataKey: string,
  alternativeText: string,
  style?: CSS.Properties
): ImageTemplateFragment {
  return {
    type: TemplateFragmentTypes.Image,
    dataKey,
    alternativeText,
    style: {
      ...style
    }
  }
}

export function createButton(
  buttonStyle: ButtonStyle,
  titleKey: string,
  action: string,
  style?: CSS.Properties
): ButtonTemplateFragment {
  return {
    type: TemplateFragmentTypes.Button,
    buttonStyle,
    children: [createText(titleKey, 12)],
    action: action,
    style: {
      ...style
    }
  }
}
